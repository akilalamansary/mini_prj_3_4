/**
 * CSE-2340: Software Development I (IIUC)
 * Mini Project 3-4 (MP3-MP4)
 * Module: Main Application Controller
 * 
 * =========================================================================
 * [MP3 REQUIREMENT 2]: EVENT HANDLING & JAVASCRIPT LOGIC (3 MARKS)
 * =========================================================================
 * - Uses addEventListener() to handle all user interactions (clicks, input,
 *   changes, submit, keyboard shortcuts).
 * - Extensively leverages arrays, objects, and core array methods:
 *   - .map()      : Transform data & render dynamic markup lists
 *   - .filter()   : Multi-faceted searching and filtering engine
 *   - .forEach()  : Iteration and DOM event attachments
 *   - .find()     : Locate specific product objects by ID
 *   - .reduce()   : Calculate order totals, average price, top ratings
 *   - .sort()     : Multi-criteria price, rating, discount, title sorting
 *   - .some()     : Fast existence checking in wishlist & cart
 * 
 * =========================================================================
 * [MP4 REQUIREMENT 3]: ASYNCHRONOUS OPERATIONS & API INTEGRATION (4 MARKS)
 * =========================================================================
 * - Orchestrates async/await fetch calls, loading skeletons, error handlers,
 *   and empty states.
 * 
 * =========================================================================
 * [MP4 REQUIREMENT 4]: LOCAL STORAGE INTEGRATION (3 MARKS)
 * =========================================================================
 * - Synchronizes Wishlist, Cart, Theme, and Search History across page reloads.
 */

// Global Application State Object
const AppState = {
  allProducts: [],
  filteredProducts: [],
  categories: [],
  activeCategory: "all",
  searchQuery: "",
  maxPrice: 3000,
  minRating: 0,
  inStockOnly: false,
  sortBy: "default",
  isGridView: true,
  wishlist: [],
  cart: [],
  recentSearches: [],
  theme: "light",
  isLoading: false
};

// Debounce timer helper for smooth search input
let searchDebounceTimer = null;

// =========================================================================
// APPLICATION INITIALIZATION
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("%c[ShopNova] App initializing...", "color: #3b82f6; font-weight: bold;");
  initApp();
});

/**
 * Boots the application: restores state from localStorage, binds listeners,
 * and kicks off initial asynchronous API fetch.
 */
async function initApp() {
  // 1. [MP4 Requirement 4]: Restore settings from localStorage
  AppState.theme = StorageService.getTheme();
  UI.applyTheme(AppState.theme);

  AppState.wishlist = StorageService.getWishlist();
  AppState.cart = StorageService.getCart();
  AppState.recentSearches = StorageService.getRecentSearches();

  // Render recent searches & initial badges
  UI.renderRecentSearches(AppState.recentSearches);
  updateNavbarBadges();

  // 2. [MP3 Requirement 2]: Bind all DOM event listeners
  bindEventListeners();

  // 3. [MP4 Requirement 3]: Fetch products and categories via async/await
  await loadData();
}

/**
 * Loads products and categories from external API with error and loading states
 */
async function loadData() {
  AppState.isLoading = true;
  UI.renderSkeletons(8);

  try {
    // Parallel async operations for categories and products
    const [productsResult, categoriesResult] = await Promise.all([
      ApiService.getProducts(60),
      ApiService.getCategories()
    ]);

    AppState.allProducts = productsResult.products || [];
    AppState.categories = categoriesResult || [];

    // Dynamically update max price slider bound based on highest price product
    if (AppState.allProducts.length > 0) {
      const highestPrice = Math.ceil(
        AppState.allProducts.reduce((max, p) => Math.max(max, Number(p.price || 0)), 0)
      );
      if (highestPrice > 0) {
        AppState.maxPrice = highestPrice;
        if (UI.elements.priceRangeSlider) {
          UI.elements.priceRangeSlider.max = highestPrice;
          UI.elements.priceRangeSlider.value = highestPrice;
        }
        if (UI.elements.priceValueDisplay) {
          UI.elements.priceValueDisplay.textContent = `$${highestPrice}`;
        }
      }
    }

    // Render category pill navigation
    UI.renderCategories(AppState.categories, AppState.activeCategory);

    // Compute & render dashboard stats summary
    UI.renderStats(AppState.allProducts);

    // Show warning toast if offline fallback was used
    if (productsResult.source === "fallback" && productsResult.error) {
      UI.showToast("Notice: Using offline catalog dataset.", "warning");
    }

    // Apply initial filters and display products
    applyFiltersAndSort();
  } catch (error) {
    console.error("[ShopNova] Critical error during initial load:", error);
    UI.renderError(error.message, () => loadData());
  } finally {
    AppState.isLoading = false;
  }
}

