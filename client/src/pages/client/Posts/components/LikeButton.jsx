import activeStarIcon from "@/assets/icons/active_star.png";
import inactiveStarIcon from "@/assets/icons/inactive_star.png";
import {useState} from "react";
import {toast} from "sonner";

export default function LikeButton ({isLiked, likes, postId}) {

    const [liked, setLiked] = useState(isLiked || false);
    const [likeCount, setLikeCount] = useState(likes || 0);


    const handleLikeClick = (e) => {
        e.stopPropagation();
        fetch (`${import.meta.env.VITE_API_URL}/api/post/${postId}/like`, {
            method: "POST",
            credentials: "include",
        })
        .then (res => {
            if (!res.ok) {
                return res.json().then (data=> {
                    throw new Error (data.message || "Failed to like/unlike post");
                })
            }
            return res.json();
        })
        .then (data => {
            console.log(data);
            setLiked (!liked);
            setLikeCount (liked ? likeCount - 1 : likeCount + 1);
        })
        .catch (err => {
            toast.error (err.message || "Error liking/unliking post");
        })
        
    }
    return (
        <>
        {/* Likes */}
            <div className="flex items-center space-x-2" onClick={handleLikeClick}>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                    <span className={`text-white text-xl p-1 ${liked ? "bg-red-600 shadow-[0px_0px_5px] shadow-red-100" : ""} rounded-full transition-all duration-300`}>
                        <img src={liked ? activeStarIcon : inactiveStarIcon} alt="like" />
                    </span>
                </div>
                <span className="text-white font-semibold">{likeCount}</span>
            </div>
        </>
    );
}