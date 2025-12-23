import ShortcutToMap from "@/components/common/ShortcutToMap";
import Posts from "@/pages/client/Posts/Posts";
import {useState, useEffect, useMemo} from "react";
import {useParams} from "react-router-dom";
import ProfileHeader from "@/pages/client/Profile/components/ProfileHeader.jsx";

import {useAuth} from "@/routes/ProtectedRouter.jsx";
// username, email, sex, followers, following, avatar




export default function ProfilePage(){
    const [isBanned, setIsBanned] = useState(false);
    const {user} = useAuth();
    const {username_id} = useParams();
    const userId = username_id.split("_")[1];
    const isOwnerProfile = userId === user?._id;

    const [posts, setPosts] = useState ([]);
    useEffect (() => {
        // Check if user is banned
        fetch(`${import.meta.env.VITE_API_URL}/api/user/banned?id=${userId}`, {
            method : "GET",
            credentials : "include",
        })
        .then (res => res.json())
        .then (data => {
            setIsBanned(data.isBanned);
        })
        .catch (err => {
            console.error ("Error checking if user is banned:", err);
        });
    }, [])
    useEffect (() => {
        if (isBanned) {
            return;
        }
        fetch (`${import.meta.env.VITE_API_URL}/api/post/get_user_post?userId=${userId}`,
            {
                method : "GET",
                credentials : "include",
            }
        )
        .then(res => res.json())
        .then(data => {
            if (data.status === "success"){
                setPosts (data.data);
                console.log ("Fetched user posts:", data.data);
            }
        })
        .catch (err => {
            console.error ("Error fetching user posts:", err);
        });
    }, [username_id, isBanned])
    
    // Memoize posts to prevent unnecessary re-renders
    const memoizedPosts = useMemo(() => posts, [posts.length, posts.map(p => p._id).join(',')]);
    
    if (isBanned){
        return (
            <div className=" pt-20 px-4 ">
                <div className = " flex flex-col mx-auto w-[80%] ">
                    <div className="text-center text-red-500 font-semibold mt-10">
                        This user has been banned and their profile is not accessible.
                    </div>
                </div>
            </div>
        );
    }
    return(
        <div className=" pt-20 px-4 ">
            <div className = " flex flex-col mx-auto w-[80%] ">
                <ProfileHeader />
                <div className = "grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 mt-8">
                    <div className = "w-full">
                        <Posts isOwnerProfile={isOwnerProfile} posts = {memoizedPosts} setPosts = {setPosts}></Posts>
                    </div>
                    <ShortcutToMap className = "top-[60%] right-[10%] w-[300px] static"></ShortcutToMap>
                </div>
                
            </div>
            
            
        </div>
    );

}