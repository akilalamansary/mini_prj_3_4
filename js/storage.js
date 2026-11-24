/**
 * CSE-2340: Software Development I (IIUC)
 * Mini Project 3-4 (MP3-MP4)
 * Module: Storage Service
 * 
 * =========================================================================
 * [MP4 REQUIREMENT 4]: LOCAL STORAGE IMPLEMENTATION (3 MARKS)
 * =========================================================================
 * Stores and retrieves user-selected and application data using localStorage:
 * 1. Wishlist / Favorites: Saved product IDs persisted across reloads.
 * 2. Shopping Cart: Cart items with quantities and totals persisted across reloads.
 * 3. Theme Preference: Dark / Light mode preference persisted across reloads.
 * 4. Recent Searches: Past user search queries stored and rendered as quick tags.
 */

const STORAGE_KEYS = {
  WISHLIST: "shopnova_wishlist",
  CART: "shopnova_cart",
  THEME: "shopnova_theme",
  RECENT_SEARCHES: "shopnova_recent_searches"
};

const StorageService = {
  // -----------------------------------------------------------------------
  // 1. WISHLIST / FAVORITES (Persisted in localStorage)
  // -----------------------------------------------------------------------
  
  /**
   * Retrieves all favorited product IDs from localStorage
   * @returns {number[]} Array of product IDs
   */
  getWishlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading wishlist from localStorage:", error);
      return [];
    }
  },

  /**
   * Toggles a product ID in the wishlist (adds if absent, removes if present)
   * @param {number} productId 
   * @returns {boolean} True if now added, false if removed
   */
  toggleWishlist(productId) {
    const list = this.getWishlist();
    const numericId = Number(productId);
    const index = list.indexOf(numericId);
    let added = false;

    if (index > -1) {
      list.splice(index, 1);
      added = false;
    } else {
      list.push(numericId);
      added = true;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }

    return added;
  },

  /**
   * Checks if a product ID exists in the wishlist
   * @param {number} productId 
   * @returns {boolean}
   */
  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.includes(Number(productId));
  },

  /**
   * Clears the entire wishlist
   */
  clearWishlist() {
    try {
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  },

  // -----------------------------------------------------------------------
  // 2. SHOPPING CART (Persisted in localStorage)
  // -----------------------------------------------------------------------

  /**
   * Retrieves cart items from localStorage
   * @returns {Array<{id: number, quantity: number}>}
   */
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  },

  /**
   * Adds an item to cart or increments its quantity
   * @param {number} productId 
   * @param {number} qty 
   * @returns {Array} Updated cart
   */
  addToCart(productId, qty = 1) {
    const cart = this.getCart();
    const numericId = Number(productId);
    const existingIndex = cart.findIndex(item => item.id === numericId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({ id: numericId, quantity: qty });
    }

    this._saveCart(cart);
    return cart;
  },

  /**
   * Updates the exact quantity of an item in the cart
   * @param {number} productId 
   * @param {number} newQuantity 
   * @returns {Array} Updated cart
   */
  updateCartQuantity(productId, newQuantity) {
    let cart = this.getCart();
    const numericId = Number(productId);
    const qty = Number(newQuantity);

    if (qty <= 0) {
      cart = cart.filter(item => item.id !== numericId);
    } else {
      const item = cart.find(i => i.id === numericId);
      if (item) {
        item.quantity = qty;
      }
    }

    this._saveCart(cart);
    return cart;
  },

  /**
   * Removes an item completely from the cart
   * @param {number} productId 
   * @returns {Array} Updated cart
   */
  removeFromCart(productId) {
    const numericId = Number(productId);
    const cart = this.getCart().filter(item => item.id !== numericId);
    this._saveCart(cart);
    return cart;
  },

  /**
   * Clears the entire cart from localStorage
   */
  clearCart() {
    try {
      localStorage.removeItem(STORAGE_KEYS.CART);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },

  /**
   * Internal helper to save cart array to localStorage
   * @private
   */
  _saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  },

  // -----------------------------------------------------------------------
  // 3. THEME PREFERENCE (Persisted in localStorage)
  // -----------------------------------------------------------------------

  /**
   * Returns saved theme or system preference default
   * @returns {'light' | 'dark'}
   */
  getTheme() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) return savedTheme;

      // Default to user's system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    } catch (error) {
      return "light";
    }
  },

  /**
   * Saves user theme preference to localStorage
   * @param {'light' | 'dark'} theme 
   */
  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  },

  // -----------------------------------------------------------------------
  // 4. RECENT SEARCHES (Persisted in localStorage)
  // -----------------------------------------------------------------------

  /**
   * Retrieves recent search history
   * @returns {string[]}
   */
  getRecentSearches() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Adds a search query to recent searches (up to 5 unique recent items)
   * @param {string} query 
   */
  addRecentSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    let searches = this.getRecentSearches();
    // Remove if already exists so it gets bumped to front
    searches = searches.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
    searches.unshift(trimmed);

    // Keep only last 5
    if (searches.length > 5) {
      searches = searches.slice(0, 5);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  },

  /**
   * Clears recent searches
   */
  clearRecentSearches() {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  }
};
