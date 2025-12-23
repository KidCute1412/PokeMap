import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ContentPostCard from "@/pages/client/Posts/components/ContentPostCard.jsx";
import Comment from "@/pages/client/Posts/components/Comment.jsx";
import { ArrowLeft } from "lucide-react";
import speakingurl from "speakingurl";
import { useAuth } from "@/routes/ProtectedRouter.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/post/${postId}/detail`, {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            
            if (data.status === "success") {
                setPost(data.data);
            } else {
                setError(data.message || "Post not found");
            }
        } catch (err) {
            console.error("Error fetching post:", err);
            setError("Failed to load post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    const isOwnerProfile = user && post && user._id === post.owner_id;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 pt-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Go back</span>
                    </button>
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">😕</div>
                        <h1 className="text-2xl font-bold text-white mb-2">Post not found</h1>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back button */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Go back</span>
                </button>

                {/* Post content */}
                {post && (
                    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left side - Post content */}
                            <div className="flex-1 p-6">
                                <ContentPostCard 
                                    data={post} 
                                    setData={setPost}
                                    isOwnerProfile={isOwnerProfile}
                                    onEditClick={() => {
                                        // Navigate to edit or show edit modal
                                        // You can implement edit functionality here
                                    }}
                                />
                            </div>
                            
                            {/* Right side - Comments */}
                            <div className="lg:w-[400px] border-t lg:border-t-0 lg:border-l border-gray-700">
                                <Comment data={post} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
