import { useState } from "react";

export default function CommentsSection ({data}){
    const [comment, setComment] = useState("");

    // Sample comments data
    const sampleComments = [
        {
            id: 1,
            user: {
                name: "Ash Ketchum",
                avatar: "https://i.pinimg.com/736x/48/47/5d/48475d0b40a4b80c5bcb9a0061e83e5e.jpg"
            },
            content: "Amazing post! Love the Pokemon theme!",
            timestamp: "2 hours ago",
            likes: 5
        },
        {
            id: 2,
            user: {
                name: "Misty Waters",
                avatar: "https://i.pinimg.com/736x/b1/8c/a6/b18ca68d356b63a5ccbc9f68c4be9525.jpg"
            },
            content: "The artwork is incredible! 🔥",
            timestamp: "1 hour ago",
            likes: 3
        }
    ];
    return (
        <div className="w-96 border-l border-gray-700/50 flex flex-col bg-gray-800/30 backdrop-blur-sm">
            {/* Comments header */}
            <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Comments</h3>
                <p className="text-gray-400 text-sm mt-1">{sampleComments.length} comments</p>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {sampleComments.map(comment => (
                    <div key={comment.id} className="flex space-x-4 group">
                        <img
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-600 group-hover:border-blue-400 transition-colors"
                        />
                        <div className="flex-1">
                            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-white text-sm font-semibold">{comment.user.name}</span>
                                    <span className="text-gray-500 text-xs">•</span>
                                    <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                            <div className="flex items-center space-x-6 mt-3 ml-4">
                                <button className="text-gray-400 text-xs hover:text-blue-400 transition-colors font-medium">Like</button>
                                <button className="text-gray-400 text-xs hover:text-blue-400 transition-colors font-medium">Reply</button>
                                <span className="text-gray-500 text-xs">{comment.likes} likes</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add comment */}
            <div className="p-6 border-t border-gray-700/50 bg-gray-800/20 backdrop-blur-sm">
                <div className="flex space-x-4">
                    <div className="flex-1 flex space-x-3">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 bg-gray-800/80 text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/50 placeholder-gray-400 transition-all duration-200"
                        />
                        <button
                            onClick={() => setComment("")}
                            disabled={!comment.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:scale-105"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}