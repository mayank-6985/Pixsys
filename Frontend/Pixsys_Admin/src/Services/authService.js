import api from "../../api";

export const authService = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },

  login: async (credentials) => {
    const response = await api.post(`auth/token/`, credentials);

    const accessToken = response.data.access || response.data.accessToken;
    const refreshToken = response.data.refresh || response.data.refreshToken;

    if (!accessToken) {
      console.error("Backend Response Data:", response.data);
      throw new Error(
        "Token keys did not match backend response. Check console.",
      );
    }

    authService.setTokens(accessToken, refreshToken);
    return response.data;
  },

  refreshToken: async () => {
    const currentRefresh = authService.getRefreshToken();
    if (!currentRefresh) throw new Error("No refresh token available");

    const response = await api.post(`auth/token/refresh/`, {
      refresh: currentRefresh, 
    });

    const newAccessToken = response.data.access || response.data.accessToken;
    const newRefreshToken =
      response.data.refresh || response.data.refreshToken || currentRefresh;

    authService.setTokens(newAccessToken, newRefreshToken);

    return newAccessToken;
  },

  logout: () => {
    authService.clearTokens();
    window.location.href = "/login";
  },
};
