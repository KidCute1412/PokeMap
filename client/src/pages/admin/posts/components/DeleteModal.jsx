import { Trash2, X } from 'lucide-react';
import {useEffect} from "react";
import {toast} from "sonner";
import "animate.css"
// DeleteModal Component
const DeleteModal = ({ post, onClose}) => {

  useEffect(() => {
    const handleClose = (event) => {
        if (event.target.classList.contains('fixed')) {
            onClose();
        }
    }
    window.addEventListener('click', handleClose);
    return () => {
        window.removeEventListener('click', handleClose);
    }
  }, []);

  const handleDelete = () => {
    fetch(`http://localhost:10000/api/admin/post/delete/${post._id}`, {
      method: 'PATCH',
    })
    .then (res => res.json())
    .then (data => {
        if (data.success){
            toast.success("Post has been deleted successfully.");
            onClose();
        }
        else {
            toast.error("Failed to delete the post: " + data.message);
        }
    })
    .catch (err => {
        console.error("Error deleting post:", err);
        toast.error("Failed to delete the post.");
    });

  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-50 rounded-3xl max-w-md w-full animate__animated animate__zoomIn shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Trash2 className="text-red-500" size={24} />
            Xóa bài viết
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">Are you sure to delete this post?</p>
          <p className="text-gray-600 text-sm mb-6">The post is from <span className="font-semibold">{post.username}</span>: "{post.content.substring(0, 50)}..."</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">⚠️ This action can't be undo.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick = {handleDelete}
            className="px-6 py-2 cursor-pointer bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;