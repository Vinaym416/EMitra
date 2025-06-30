import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../../components/ui/Header";
import BottomNav from "../../components/ui/ButtomNav";
import { axiosInstance } from "../../lib/axios";
import { ShuffleIcon } from "lucide-react";

export default function UserProfile() {
  const { authUser, logout } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // For avatar shuffle
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        const resProfile = await axiosInstance.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resProfile || resProfile.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        const user = resProfile.data.user;
        setUserInfo(user);
        setProfilePic(user?.profilepic || getRandomAvatar());
      } catch (error) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
    
  }, [authUser, navigate]);

  // Generate a random avatar URL
  function getRandomAvatar() {
    const idx = Math.floor(Math.random() * 100) + 1;
    return `https://avatar.iran.liara.run/public/${idx}.png`;
  }

  // Handler for avatar shuffle
  const handleRandomProfilePic = async () => {
    const randomAvatar = getRandomAvatar();
    setProfilePic(randomAvatar);
    toast.success("Random avatar generated successfully!");
    // Optionally, update on backend as well:
    // await axiosInstance.put("/user/profilepic", { profilepic: randomAvatar }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
  };

  // Detect mobile view
  const isMobile = window.innerWidth < 768;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 px-4 py-20 sm:px-8">
        {loading ? (
          <div className="text-center py-10">Loading profile...</div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center mb-4">
              {userInfo?.profilepic ? (
                <img
                  src={userInfo.profilepic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>
            {/* Only show shuffle button if user does NOT have a profilePic */}
            {!userInfo?.profilepic && (
              <div className="mb-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleRandomProfilePic}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-xl"
                >
                  <ShuffleIcon />
                  Avatar
                </button>
              </div>
            )}
            <div className="flex justify-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 text-center">
                Your Profile
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{userInfo?.username || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userInfo?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{userInfo?.phonenumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{userInfo?.address || "N/A"}</p>
              </div>
            </div>
            {/* Show View Orders button only on desktop */}
            {!isMobile && (
              <button
                className="px-4 py-1 border border-black bg-white text-black rounded-md font-semibold mt-4 text-sm hover:bg-gray-100 transition"
                onClick={() => navigate("/user/orders")}
              >
                View Orders
              </button>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
