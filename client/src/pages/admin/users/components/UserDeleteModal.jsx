import { AlertTriangle } from 'lucide-react';
import {useEffect} from "react";
import "animate.css";
const DeleteConfirmModal = ({ user, onClose }) => {
  if (!user) return null;
  // Handle click outside to close modal
  useEffect (() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains('fixed')) {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };

  }, [])

  const handleDeleteUser = async () => {
    await fetch(`http://localhost:10000/api/admin/user/deleteUser/${user._id}`, {
      method: 'DELETE',
    }).then (res => res.json())
    .then (data => {
      if (data.success){
        onClose();
        window.location.reload();
      }
    }).catch (err => {
      console.error("Error deleting user:", err);
      alert ("Failed to delete user");
    });
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50 " >
      <div className="bg-white rounded-2xl shadow-2xl max-w-[70%] h-[90%] overflow-y-auto scrollbar-hide w-full animate__animated animate__zoomIn">
        {/* Modal Header */}
        <div className="flex items-center gap-4 p-8 border-b border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Delete User</h2>
            <p className="text-gray-600">This action cannot be undone</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
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
              <div>
                <h3 className="font-bold text-gray-900">{user.username}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-3">⚠️ Are you absolutely sure?</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                This will permanently delete the user account and remove all associated data from our servers.
                This action cannot be reversed.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-2">What will be deleted:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• User account and profile information</li>
              <li>• All posts and content created by this user</li>
              <li>• Follow relationships and connections</li>
              <li>• Comments and interactions</li>
              <li>• Access permissions and settings</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-4 p-8 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 cursor-pointer bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Keep User
          </button>
          <button
            onClick={handleDeleteUser}
            className="flex-1 px-6 py-3 cursor-pointer bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Yes, Delete User
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmModal;