/**
 * CSE-2340: Software Development I (IIUC)
 * Mini Project 3-4 (MP3-MP4)
 * Module: UI Renderer & DOM Controller
 * 
 * =========================================================================
 * [MP3 REQUIREMENT 1]: DOM MANIPULATION & DYNAMIC RENDERING (4 MARKS)
 * =========================================================================
 * - Uses JavaScript DOM methods and selectors (querySelector, getElementById,
 *   createElement, classList, innerHTML) to dynamically display API data.
 * - Implements rich dynamic views: Product Grid/List, Category Pills, Quick
 *   View Modal, Cart Drawer, Wishlist Drawer, and Toast notifications.
 * 
 * =========================================================================
 * [MP4 REQUIREMENT 3]: LOADING, ERROR, AND EMPTY STATES (4 MARKS)
 * =========================================================================
 * - Skeleton placeholders during asynchronous data fetching (Loading State).
 * - Interactive error banner with retry button (Error State).
 * - Informative "No products found" view with filter reset (Empty State).
 */

const UI = {
  // Cached DOM Element Selectors
  elements: {
    // Navigation & Header
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    wishlistBtn: document.getElementById("wishlistBtn"),
    cartBtn: document.getElementById("cartBtn"),
    wishlistBadge: document.getElementById("wishlistBadge"),
    cartBadge: document.getElementById("cartBadge"),
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    recentSearchesContainer: document.getElementById("recentSearchesContainer"),
    rubricBtn: document.getElementById("rubricBtn"),

    // Stats Banner
    statsSection: document.getElementById("statsSection"),
    statTotalProducts: document.getElementById("statTotalProducts"),
    statCategoriesCount: document.getElementById("statCategoriesCount"),
    statAvgPrice: document.getElementById("statAvgPrice"),
    statTopRated: document.getElementById("statTopRated"),
    statBestDiscount: document.getElementById("statBestDiscount"),

    // Filters & Controls
    categoryPills: document.getElementById("categoryPills"),
    sortSelect: document.getElementById("sortSelect"),
    priceRangeSlider: document.getElementById("priceRangeSlider"),
    priceValueDisplay: document.getElementById("priceValueDisplay"),
    ratingFilterSelect: document.getElementById("ratingFilterSelect"),
    inStockCheckbox: document.getElementById("inStockCheckbox"),
    viewGridBtn: document.getElementById("viewGridBtn"),
    viewListBtn: document.getElementById("viewListBtn"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    activeFiltersBar: document.getElementById("activeFiltersBar"),
    resultsCount: document.getElementById("resultsCount"),

    // Product Catalog Container
    productsContainer: document.getElementById("productsContainer"),

    // Modals & Drawers
    quickViewModal: document.getElementById("quickViewModal"),
    quickViewBody: document.getElementById("quickViewBody"),
    closeQuickViewBtn: document.getElementById("closeQuickViewBtn"),

    wishlistDrawer: document.getElementById("wishlistDrawer"),
    wishlistItemsList: document.getElementById("wishlistItemsList"),
    closeWishlistBtn: document.getElementById("closeWishlistBtn"),
    clearWishlistBtn: document.getElementById("clearWishlistBtn"),

    cartDrawer: document.getElementById("cartDrawer"),
    cartItemsList: document.getElementById("cartItemsList"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    clearCartBtn: document.getElementById("clearCartBtn"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartTax: document.getElementById("cartTax"),
    cartShipping: document.getElementById("cartShipping"),
    cartGrandTotal: document.getElementById("cartGrandTotal"),
    checkoutBtn: document.getElementById("checkoutBtn"),

    rubricModal: document.getElementById("rubricModal"),
    closeRubricBtn: document.getElementById("closeRubricBtn"),

    checkoutSuccessModal: document.getElementById("checkoutSuccessModal"),
    closeCheckoutSuccessBtn: document.getElementById("closeCheckoutSuccessBtn"),
    checkoutSummaryDetails: document.getElementById("checkoutSummaryDetails"),

    // Toasts & Drawers Backdrop
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    toastContainer: document.getElementById("toastContainer")
  },

  // -----------------------------------------------------------------------
  // [MP4 REQUIREMENT 3]: LOADING, ERROR, & EMPTY STATES
  // -----------------------------------------------------------------------

  /**
   * Renders skeleton placeholder shimmer cards during asynchronous fetch
   * @param {number} count 
   */
  renderSkeletons(count = 8) {
    const container = this.elements.productsContainer;
    container.className = "products-grid";
    
    let skeletonHTML = "";
    for (let i = 0; i < count; i++) {
      skeletonHTML += `
        <div class="product-card skeleton-card" aria-hidden="true">
          <div class="skeleton-box skeleton-img"></div>
          <div class="product-info">
            <div class="skeleton-box skeleton-tag"></div>
            <div class="skeleton-box skeleton-title"></div>
            <div class="skeleton-box skeleton-desc"></div>
            <div class="skeleton-box skeleton-rating"></div>
            <div class="skeleton-box skeleton-price"></div>
            <div class="skeleton-box skeleton-btn"></div>
          </div>
        </div>
      `;
    }
    container.innerHTML = skeletonHTML;
  },

  /**
   * Renders an interactive Error State with a Retry button
   * @param {string} message 
   * @param {Function} onRetry 
   */
  renderError(message, onRetry) {
    const container = this.elements.productsContainer;
    container.className = "state-wrapper";
    
    container.innerHTML = `
      <div class="state-card error-state animate-fade-in">
        <div class="state-icon error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3>Unable to Load Products</h3>
        <p class="state-description">${message || "An error occurred while connecting to the external API."}</p>
        <div class="state-actions">
          <button id="retryFetchBtn" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Retry Fetching
          </button>
          <button id="loadOfflineBtn" class="btn btn-outline">
            Use Offline Demo Data
          </button>
        </div>
      </div>
    `;

    // Attach retry event listener
    const retryBtn = document.getElementById("retryFetchBtn");
    if (retryBtn && typeof onRetry === "function") {
      retryBtn.addEventListener("click", onRetry);
    }

    // Attach offline fallback listener
    const offlineBtn = document.getElementById("loadOfflineBtn");
    if (offlineBtn) {
      offlineBtn.addEventListener("click", () => {
        if (typeof window.loadOfflineDemo === "function") {
          window.loadOfflineDemo();
        }
      });
    }
  },

  /**
   * Renders an interactive Empty State when filters produce no matches
   * @param {string} query 
   * @param {Function} onReset 
   */
  renderEmpty(query, onReset) {
    const container = this.elements.productsContainer;
    container.className = "state-wrapper";
    
    container.innerHTML = `
      <div class="state-card empty-state animate-fade-in">
        <div class="state-icon empty-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3>No Products Found</h3>
        <p class="state-description">
          ${query ? `No items matched your query "<strong>${this._escapeHTML(query)}</strong>".` : "No products match the selected filters."}
          <br>Try adjusting your search keywords, price range, or category filter.
        </p>
        <div class="state-actions">
          <button id="resetStateBtn" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
            Reset All Filters
          </button>
        </div>
      </div>
    `;

    const resetBtn = document.getElementById("resetStateBtn");
    if (resetBtn && typeof onReset === "function") {
      resetBtn.addEventListener("click", onReset);
    }
  },

  // -----------------------------------------------------------------------
  // [MP3 REQUIREMENT 1]: DOM MANIPULATION & DYNAMIC PRODUCT RENDERING
  // -----------------------------------------------------------------------

  /**
   * Dynamically renders product cards into the container
   * @param {Array} products 
   * @param {boolean} isGridView 
   * @param {number[]} wishlistIds 
   */
  renderProducts(products, isGridView = true, wishlistIds = []) {
    const container = this.elements.productsContainer;
    container.className = isGridView ? "products-grid" : "products-list";
    container.innerHTML = "";

    // Update count display
    if (this.elements.resultsCount) {
      this.elements.resultsCount.textContent = `Showing ${products.length} product${products.length === 1 ? "" : "s"}`;
    }

    if (!products || products.length === 0) {
      return;
    }

    // [MP3 Requirement 2]: Using forEach() array method to construct and append cards
    products.forEach((product) => {
      const isFav = wishlistIds.includes(product.id);
      const originalPrice = product.discountPercentage 
        ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
        : null;

      const card = document.createElement("article");
      card.className = "product-card animate-fade-in";
      card.setAttribute("data-id", product.id);
      card.setAttribute("data-category", product.category);

      const fallbackImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";

      card.innerHTML = `
        <div class="product-badge-wrap">
          ${product.discountPercentage > 5 ? `<span class="badge badge-discount">-${Math.round(product.discountPercentage)}%</span>` : ""}
          <span class="badge badge-category">${this._formatCategoryName(product.category)}</span>
        </div>

        <div class="product-media">
          <img 
            src="${product.thumbnail || fallbackImg}" 
            alt="${this._escapeHTML(product.title)}"
            class="product-thumb"
            loading="lazy"
            onerror="this.onerror=null; this.src='${fallbackImg}';"
          />
          <button 
            type="button" 
            class="btn-wishlist-toggle ${isFav ? "active" : ""}" 
            data-action="toggle-wishlist" 
            data-id="${product.id}"
            title="${isFav ? "Remove from Wishlist" : "Add to Wishlist"}"
            aria-label="${isFav ? "Remove from Wishlist" : "Add to Wishlist"}"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div class="product-info">
          <div class="product-brand">${this._escapeHTML(product.brand || "ShopNova Select")}</div>
          <h3 class="product-title" title="${this._escapeHTML(product.title)}">
            ${this._escapeHTML(product.title)}
          </h3>

          <p class="product-desc">${this._escapeHTML(product.description || "")}</p>

          <div class="product-rating-row">
            <div class="rating-stars" aria-label="Rated ${product.rating} out of 5">
              ${this._renderStars(product.rating)}
            </div>
            <span class="rating-number">${Number(product.rating).toFixed(1)}</span>
            <span class="reviews-count">(${product.reviews ? product.reviews.length : Math.floor(product.rating * 12)})</span>
          </div>

          <div class="product-pricing">
            <span class="current-price">$${Number(product.price).toFixed(2)}</span>
            ${originalPrice ? `<span class="original-price">$${originalPrice}</span>` : ""}
            <span class="stock-indicator ${product.stock < 10 ? "stock-low" : "stock-ok"}">
              ${product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left` : "In Stock") : "Out of Stock"}
            </span>
          </div>

          <div class="product-actions">
            <button 
              type="button" 
              class="btn btn-outline btn-sm quick-view-btn" 
              data-action="quick-view" 
              data-id="${product.id}"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Quick View
            </button>
            <button 
              type="button" 
              class="btn btn-primary btn-sm add-cart-btn" 
              data-action="add-cart" 
              data-id="${product.id}"
              ${product.stock === 0 ? "disabled" : ""}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  },

  // -----------------------------------------------------------------------
  // DYNAMIC CATEGORY PILLS (Using map() & DOM creation)
  // -----------------------------------------------------------------------

  /**
   * Dynamically renders category pill buttons
   * @param {string[]} categories 
   * @param {string} selectedCategory 
   */
  renderCategories(categories, selectedCategory = "all") {
    const pillsContainer = this.elements.categoryPills;
    if (!pillsContainer) return;

    // [MP3 Requirement 2]: Using map() array method to generate category pill elements
    const pillsHTML = ["all", ...categories.filter(c => c !== "all")].map((cat) => {
      const isSelected = cat.toLowerCase() === selectedCategory.toLowerCase();
      const displayName = this._formatCategoryName(cat);
      return `
        <button 
          type="button" 
          class="category-pill ${isSelected ? "active" : ""}" 
          data-category="${cat}"
        >
          ${displayName}
        </button>
      `;
    }).join("");

    pillsContainer.innerHTML = pillsHTML;
  },

  // -----------------------------------------------------------------------
  // STATS DASHBOARD SUMMARY BAR (Using map, filter, reduce)
  // -----------------------------------------------------------------------

  /**
   * Calculates and dynamically displays summary dashboard statistics
   * @param {Array} products 
   */
  renderStats(products) {
    if (!products || products.length === 0) return;

    // [MP3 Requirement 2]: Using reduce() to calculate average price
    const totalPrice = products.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
    const avgPrice = (totalPrice / products.length).toFixed(2);

    // [MP3 Requirement 2]: Using map() and Set to count unique categories
    const uniqueCategories = new Set(products.map(p => p.category)).size;

    // [MP3 Requirement 2]: Using reduce() to find the top rated item
    const topRatedItem = products.reduce((prev, current) => {
      return (Number(current.rating) > Number(prev.rating)) ? current : prev;
    }, products[0]);

    // [MP3 Requirement 2]: Using reduce() to find the highest discounted item
    const bestDiscountItem = products.reduce((prev, current) => {
      return ((current.discountPercentage || 0) > (prev.discountPercentage || 0)) ? current : prev;
    }, products[0]);

    // DOM text updates
    if (this.elements.statTotalProducts) {
      this.elements.statTotalProducts.textContent = products.length;
    }
    if (this.elements.statCategoriesCount) {
      this.elements.statCategoriesCount.textContent = uniqueCategories;
    }
    if (this.elements.statAvgPrice) {
      this.elements.statAvgPrice.textContent = `$${avgPrice}`;
    }
    if (this.elements.statTopRated) {
      this.elements.statTopRated.textContent = `${Number(topRatedItem.rating).toFixed(1)} ★ (${topRatedItem.title.substring(0, 16)}...)`;
    }
    if (this.elements.statBestDiscount) {
      this.elements.statBestDiscount.textContent = `${Math.round(bestDiscountItem.discountPercentage || 0)}% OFF`;
    }
  },

  // -----------------------------------------------------------------------
  // QUICK VIEW MODAL (DOM Manipulation & Details Rendering)
  // -----------------------------------------------------------------------

  /**
   * Renders the product details modal with image gallery and reviews
   * @param {Object} product 
   * @param {boolean} isWishlisted 
   */
  renderQuickViewModal(product, isWishlisted = false) {
    const modalBody = this.elements.quickViewBody;
    if (!modalBody) return;

    const originalPrice = product.discountPercentage 
      ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

    const images = (product.images && product.images.length > 0) ? product.images : [product.thumbnail];

    modalBody.innerHTML = `
      <div class="modal-grid">
        <!-- Gallery -->
        <div class="modal-gallery">
          <div class="main-image-wrap">
            <img id="modalMainImg" src="${images[0]}" alt="${this._escapeHTML(product.title)}" class="modal-main-img" />
          </div>
          ${images.length > 1 ? `
            <div class="gallery-thumbs">
              ${images.map((img, idx) => `
                <img 
                  src="${img}" 
                  alt="Thumb ${idx + 1}" 
                  class="gallery-thumb-item ${idx === 0 ? "active" : ""}" 
                  data-index="${idx}"
                />
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Details -->
        <div class="modal-details">
          <div class="modal-header-meta">
            <span class="badge badge-category">${this._formatCategoryName(product.category)}</span>
            <span class="product-sku">SKU: ${product.sku || "N/A"}</span>
          </div>

          <h2 class="modal-product-title">${this._escapeHTML(product.title)}</h2>
          <div class="modal-brand">Brand: <strong>${this._escapeHTML(product.brand || "ShopNova Select")}</strong></div>

          <div class="modal-rating-row">
            <div class="rating-stars">${this._renderStars(product.rating)}</div>
            <span class="rating-score">${Number(product.rating).toFixed(1)} / 5.0</span>
            <span class="reviews-count">(${product.reviews ? product.reviews.length : 12} customer reviews)</span>
          </div>

          <div class="modal-pricing">
            <span class="current-price">$${Number(product.price).toFixed(2)}</span>
            ${originalPrice ? `<span class="original-price">$${originalPrice}</span>` : ""}
            ${product.discountPercentage ? `<span class="badge badge-discount">Save ${Math.round(product.discountPercentage)}%</span>` : ""}
          </div>

          <p class="modal-desc">${this._escapeHTML(product.description || "")}</p>

          <!-- Specifications Table -->
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Availability</span>
              <span class="spec-val ${product.stock > 0 ? "text-success" : "text-danger"}">
                ${product.stock > 0 ? `${product.stock} units available` : "Out of stock"}
              </span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Warranty</span>
              <span class="spec-val">${this._escapeHTML(product.warrantyInformation || "1 Year Standard")}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Shipping</span>
              <span class="spec-val">${this._escapeHTML(product.shippingInformation || "Free Expedited Delivery")}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Return Policy</span>
              <span class="spec-val">${this._escapeHTML(product.returnPolicy || "30 Days Money Back")}</span>
            </div>
          </div>

          <!-- Quantity & Action Buttons -->
          <div class="modal-actions-box">
            <div class="qty-picker">
              <button type="button" class="qty-btn" id="modalQtyMinus" aria-label="Decrease quantity">-</button>
              <input type="number" id="modalQtyInput" class="qty-input" value="1" min="1" max="${product.stock || 99}" readonly />
              <button type="button" class="qty-btn" id="modalQtyPlus" aria-label="Increase quantity">+</button>
            </div>

            <button type="button" class="btn btn-primary btn-lg" id="modalAddToCartBtn" data-id="${product.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Shopping Cart
            </button>

            <button type="button" class="btn btn-outline btn-lg ${isWishlisted ? "active" : ""}" id="modalWishlistBtn" data-id="${product.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              ${isWishlisted ? "In Wishlist" : "Wishlist"}
            </button>
          </div>

          <!-- Reviews Section -->
          ${product.reviews && product.reviews.length > 0 ? `
            <div class="modal-reviews-section">
              <h4 class="reviews-header">Verified Customer Reviews (${product.reviews.length})</h4>
              <div class="reviews-list">
                ${product.reviews.map(rev => `
                  <div class="review-card">
                    <div class="review-top">
                      <span class="reviewer-name">${this._escapeHTML(rev.reviewerName || "Verified Buyer")}</span>
                      <div class="rating-stars">${this._renderStars(rev.rating)}</div>
                    </div>
                    <p class="review-comment">"${this._escapeHTML(rev.comment)}"</p>
                    <span class="review-date">${rev.date ? new Date(rev.date).toLocaleDateString() : "Recent"}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}
        </div>
      </div>
    `;

    // Modal gallery click listeners
    const thumbs = modalBody.querySelectorAll(".gallery-thumb-item");
    const mainImg = modalBody.querySelector("#modalMainImg");
    thumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        if (mainImg) mainImg.src = thumb.src;
      });
    });

    // Quantity buttons
    const qtyMinus = modalBody.querySelector("#modalQtyMinus");
    const qtyPlus = modalBody.querySelector("#modalQtyPlus");
    const qtyInput = modalBody.querySelector("#modalQtyInput");
    if (qtyMinus && qtyPlus && qtyInput) {
      qtyMinus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10);
        if (val > 1) qtyInput.value = val - 1;
      });
      qtyPlus.addEventListener("click", () => {
        let val = parseInt(qtyInput.value, 10);
        if (val < (product.stock || 99)) qtyInput.value = val + 1;
      });
    }

    // Show modal
    this.openModal(this.elements.quickViewModal);
  },

  // -----------------------------------------------------------------------
  // [MP4 REQUIREMENT 4]: WISHLIST DRAWER (LocalStorage Rendering)
  // -----------------------------------------------------------------------

  /**
   * Renders the Wishlist slide-out drawer
   * @param {number[]} wishlistIds 
   * @param {Array} allProducts 
   */
  renderWishlistDrawer(wishlistIds, allProducts) {
    const listContainer = this.elements.wishlistItemsList;
    if (!listContainer) return;

    if (!wishlistIds || wishlistIds.length === 0) {
      listContainer.innerHTML = `
        <div class="drawer-empty-state">
          <div class="empty-icon-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h4>Your Wishlist is Empty</h4>
          <p>Click the heart icon on any product to save it here for later.</p>
        </div>
      `;
      return;
    }

    // [MP3 Requirement 2]: Using map() and find() array methods
    const favoritedProducts = wishlistIds
      .map(id => allProducts.find(p => p.id === Number(id)))
      .filter(Boolean);

    listContainer.innerHTML = favoritedProducts.map(prod => `
      <div class="drawer-item animate-fade-in" data-id="${prod.id}">
        <img src="${prod.thumbnail}" alt="${this._escapeHTML(prod.title)}" class="drawer-item-img" />
        <div class="drawer-item-info">
          <h4 class="drawer-item-title">${this._escapeHTML(prod.title)}</h4>
          <div class="drawer-item-price">$${Number(prod.price).toFixed(2)}</div>
          <div class="drawer-item-meta">Category: ${this._formatCategoryName(prod.category)}</div>
          <div class="drawer-item-actions">
            <button class="btn btn-primary btn-xs" data-action="wishlist-to-cart" data-id="${prod.id}">
              Add to Cart
            </button>
            <button class="btn btn-outline btn-xs" data-action="remove-wishlist" data-id="${prod.id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  // -----------------------------------------------------------------------
  // [MP4 REQUIREMENT 4]: SHOPPING CART DRAWER (LocalStorage Rendering)
  // -----------------------------------------------------------------------

  /**
   * Renders Shopping Cart slide-out drawer with pricing summary
   * @param {Array<{id: number, quantity: number}>} cartItems 
   * @param {Array} allProducts 
   */
  renderCartDrawer(cartItems, allProducts) {
    const listContainer = this.elements.cartItemsList;
    if (!listContainer) return;

    if (!cartItems || cartItems.length === 0) {
      listContainer.innerHTML = `
        <div class="drawer-empty-state">
          <div class="empty-icon-circle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h4>Your Cart is Empty</h4>
          <p>Browse our catalog and add items to your shopping cart.</p>
        </div>
      `;

      if (this.elements.cartSubtotal) this.elements.cartSubtotal.textContent = "$0.00";
      if (this.elements.cartTax) this.elements.cartTax.textContent = "$0.00";
      if (this.elements.cartShipping) this.elements.cartShipping.textContent = "$0.00";
      if (this.elements.cartGrandTotal) this.elements.cartGrandTotal.textContent = "$0.00";
      if (this.elements.checkoutBtn) this.elements.checkoutBtn.disabled = true;
      return;
    }

    if (this.elements.checkoutBtn) this.elements.checkoutBtn.disabled = false;

    // [MP3 Requirement 2]: Using map() and find()
    const enrichedItems = cartItems.map(item => {
      const product = allProducts.find(p => p.id === Number(item.id));
      return {
        ...item,
        product: product || { title: `Product #${item.id}`, price: 0, thumbnail: "" }
      };
    });

    // Render items list
    listContainer.innerHTML = enrichedItems.map(item => `
      <div class="drawer-item animate-fade-in" data-id="${item.id}">
        <img src="${item.product.thumbnail}" alt="${this._escapeHTML(item.product.title)}" class="drawer-item-img" />
        <div class="drawer-item-info">
          <h4 class="drawer-item-title">${this._escapeHTML(item.product.title)}</h4>
          <div class="drawer-item-price">$${Number(item.product.price).toFixed(2)} each</div>
          
          <div class="cart-qty-row">
            <div class="qty-picker qty-picker-sm">
              <button class="qty-btn" data-action="cart-minus" data-id="${item.id}">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" data-action="cart-plus" data-id="${item.id}">+</button>
            </div>
            <span class="cart-item-total">$${(item.product.price * item.quantity).toFixed(2)}</span>
            <button class="btn-remove-item" data-action="cart-remove" data-id="${item.id}" title="Remove item">
              &times;
            </button>
          </div>
        </div>
      </div>
    `).join("");

    // [MP3 Requirement 2]: Using reduce() to calculate financial totals
    const subtotal = enrichedItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    const tax = subtotal * 0.05; // 5% VAT
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const grandTotal = subtotal + tax + shipping;

    if (this.elements.cartSubtotal) this.elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (this.elements.cartTax) this.elements.cartTax.textContent = `$${tax.toFixed(2)}`;
    if (this.elements.cartShipping) this.elements.cartShipping.textContent = shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`;
    if (this.elements.cartGrandTotal) this.elements.cartGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
  },

  // -----------------------------------------------------------------------
  // RECENT SEARCH TAGS RENDERING
  // -----------------------------------------------------------------------

  /**
   * Renders recent search tags below search bar
   * @param {string[]} searches 
   */
  renderRecentSearches(searches = []) {
    const container = this.elements.recentSearchesContainer;
    if (!container) return;

    if (!searches || searches.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = `
      <span class="recent-label">Recent:</span>
      ${searches.map(term => `
        <button type="button" class="recent-tag" data-query="${this._escapeHTML(term)}">
          ${this._escapeHTML(term)}
        </button>
      `).join("")}
      <button type="button" class="recent-clear-btn" id="clearRecentSearchesBtn" title="Clear history">
        Clear
      </button>
    `;
  },

  // -----------------------------------------------------------------------
  // BADGES & NOTIFICATIONS
  // -----------------------------------------------------------------------

  /**
   * Updates count badges on navbar icons
   * @param {number} cartCount 
   * @param {number} wishlistCount 
   */
  updateBadges(cartCount = 0, wishlistCount = 0) {
    if (this.elements.cartBadge) {
      this.elements.cartBadge.textContent = cartCount;
      this.elements.cartBadge.style.display = cartCount > 0 ? "inline-flex" : "none";
    }
    if (this.elements.wishlistBadge) {
      this.elements.wishlistBadge.textContent = wishlistCount;
      this.elements.wishlistBadge.style.display = wishlistCount > 0 ? "inline-flex" : "none";
    }
  },

  /**
   * Displays an animated toast alert
   * @param {string} message 
   * @param {'success' | 'info' | 'warning' | 'error'} type 
   */
  showToast(message, type = "info") {
    const container = this.elements.toastContainer;
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;

    const iconMap = {
      success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
      error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
      warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    toast.innerHTML = `
      <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
      <span class="toast-text">${this._escapeHTML(message)}</span>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 250);
    });

    setTimeout(() => {
      if (toast.isConnected) {
        toast.classList.add("toast-fade-out");
        setTimeout(() => toast.remove(), 250);
      }
    }, 3200);
  },

  // -----------------------------------------------------------------------
  // MODAL & DRAWER TOGGLE HELPERS
  // -----------------------------------------------------------------------

  openModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.add("active");
    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.classList.add("active");
    }
    document.body.style.overflow = "hidden";
  },

  closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.classList.remove("active");
    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.classList.remove("active");
    }
    document.body.style.overflow = "";
  },

  openDrawer(drawerElement) {
    if (!drawerElement) return;
    drawerElement.classList.add("open");
    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.classList.add("active");
    }
    document.body.style.overflow = "hidden";
  },

  closeDrawer(drawerElement) {
    if (!drawerElement) return;
    drawerElement.classList.remove("open");
    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.classList.remove("active");
    }
    document.body.style.overflow = "";
  },

  closeAllDrawersAndModals() {
    [
      this.elements.quickViewModal,
      this.elements.rubricModal,
      this.elements.checkoutSuccessModal
    ].forEach(m => m && m.classList.remove("active"));

    [
      this.elements.wishlistDrawer,
      this.elements.cartDrawer
    ].forEach(d => d && d.classList.remove("open"));

    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.classList.remove("active");
    }
    document.body.style.overflow = "";
  },

  // -----------------------------------------------------------------------
  // THEME SWITCHER HELPER
  // -----------------------------------------------------------------------

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (this.elements.themeToggleBtn) {
      const isDark = theme === "dark";
      this.elements.themeToggleBtn.setAttribute("title", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
      this.elements.themeToggleBtn.innerHTML = isDark
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <circle cx="12" cy="12" r="5"></circle>
             <line x1="12" y1="1" x2="12" y2="3"></line>
             <line x1="12" y1="21" x2="12" y2="23"></line>
             <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
             <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
             <line x1="1" y1="12" x2="3" y2="12"></line>
             <line x1="21" y1="12" x2="23" y2="12"></line>
             <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
             <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
           </svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
           </svg>`;
    }
  },

  // -----------------------------------------------------------------------
  // INTERNAL UTILITIES
  // -----------------------------------------------------------------------

  _renderStars(rating) {
    const r = Math.round(rating || 0);
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= r) {
        stars += `<span class="star-icon filled">★</span>`;
      } else {
        stars += `<span class="star-icon">☆</span>`;
      }
    }
    return stars;
  },

  _formatCategoryName(str) {
    if (!str) return "";
    return str
      .replace(/-/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());
  },

  _escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};