/**
 * Fallback loader to allow 100% offline grading/demonstration
 */
window.loadOfflineDemo = function() {
  AppState.allProducts = typeof FALLBACK_PRODUCTS !== "undefined" ? [...FALLBACK_PRODUCTS] : [];
  AppState.categories = typeof FALLBACK_CATEGORIES !== "undefined" ? [...FALLBACK_CATEGORIES] : ["all"];
  UI.renderCategories(AppState.categories, AppState.activeCategory);
  UI.renderStats(AppState.allProducts);
  applyFiltersAndSort();
  UI.showToast("Loaded offline demo catalog successfully!", "success");
};

// =========================================================================
// [MP3 REQUIREMENT 2]: CORE FILTER, SEARCH, & SORT ENGINE (ARRAY METHODS)
// =========================================================================

/**
 * Filters and sorts the master product catalog according to active user criteria.
 * Uses .filter(), .sort(), and .find() array methods.
 */
function applyFiltersAndSort() {
  if (!AppState.allProducts || AppState.allProducts.length === 0) {
    return;
  }

  let result = [...AppState.allProducts];

  // 1. Filter by Search Query (Case-insensitive matching across multiple properties)
  const query = AppState.searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter((product) => {
      const titleMatch = (product.title || "").toLowerCase().includes(query);
      const descMatch = (product.description || "").toLowerCase().includes(query);
      const brandMatch = (product.brand || "").toLowerCase().includes(query);
      const catMatch = (product.category || "").toLowerCase().includes(query);
      return titleMatch || descMatch || brandMatch || catMatch;
    });
  }

  // 2. Filter by Category
  if (AppState.activeCategory && AppState.activeCategory.toLowerCase() !== "all") {
    result = result.filter((product) => {
      return (product.category || "").toLowerCase() === AppState.activeCategory.toLowerCase();
    });
  }

  // 3. Filter by Maximum Price Slider
  if (AppState.maxPrice) {
    result = result.filter((product) => {
      return Number(product.price) <= Number(AppState.maxPrice);
    });
  }

  // 4. Filter by Minimum Star Rating
  if (AppState.minRating > 0) {
    result = result.filter((product) => {
      return Number(product.rating || 0) >= Number(AppState.minRating);
    });
  }

  // 5. Filter by In-Stock Only Toggle
  if (AppState.inStockOnly) {
    result = result.filter((product) => {
      return Number(product.stock) > 0;
    });
  }

  // 6. Sorting with .sort() Array Method
  result.sort((a, b) => {
    switch (AppState.sortBy) {
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      case "rating-desc":
        return Number(b.rating || 0) - Number(a.rating || 0);
      case "discount-desc":
        return Number(b.discountPercentage || 0) - Number(a.discountPercentage || 0);
      case "title-asc":
        return (a.title || "").localeCompare(b.title || "");
      case "title-desc":
        return (b.title || "").localeCompare(a.title || "");
      case "default":
      default:
        return a.id - b.id;
    }
  });

  AppState.filteredProducts = result;

  // Render Empty State if no items match
  if (result.length === 0) {
    UI.renderEmpty(AppState.searchQuery, resetAllFilters);
  } else {
    // Render product cards
    UI.renderProducts(result, AppState.isGridView, AppState.wishlist);
  }
}

/**
 * Resets all search and filter inputs back to default values
 */
