import { useState} from "react";
import { toast  }    from "sonner";
export default function FollowButton ({isFollowing, postId}) {
    const [following, setFollowing] = useState(isFollowing || false);
    const handleFollow = (e) => {
        e.stopPropagation();

        fetch (`${import.meta.env.VITE_API_URL}/api/post/${postId}/follow`, {
            method: "POST",
            credentials: "include",
        })
        .then (res => {
            if (!res.ok) {
                res.json().then (data=> {
                    throw new Error (data.message || "Failed to follow/unfollow user");
                })
            }
        })
        .then (data=> {
            setFollowing (!following);
        })
        .catch (err => {
            toast.error (err.message || "Error following/unfollowing user");
        })
    }
    return (<>

        <button
            onClick={handleFollow}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                following
                    ? 'bg-green-600 text-white hover:bg-green-500 cursor-pointer'
                    : 'bg-purple-600 text-white hover:bg-purple-700 cursor-pointer'
            }`}
        >
            {following ? 'Following' : 'Follow'}
        </button>
    </>);
}