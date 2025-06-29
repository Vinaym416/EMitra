import { useQuery } from "@tanstack/react-query";

const getAuthuser = async () => {
  const response = await fetch("http://localhost/api/auth/me");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useAuthUser = () => {
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthuser,
    retry: 1,
  });

  const authUser = authData?.user;


  return { authUser, isLoading, error };
};