
export const useAuthUser = () => {
  const userStr = localStorage.getItem("authUser");
  let authUser = null;
  try {
    if (userStr) {
      authUser = JSON.parse(userStr);
    }
  } catch {
    authUser = null;
  }
  return { authUser, isLoading: false, error: null };
};