import { useAuth } from "../context/AuthContext";

const UserProfileCard = () => {
  const { user, logout } = useAuth(); // include logout

  const initials = user?.name ? user.name[0].toUpperCase() : "?";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow w-full max-w-xs">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user?.name || "User"}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email || "No email"}
          </p>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfileCard;
