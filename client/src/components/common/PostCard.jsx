import { useState, useEffect } from "react";
import activeStarIcon from "../../assets/icons/active_star.png";
import inactiveStarIcon from "../../assets/icons/inactive_star.png";
import chatBubbleIcon from "../../assets/icons/chat_bubble.png";   








export default function PostCard({ user, timestamp, content, likes, comments, isFollowing }) {
    const [following, setFollowing] = useState(isFollowing);
    const [liked, setLiked] = useState(false);

    return (
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg border border-gray-700">
            {/* Header with user info and follow button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-16 h-16 rounded-full border-4 border-blue-400 hover:scale-105 hover:shadow-[0px_5px_10px] hover:shadow-blue-500 cursor-pointer transition-transform duration-300  "
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✦</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-white text-xl font-semibold">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{timestamp}</p>
                    </div>
                </div>
                {/* Follow button */}
                <button 
                    onClick={() => setFollowing(!following)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        following 
                            ? 'bg-green-600 text-white hover:bg-green-400 cursor-pointer' 
                            : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
                    }`}
                >
                    {following ? 'Following' : 'Follow'}
                </button>
            </div>

            {/* Content */}
            <div className="text-white text-lg mb-6">
                {content}
            </div>

            {/* Engagement stats */}
            <div className="flex items-center space-x-8">

                {/* Likes */}
                <div className="flex items-center space-x-2" onClick = {() => setLiked(l => !l)}>
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                        <span className={`text-white text-xl p-1 ${liked ? "bg-red-500" : ""} rounded-full transition-all duration-300`}>
                            <img src = {liked ? activeStarIcon : inactiveStarIcon}></img>
                        </span>
                    </div>
                    <span className="text-white font-semibold">{likes}</span>
                </div>

                {/* Comments */}
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl p-1 bg-white/50 rounded-full cursor-pointer">
                            <img src = {chatBubbleIcon}></img>
                        </span>
                    </div>
                    <span className="text-white font-semibold">{comments}</span>
                </div>
            </div>
        </div>
    );
}