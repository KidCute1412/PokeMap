import { useState, useEffect } from "react";
import CommentSection from "@/components/CommentSection";
import { useAuth } from "@/routes/ProtectedRouter";

export default function CommentsSection({ data }) {
    const { user } = useAuth();
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        if (user && user._id) {
            setCurrentUserId(user._id);
        }
    }, [user]);

    if (!data || !data._id) {
        return <div className="text-gray-400 p-4">Post data not available</div>;
    }

    return (
        <div className="w-96 border-l border-gray-700/50 flex flex-col bg-gray-800/30 backdrop-blur-sm overflow-hidden">
            {/* Comments header */}
            <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Comments</h3>
                <p className="text-gray-400 text-sm mt-1">{data.comments || 0} comments</p>
            </div>

            {/* Comment section with socket support */}
            <div className="flex-1 overflow-hidden">
                <CommentSection postId={data._id} currentUserId={currentUserId} />
            </div>
        </div>
    );
}