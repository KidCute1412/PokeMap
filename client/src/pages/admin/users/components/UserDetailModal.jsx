import {X, UserPlus, Heart, Users, Mail, Calendar, Clock} from 'lucide-react';
import {useEffect} from "react";
export default function UserDetailModal ({ user, onClose }) {
  if (!user) return null;
  useEffect (() => {
    
    // Click outside to close modal
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains('fixed')) {
        onClose();
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  })
  return (
    <div className="fixed inset-0 bg-white/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header - Hero Style with Avatar Background */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-t-2xl overflow-hidden">
          {/* Avatar Background */}
          {user.profile && user.profile.avatar ? (
            <div className="absolute inset-0">
              <img
                src={user.profile.avatar}
                alt={user.username}
                className="w-full h-full object-cover opacity-30"
              />
              {/* Overlay để text dễ đọc */}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>
          ) : (
            /* Gradient background nếu không có avatar */
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600"></div>
          )}

          {/* Header Content */}
          <div className="relative z-10 flex items-center justify-between p-8 h-full">
            <div className="flex items-center gap-6">
              {/* Avatar Circle */}
              <div className="w-36 h-36 rounded-full bg-blue-300 text-black bg-opacity-20 backdrop-blur-sm border-white border-opacity-30 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.profile && user.profile.avatar ? (
                  <img
                    src={user.profile.avatar}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.username.charAt(0)
                )}
              </div>

              {/* User Info */}
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1 bg-blue-200/80 w-fit p-1 rounded-[10px]">{user.username}</h2>
                <p className="text-blue-100 text-lg bg-blue-200/80 w-fit p-1 rounded-[10px]">{user.email}</p>
  
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className=" absolute right-2 top-2 p-3 bg-rose-500 rounded-[10px] bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all cursor-pointer text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Following</p>
                  <p className="text-2xl font-bold text-blue-900">{user.profile.following}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl border border-rose-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-rose-600 font-medium">Followers</p>
                  <p className="text-2xl font-bold text-rose-900">{user.profile.followers}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Role</p>
                  <p className="text-lg font-bold text-green-900">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Mail className="w-6 h-6 text-blue-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="text-gray-900 font-medium truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Users className="w-6 h-6 text-purple-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium">Gender</p>
                  <p className={`font-semibold ${user.sex === "Male" ? "text-blue-600" : "text-rose-600"}`}>
                    {user.sex || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Calendar className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium">Join Date</p>
                  <p className="text-gray-900 font-medium">
                    
                  {new Date(user.createdAt).toLocaleString('vi-VN', {
                          timeZone: 'Asia/Ho_Chi_Minh',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Clock className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium">User ID</p>
                  <p className="text-gray-900 font-mono text-sm break-all">{user._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};