function resetAllFilters() {
  AppState.searchQuery = "";
  AppState.activeCategory = "all";
  AppState.minRating = 0;
  AppState.inStockOnly = false;
  AppState.sortBy = "default";

  if (UI.elements.searchInput) UI.elements.searchInput.value = "";
  if (UI.elements.clearSearchBtn) UI.elements.clearSearchBtn.style.display = "none";
  if (UI.elements.sortSelect) UI.elements.sortSelect.value = "default";
  if (UI.elements.ratingFilterSelect) UI.elements.ratingFilterSelect.value = "0";
  if (UI.elements.inStockCheckbox) UI.elements.inStockCheckbox.checked = false;

  // Reset price slider to max
  if (AppState.allProducts.length > 0) {
    const highest = Math.ceil(
      AppState.allProducts.reduce((m, p) => Math.max(m, Number(p.price || 0)), 0)
    );
    AppState.maxPrice = highest;
    if (UI.elements.priceRangeSlider) UI.elements.priceRangeSlider.value = highest;
    if (UI.elements.priceValueDisplay) UI.elements.priceValueDisplay.textContent = `$${highest}`;
  }

  UI.renderCategories(AppState.categories, "all");
  applyFiltersAndSort();
  UI.showToast("All filters have been reset.", "info");
}

