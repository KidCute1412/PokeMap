import { useState} from "react";
import { toast  }    from "sonner";
export default function FollowButton ({isFollowing, setIsFollowing, postId}) {
  
    const handleFollow = (e) => {
        e.stopPropagation();

        fetch (`${import.meta.env.VITE_API_URL}/api/post/${postId}/follow`, {
            method: "POST",
            credentials: "include",
        })
        .then (res => {
            if (!res.ok) {
                return res.json().then (data=> {
                    throw new Error (data.message || "Failed to follow/unfollow user");
                })
            }
            return res.json();
        })
        .then (data=> {

            setIsFollowing (prev => ({...prev, isFollowing: !isFollowing}))
        })
        .catch (err => {
            toast.error (err.message || "Error following/unfollowing user");
        })
    }
    return (<>

        <button
            onClick={handleFollow}
            className={`px-6 py-2 h-full rounded-full font-medium transition-colors ${
                isFollowing
                    ? 'bg-linear-to-r from-green-600 via-green-400 to-green-200 text-white hover:shadow-[0px_0px_5px] hover:scale-[105%] hover:shadow-green-200 animate__animated animate__rotateIn cursor-pointer'
                    : 'bg-purple-600 text-white hover:bg-purple-500 cursor-pointer animate__animated animate__fadeIn'
            }`}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    </>);
}