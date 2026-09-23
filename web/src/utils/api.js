/**
 * API Client for ArthSetu
 *
 * Handles all API requests with:
 * - Automatic token management
 * - Request/response caching
 * - Error handling and retries
 * - Offline fallback
 * - Request timeout management
 */

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";
const REQUEST_TIMEOUT = 10000; // 10 seconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class APIClient {
  constructor() {
    this.cache = new Map();
    this.requestQueue = [];
    this.isOnline = navigator.onLine;
    this.token = null;

    // Listen for online/offline events
    window.addEventListener("online", () => this.handleOnline());
    window.addEventListener("offline", () => this.handleOffline());
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  /**
   * Get stored token
   */
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  /**
   * Build headers with auth token
   */
  buildHeaders(customHeaders = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build full URL
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
    return `${API_BASE_URL}${
      endpoint.startsWith("/") ? endpoint : "/" + endpoint
    }`;
  }

  /**
   * Get cache key
   */
  getCacheKey(method, url) {
    return `${method}:${url}`;
  }

  /**
   * Get from cache
   */
  getFromCache(method, url) {
    const key = this.getCacheKey(method, url);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    if (cached) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Set cache
   */
  setCache(method, url, data) {
    const key = this.getCacheKey(method, url);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clearCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Handle online event
   */
  handleOnline() {
    this.isOnline = true;
    console.log("App is online");
    this.processQueue();
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    this.isOnline = false;
    console.log("App is offline");
  }

  /**
   * Process queued requests when coming online
   */
  async processQueue() {
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      try {
        await request();
      } catch (error) {
        console.error("Failed to process queued request:", error);
      }
    }
  }

  /**
   * Make HTTP request with timeout
   */
  async makeRequest(url, options = {}) {
    const {
      method = "GET",
      body = null,
      headers = {},
      timeout = REQUEST_TIMEOUT,
      cache = true,
      retry = 2,
    } = options;

    const fullUrl = this.buildUrl(url);
    const fullHeaders = this.buildHeaders(headers);

    // Check cache for GET requests
    if (method === "GET" && cache) {
      const cached = this.getFromCache(method, fullUrl);
      if (cached) {
        return cached;
      }
    }

    // If offline and not in cache, queue the request
    if (!this.isOnline && method !== "GET") {
      return new Promise((resolve, reject) => {
        this.requestQueue.push(async () => {
          try {
            const result = await this.makeRequest(url, options);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Prepare request options
    const requestOptions = {
      method,
      headers: fullHeaders,
    };

    if (body) {
      requestOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    requestOptions.signal = controller.signal;

    // Make request with retry logic
    let lastError;
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions);

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));

          if (response.status === 401) {
            // Handle unauthorized - clear token and redirect to login
            this.setToken(null);
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
          }

          throw new APIError(
            errorData.message || response.statusText,
            response.status,
            errorData
          );
        }

        const data = await response.json();

        // Cache successful GET requests
        if (method === "GET" && cache) {
          this.setCache(method, fullUrl, data);
        }

        return data;
      } catch (error) {
        lastError = error;

        if (error instanceof TypeError) {
          // Network error
          if (!this.isOnline) {
            throw new OfflineError("No internet connection");
          }
        }

        if (error.name === "AbortError") {
          throw new TimeoutError(`Request timeout after ${timeout}ms`);
        }

        // Retry on network errors (but not on last attempt)
        if (attempt < retry) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
          continue;
        }

        throw lastError;
      }
    }

    throw lastError;
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    return this.makeRequest(url, { ...options, method: "GET" });
  }

  /**
   * POST request
   */
  async post(url, body, options = {}) {
    return this.makeRequest(url, { ...options, method: "POST", body });
  }

  /**
   * PUT request
   */
  async put(url, body, options = {}) {
    return this.makeRequest(url, { ...options, method: "PUT", body });
  }

  /**
   * PATCH request
   */
  async patch(url, body, options = {}) {
    return this.makeRequest(url, { ...options, method: "PATCH", body });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this.makeRequest(url, { ...options, method: "DELETE" });
  }

  /**
   * Upload file
   */
  async uploadFile(url, file, options = {}) {
    const formData = new FormData();
    formData.append("file", file);

    const fullUrl = this.buildUrl(url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new APIError(response.statusText, response.status);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new TimeoutError(`Upload timeout`);
      }
      throw error;
    }
  }
}

/**
 * Custom Error Classes
 */

class APIError extends Error {
  constructor(message, status = 500, data = {}) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "TimeoutError";
  }
}

class OfflineError extends Error {
  constructor(message) {
    super(message);
    this.name = "OfflineError";
  }
}

// Export singleton instance
const api = new APIClient();

export default api;
export { APIError, TimeoutError, OfflineError };