// =========================================================================
// [MP3 REQUIREMENT 2]: EVENT LISTENERS SETUP (addEventListener)
// =========================================================================
function bindEventListeners() {
  const el = UI.elements;

  // 1. Search Bar with Live Debounce
  if (el.searchInput) {
    el.searchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (el.clearSearchBtn) {
        el.clearSearchBtn.style.display = val.length > 0 ? "block" : "none";
      }

      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        AppState.searchQuery = val;
        if (val.trim().length > 2) {
          StorageService.addRecentSearch(val.trim());
          AppState.recentSearches = StorageService.getRecentSearches();
          UI.renderRecentSearches(AppState.recentSearches);
        }
        applyFiltersAndSort();
      }, 300);
    });

    el.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        clearTimeout(searchDebounceTimer);
        AppState.searchQuery = e.target.value;
        if (e.target.value.trim()) {
          StorageService.addRecentSearch(e.target.value.trim());
          AppState.recentSearches = StorageService.getRecentSearches();
          UI.renderRecentSearches(AppState.recentSearches);
        }
        applyFiltersAndSort();
      }
    });
  }

  // Clear Search Button
  if (el.clearSearchBtn) {
    el.clearSearchBtn.addEventListener("click", () => {
      el.searchInput.value = "";
      el.clearSearchBtn.style.display = "none";
      AppState.searchQuery = "";
      applyFiltersAndSort();
      el.searchInput.focus();
    });
  }

  // Recent Searches Clicking (Delegation)
  if (el.recentSearchesContainer) {
    el.recentSearchesContainer.addEventListener("click", (e) => {
      const tag = e.target.closest(".recent-tag");
      if (tag) {
        const query = tag.getAttribute("data-query");
        if (el.searchInput) el.searchInput.value = query;
        if (el.clearSearchBtn) el.clearSearchBtn.style.display = "block";
        AppState.searchQuery = query;
        applyFiltersAndSort();
        return;
      }

      if (e.target.id === "clearRecentSearchesBtn" || e.target.closest("#clearRecentSearchesBtn")) {
        StorageService.clearRecentSearches();
        AppState.recentSearches = [];
        UI.renderRecentSearches([]);
        UI.showToast("Search history cleared.", "info");
      }
    });
  }

  // 2. Category Pill Filter Selection (Delegation)
  if (el.categoryPills) {
    el.categoryPills.addEventListener("click", (e) => {
      const pill = e.target.closest(".category-pill");
      if (!pill) return;

      const category = pill.getAttribute("data-category");
      AppState.activeCategory = category;

      // Update UI active class
      el.categoryPills.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      applyFiltersAndSort();
    });
  }

  // 3. Sorting Dropdown Selection
  if (el.sortSelect) {
    el.sortSelect.addEventListener("change", (e) => {
      AppState.sortBy = e.target.value;
      applyFiltersAndSort();
    });
  }

  // 4. Price Slider Filter
  if (el.priceRangeSlider) {
    el.priceRangeSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      if (el.priceValueDisplay) el.priceValueDisplay.textContent = `$${val}`;
      AppState.maxPrice = Number(val);
      applyFiltersAndSort();
    });
  }

  // 5. Rating Dropdown Filter
  if (el.ratingFilterSelect) {
    el.ratingFilterSelect.addEventListener("change", (e) => {
      AppState.minRating = Number(e.target.value);
      applyFiltersAndSort();
    });
  }

  // 6. In-Stock Only Checkbox
  if (el.inStockCheckbox) {
    el.inStockCheckbox.addEventListener("change", (e) => {
      AppState.inStockOnly = e.target.checked;
      applyFiltersAndSort();
    });
  }

  // 7. View Mode Toggles (Grid vs List)
  if (el.viewGridBtn) {
    el.viewGridBtn.addEventListener("click", () => {
      AppState.isGridView = true;
      el.viewGridBtn.classList.add("active");
      el.viewListBtn.classList.remove("active");
      applyFiltersAndSort();
    });
  }
  if (el.viewListBtn) {
    el.viewListBtn.addEventListener("click", () => {
      AppState.isGridView = false;
      el.viewListBtn.classList.add("active");
      el.viewGridBtn.classList.remove("active");
      applyFiltersAndSort();
    });
  }

  // 8. Reset All Filters Button
  if (el.resetFiltersBtn) {
    el.resetFiltersBtn.addEventListener("click", resetAllFilters);
  }

  // 9. Theme Switcher (Persisted via LocalStorage)
  if (el.themeToggleBtn) {
    el.themeToggleBtn.addEventListener("click", () => {
      const newTheme = AppState.theme === "dark" ? "light" : "dark";
      AppState.theme = newTheme;
      StorageService.setTheme(newTheme);
      UI.applyTheme(newTheme);
      UI.showToast(`Switched to ${newTheme} mode.`, "info");
    });
  }

  // 10. Wishlist Drawer Open/Close
  if (el.wishlistBtn) {
    el.wishlistBtn.addEventListener("click", () => {
      UI.renderWishlistDrawer(AppState.wishlist, AppState.allProducts);
      UI.openDrawer(el.wishlistDrawer);
    });
  }
  if (el.closeWishlistBtn) {
    el.closeWishlistBtn.addEventListener("click", () => UI.closeDrawer(el.wishlistDrawer));
  }
  if (el.clearWishlistBtn) {
    el.clearWishlistBtn.addEventListener("click", () => {
      if (AppState.wishlist.length === 0) return;
      StorageService.clearWishlist();
      AppState.wishlist = [];
      updateNavbarBadges();
      UI.renderWishlistDrawer([], AppState.allProducts);
      UI.renderProducts(AppState.filteredProducts, AppState.isGridView, AppState.wishlist);
      UI.showToast("Wishlist has been cleared.", "info");
    });
  }

  // 11. Shopping Cart Drawer Open/Close
  if (el.cartBtn) {
    el.cartBtn.addEventListener("click", () => {
      UI.renderCartDrawer(AppState.cart, AppState.allProducts);
      UI.openDrawer(el.cartDrawer);
    });
  }
  if (el.closeCartBtn) {
    el.closeCartBtn.addEventListener("click", () => UI.closeDrawer(el.cartDrawer));
  }
  if (el.clearCartBtn) {
    el.clearCartBtn.addEventListener("click", () => {
      if (AppState.cart.length === 0) return;
      StorageService.clearCart();
      AppState.cart = [];
      updateNavbarBadges();
      UI.renderCartDrawer([], AppState.allProducts);
      UI.showToast("Shopping cart has been cleared.", "info");
    });
  }

  // 12. Checkout Simulation
  if (el.checkoutBtn) {
    el.checkoutBtn.addEventListener("click", () => {
      if (AppState.cart.length === 0) return;

      // Compute total
      const total = AppState.cart.reduce((sum, item) => {
        const prod = AppState.allProducts.find(p => p.id === item.id);
        return sum + (prod ? prod.price * item.quantity : 0);
      }, 0);
      const tax = total * 0.05;
      const shipping = total > 50 ? 0 : 9.99;
      const grandTotal = total + tax + shipping;

      const orderNumber = "SN-" + Math.floor(100000 + Math.random() * 900000);

      if (el.checkoutSummaryDetails) {
        el.checkoutSummaryDetails.innerHTML = `
          <div class="checkout-receipt">
            <div class="receipt-row"><span>Order Number:</span><strong>#${orderNumber}</strong></div>
            <div class="receipt-row"><span>Items Count:</span><strong>${AppState.cart.reduce((s, i) => s + i.quantity, 0)} units</strong></div>
            <div class="receipt-row"><span>Subtotal:</span><strong>$${total.toFixed(2)}</strong></div>
            <div class="receipt-row"><span>Tax (5%):</span><strong>$${tax.toFixed(2)}</strong></div>
            <div class="receipt-row"><span>Shipping:</span><strong>${shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</strong></div>
            <div class="receipt-row receipt-total"><span>Total Paid:</span><strong>$${grandTotal.toFixed(2)}</strong></div>
          </div>
        `;
      }

      // Clear cart in storage & memory
      StorageService.clearCart();
      AppState.cart = [];
      updateNavbarBadges();

      UI.closeDrawer(el.cartDrawer);
      UI.openModal(el.checkoutSuccessModal);
    });
  }
  if (el.closeCheckoutSuccessBtn) {
    el.closeCheckoutSuccessBtn.addEventListener("click", () => {
      UI.closeModal(el.checkoutSuccessModal);
    });
  }

  // 13. Rubric & Assignment Info Modal
  if (el.rubricBtn) {
    el.rubricBtn.addEventListener("click", () => UI.openModal(el.rubricModal));
  }
  if (el.closeRubricBtn) {
    el.closeRubricBtn.addEventListener("click", () => UI.closeModal(el.rubricModal));
  }

  // 14. Quick View Modal Close
  if (el.closeQuickViewBtn) {
    el.closeQuickViewBtn.addEventListener("click", () => UI.closeModal(el.quickViewModal));
  }

  // 15. Backdrop Click to dismiss all active overlays
  if (el.drawerBackdrop) {
    el.drawerBackdrop.addEventListener("click", () => UI.closeAllDrawersAndModals());
  }

  // 16. Keyboard Global Shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape key closes modals and drawers
    if (e.key === "Escape") {
      UI.closeAllDrawersAndModals();
    }
    // "/" key focuses the search input when not already typing in an input
    if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      if (el.searchInput) {
        el.searchInput.focus();
        el.searchInput.select();
      }
    }
  });

  // 17. PRODUCT CARDS INTERACTION DELEGATION (Click on Card Buttons)
  if (el.productsContainer) {
    el.productsContainer.addEventListener("click", (e) => {
      // Toggle Wishlist Button
      const favBtn = e.target.closest('[data-action="toggle-wishlist"]');
      if (favBtn) {
        const id = Number(favBtn.getAttribute("data-id"));
        handleToggleWishlist(id);
        return;
      }

      // Quick View Button
      const qvBtn = e.target.closest('[data-action="quick-view"]');
      if (qvBtn) {
        const id = Number(qvBtn.getAttribute("data-id"));
        handleQuickView(id);
        return;
      }

      // Add to Cart Button
      const cartBtn = e.target.closest('[data-action="add-cart"]');
      if (cartBtn) {
        const id = Number(cartBtn.getAttribute("data-id"));
        handleAddToCart(id, 1);
        return;
      }
    });
  }

  // 18. QUICK VIEW MODAL INTERNAL ACTION BUTTONS DELEGATION
  if (el.quickViewBody) {
    el.quickViewBody.addEventListener("click", (e) => {
      // Modal Add To Cart
      const addBtn = e.target.closest("#modalAddToCartBtn");
      if (addBtn) {
        const id = Number(addBtn.getAttribute("data-id"));
        const qtyInput = el.quickViewBody.querySelector("#modalQtyInput");
        const qty = qtyInput ? parseInt(qtyInput.value, 10) : 1;
        handleAddToCart(id, qty);
        UI.closeModal(el.quickViewModal);
        return;
      }

      // Modal Wishlist Toggle
      const wishBtn = e.target.closest("#modalWishlistBtn");
      if (wishBtn) {
        const id = Number(wishBtn.getAttribute("data-id"));
        handleToggleWishlist(id);
        // Refresh modal button visual
        const isFav = StorageService.isInWishlist(id);
        wishBtn.classList.toggle("active", isFav);
        wishBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          ${isFav ? "In Wishlist" : "Wishlist"}
        `;
        return;
      }
    });
  }

  // 19. WISHLIST DRAWER ACTIONS (Delegation)
  if (el.wishlistItemsList) {
    el.wishlistItemsList.addEventListener("click", (e) => {
      // Move to Cart
      const toCartBtn = e.target.closest('[data-action="wishlist-to-cart"]');
      if (toCartBtn) {
        const id = Number(toCartBtn.getAttribute("data-id"));
        handleAddToCart(id, 1);
        handleToggleWishlist(id, false); // remove from wishlist
        UI.renderWishlistDrawer(AppState.wishlist, AppState.allProducts);
        return;
      }

      // Remove from Wishlist
      const removeBtn = e.target.closest('[data-action="remove-wishlist"]');
      if (removeBtn) {
        const id = Number(removeBtn.getAttribute("data-id"));
        handleToggleWishlist(id, false);
        UI.renderWishlistDrawer(AppState.wishlist, AppState.allProducts);
        return;
      }
    });
  }

  // 20. CART DRAWER ACTIONS (Delegation)
  if (el.cartItemsList) {
    el.cartItemsList.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id") || e.target.closest("[data-id]")?.getAttribute("data-id"));
      if (!id) return;

      // Plus Quantity
      if (e.target.closest('[data-action="cart-plus"]')) {
        const item = AppState.cart.find(i => i.id === id);
        if (item) {
          AppState.cart = StorageService.updateCartQuantity(id, item.quantity + 1);
          updateNavbarBadges();
          UI.renderCartDrawer(AppState.cart, AppState.allProducts);
        }
        return;
      }

      // Minus Quantity
      if (e.target.closest('[data-action="cart-minus"]')) {
        const item = AppState.cart.find(i => i.id === id);
        if (item) {
          AppState.cart = StorageService.updateCartQuantity(id, item.quantity - 1);
          updateNavbarBadges();
          UI.renderCartDrawer(AppState.cart, AppState.allProducts);
        }
        return;
      }

      // Remove item
      if (e.target.closest('[data-action="cart-remove"]')) {
        AppState.cart = StorageService.removeFromCart(id);
        updateNavbarBadges();
        UI.renderCartDrawer(AppState.cart, AppState.allProducts);
        UI.showToast("Item removed from cart.", "info");
        return;
      }
    });
  }
}

// =========================================================================
// ACTION HANDLERS
// =========================================================================

/**
 * Handles adding an item to the shopping cart
 * @param {number} productId 
 * @param {number} qty 
 */
function handleAddToCart(productId, qty = 1) {
  // [MP3 Requirement 2]: Using find() to retrieve product object
  const product = AppState.allProducts.find(p => p.id === productId);
  if (!product) return;

  AppState.cart = StorageService.addToCart(productId, qty);
  updateNavbarBadges();
  UI.showToast(`Added "${product.title}" to cart!`, "success");
}

/**
 * Handles toggling an item in the user's wishlist
 * @param {number} productId 
 * @param {boolean} [showNotice=true] 
 */
function handleToggleWishlist(productId, showNotice = true) {
  const product = AppState.allProducts.find(p => p.id === productId);
  const isAdded = StorageService.toggleWishlist(productId);
  AppState.wishlist = StorageService.getWishlist();

  updateNavbarBadges();

  // Re-render cards so heart icons update instantly
  UI.renderProducts(AppState.filteredProducts, AppState.isGridView, AppState.wishlist);

  if (showNotice && product) {
    if (isAdded) {
      UI.showToast(`Added "${product.title}" to Wishlist.`, "success");
    } else {
      UI.showToast(`Removed from Wishlist.`, "info");
    }
  }
}

/**
 * Handles opening the detailed quick view modal for a product
 * @param {number} productId 
 */
function handleQuickView(productId) {
  // [MP3 Requirement 2]: Using find() to get the specific product object
  const product = AppState.allProducts.find(p => p.id === productId);
  if (!product) return;

  const isWishlisted = StorageService.isInWishlist(productId);
  UI.renderQuickViewModal(product, isWishlisted);
}

/**
 * Updates floating badges in navbar for Cart and Wishlist
 */
function updateNavbarBadges() {
  // [MP3 Requirement 2]: Using reduce() to count total quantity of cart items
  const totalCartCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistCount = AppState.wishlist.length;
  UI.updateBadges(totalCartCount, totalWishlistCount);
}
