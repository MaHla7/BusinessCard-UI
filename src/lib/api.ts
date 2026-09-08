import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7091/api"
});

// مدیریت خطاهای API
api.interceptors.response.use(
  (response) => {
    // اگر درخواست موفق بود
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      console.error("API Error");
      console.error("Status:", status);
      console.error("Data:", data);

      // خطای Validation از Backend
      if (status === 400 && data) {
        console.error("Validation errors:", data.errors);
      }

      // خطای پیدا نشدن
      if (status === 404) {
        console.error("Resource not found.");
      }

      // خطای سرور
      if (status === 500) {
        console.error("Server error.");
      }
    } else {
      console.error("Unknown error:", error);
    }

    // خیلی مهم:
    // خطا را دوباره throw می‌کنیم تا سرویس/صفحه هم بتواند متوجه شکست درخواست شود.
    return Promise.reject(error);
  }
);

export default api;