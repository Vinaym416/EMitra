import toast from "react-hot-toast";

export function useLogout() {
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return { logout, isPending: false };
}