/**
 * CSE-2340: Software Development I (IIUC)
 * Mini Project 3-4 (MP3-MP4)
 * Module: API Service
 * 
 * =========================================================================
 * [MP4 REQUIREMENT 3]: API INTEGRATION & ASYNCHRONOUS OPERATIONS (4 MARKS)
 * =========================================================================
 * - Retrieves product and category data from external REST API (DummyJSON)
 * - Implements modern JavaScript fetch() with async/await syntax
 * - Robust error handling with try...catch...finally blocks
 * - Network failure resiliency with graceful offline fallback data
 */

const API_CONFIG = {
  BASE_URL: "https://dummyjson.com/products",
  TIMEOUT_MS: 7000 // 7 seconds timeout to prevent hanging on poor networks
};

const ApiService = {
  /**
   * Helper function to wrap fetch with a timeout controller
   * @param {string} url 
   * @param {number} timeoutMs 
   * @returns {Promise<Response>}
   */
  async _fetchWithTimeout(url, timeoutMs = API_CONFIG.TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  },

  /**
   * Fetches products list from the external API using async/await
   * @param {number} limit 
   * @returns {Promise<{ products: Array, source: 'api' | 'fallback', error?: string }>}
   */
  async getProducts(limit = 50) {
    const url = `${API_CONFIG.BASE_URL}?limit=${limit}`;

    try {
      console.log(`[ApiService] Requesting external API: ${url}`);
      const response = await this._fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (!json || !Array.isArray(json.products)) {
        throw new Error("Invalid response schema received from API");
      }

      console.log(`[ApiService] Successfully fetched ${json.products.length} products from API.`);
      return {
        products: json.products,
        source: "api"
      };
    } catch (error) {
      console.warn("[ApiService] External fetch failed or network offline. Utilizing fallback data.", error.message);
      
      // Return structured object indicating failure + fallback data so UI can handle smoothly
      return {
        products: typeof FALLBACK_PRODUCTS !== "undefined" ? FALLBACK_PRODUCTS : [],
        source: "fallback",
        error: error.name === "AbortError" 
          ? "Network request timed out. Switched to offline backup data."
          : `External API unreachable (${error.message}). Switched to offline backup data.`
      };
    }
  },

  /**
   * Fetches categories list from API
   * @returns {Promise<Array<string>>}
   */
  async getCategories() {
    const url = `${API_CONFIG.BASE_URL}/categories`;

    try {
      const response = await this._fetchWithTimeout(url, 4000);
      if (!response.ok) throw new Error("Failed to load categories");

      const data = await response.json();
      
      // DummyJSON may return strings or objects [{slug, name, url}] in newer versions
      if (Array.isArray(data)) {
        return data.map(item => (typeof item === "string" ? item : item.slug || item.name));
      }
      return FALLBACK_CATEGORIES;
    } catch (err) {
      console.warn("[ApiService] Category fetch failed, using fallback category list.");
      return typeof FALLBACK_CATEGORIES !== "undefined" ? FALLBACK_CATEGORIES : ["all"];
    }
  },

  /**
   * Performs remote search on DummyJSON API
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchProducts(query) {
    if (!query || !query.trim()) return [];
    const url = `${API_CONFIG.BASE_URL}/search?q=${encodeURIComponent(query.trim())}`;

    try {
      const response = await this._fetchWithTimeout(url);
      if (!response.ok) throw new Error("Search request failed");
      const data = await response.json();
      return data.products || [];
    } catch (err) {
      console.warn("[ApiService] Remote search failed, falling back to local filter.");
      return null; // Signals caller to perform local in-memory filter
    }
  },

  /**
   * Fetches full details for a single product by ID
   * @param {number|string} id 
   * @returns {Promise<Object>}
   */
  async getProductById(id) {
    const url = `${API_CONFIG.BASE_URL}/${id}`;

    try {
      const response = await this._fetchWithTimeout(url);
      if (!response.ok) throw new Error(`Product #${id} not found`);
      return await response.json();
    } catch (err) {
      console.warn(`[ApiService] Product #${id} lookup failed, checking local data.`);
      if (typeof FALLBACK_PRODUCTS !== "undefined") {
        return FALLBACK_PRODUCTS.find(p => p.id === Number(id)) || null;
      }
      return null;
    }
  }
};
