import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import {toast} from "sonner";
// WarnModal Component
const WarnModal = ({ post, onClose }) => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  
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
  
  const reasons = [
    { value: 'inappropriate', label: 'Content is inappropriate' },
    { value: 'spam', label: 'This is spam' },
    { value: 'misleading', label: 'Content is misleading' },
    { value: 'violent', label: 'Violent content' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = () => {
    if (!reason) {
      toast.error ("Please select a reason for the warning.");
      return;
    }
    fetch(`http://localhost:10000/api/admin/post/warn/${post._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        warningType: reason,
        description: comment
      })
    })
    .then (res => res.json())
    .then (data => {
        if (data.success){
            toast.success("Post has been warned successfully.");
            // onClose();
        }
        else {
            toast.error("Failed to warn the post: " + data.message);
        }
    })
    .catch (err => {
        console.error("Error warning post:", err);
        toast.error("Failed to warn the post.");
    });


    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-[50%] w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-orange-500" size={24} />
            Cảnh cáo bài viết
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">Bài viết của <span className="font-semibold">{post.author}</span></p>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Lý do cảnh cáo</label>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label key={r.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Ghi chú thêm (tuỳ chọn)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập ghi chú..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 cursor-pointer bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Cảnh cáo
          </button>
        </div>
      </div>
    </div>
  );
};
export default WarnModal;