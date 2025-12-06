import { X } from 'lucide-react';
import {useEffect} from "react";
// PostDetailModal Component
const PostDetailModal = ({ post, onClose }) => {

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
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-[70%] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Post Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-6">
            <div className={` text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold`}>
              {post.avatar ? (
                        <img src={post.avatar} alt={post.username} className="w-10 h-10 rounded-full object-cover "></img>
                        ) :
                        (
                            <div className={` bg-linear-to-tr from-rose-500 to-rose-200 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold`}>
                              {post.username.charAt(0)}
                            </div>
                        )
                }
            </div>
            <div>
              <p className="text-gray-800 font-semibold">{post.username}</p>
              <p className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString("vi-VN",{
                            timeZone: 'Asia/Ho_Chi_Minh',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour : '2-digit',
                            minute : '2-digit',
                            second : '2-digit'
                        })
                        }
              </p>
            </div>
          </div>

          {/* Text Content */}
          <p className="text-gray-700 mb-6 leading-relaxed">{post.content}</p>

          {/* Images */}
          <div className="mb-6">
            <p className="text-gray-600 font-semibold mb-3">Images ({post.images.length})</p>
            <div className="grid grid-cols-2 gap-4">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Post ${idx}`} className="rounded-lg w-full h-48 object-cover" />
              ))}
            </div>
          </div>

          {/* Engagement */}
          <div className=" rounded-lg p-4">
            <p className="text-gray-600 font-semibold mb-2">Engagement</p>
            <div className="flex gap-6">
              <div>
                <p className="text-gray-500 text-sm">Likes</p>
                <p className="text-lg font-bold text-green-600">{post.likes}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Comments</p>
                <p className="text-lg font-bold text-gray-500">{post.comments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default PostDetailModal;