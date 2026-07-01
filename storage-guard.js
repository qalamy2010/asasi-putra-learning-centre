(function () {
  const fallback = new Map();

  function fallbackStorage() {
    return {
      getItem(key) {
        return fallback.has(key) ? fallback.get(key) : null;
      },
      setItem(key, value) {
        fallback.set(key, String(value));
      },
      removeItem(key) {
        fallback.delete(key);
      }
    };
  }

  try {
    const key = "__skorasasi1_storage_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
  } catch (error) {
    try {
      Object.defineProperty(window, "localStorage", {
        value: fallbackStorage(),
        configurable: true
      });
    } catch (innerError) {
      window.skorasasi1MemoryStorage = fallbackStorage();
    }
  }
})();
