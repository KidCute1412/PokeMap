import ShortcutToMap from "@/components/common/ShortcutToMap";
import Posts from "@/pages/client/Posts/Posts";
import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Loading from "@/components/common/ClientLoading";
import {useAuth} from "@/routes/ProtectedRouter.jsx";
// username, email, sex, followers, following, avatar
function ProfileHeader(){

    const {user} = useAuth();
    console.log ("Authenticated user in ProfileHeader:", user);
    const [userProfile, setUserProfile] = useState();
    const {username_id} = useParams();
    const username = username_id.split("_")[0];
    const userId = username_id.split("_")[1];
    const isOwnerProfile = userId === user?._id;
    const [isLoading, setIsLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const navigate = useNavigate();
    // Fetch user profile data
    useEffect (() => {
        setIsLoading(true);
        fetch(`http://localhost:10000/api/user/profile?id=${userId}&username=${username}`)
        .then (res => res.json())
        .then (data => {
            if (data.success){
                setUserProfile(data.data);
            }
        })
        .catch (err => {
            console.error("Error fetching user profile:", err);
        })
        .finally(()=> {
            setIsLoading(false);
        })
    }, [username_id]);

    return(
        isLoading ? <Loading></Loading> :<div className="bg-gray-800 rounded-2xl p-8 border-2 border-blue-500 shadow-lg ">
            <div className="flex justify-between items-start mb-6">
                {/* Left side - User info and stats */}
                <div className="grid grid-cols-2 w-full">
                    {/* Name */}
                    <div className="mb-6">
                        <h1 className="text-white text-4xl font-bold mb-2">{userProfile.username}</h1>
                        {
                            (userProfile.sex && (userProfile.sex).toUpperCase() === "MALE") ?
                            (<p className="text-blue-400 text-lg mb-4">Male Trainer</p>) :
                            (<p className="text-rose-400 text-lg mb-4">Female Trainer</p>)
                        }
                        {/* Email */}
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-gray-400 text-lg">{userProfile.email}</span>
                        </div>
                    
                    </div>
                    {/* Stats */}
                    <div className="flex space-x-12">
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Followers</h3>
                            <p className="text-white text-2xl font-bold">{userProfile.profile.followers}</p>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Following</h3>
                            <p className="text-white text-2xl font-bold">{userProfile.profile.following}</p>
                        </div>
                    </div>
                </div>
                
                {/* Right side - Profile picture */}
                <div className="relative ml-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-1">
                        {(userProfile && userProfile.profile && userProfile.profile.avatar) ? (
                        <img 
                            src={userProfile.profile.avatar} 
                            alt={userProfile.name}
                            className="w-full h-full rounded-full object-cover"
                        />)
                        :
                        (<div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-bold">
                            {userProfile.username.charAt(0).toUpperCase()}
                        </div>)
                        }
                    </div>
                    {/* Star decoration */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✦</span>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-6">
                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <div
                        className={`text-gray-300 text-base leading-relaxed prose prose-invert max-w-none ${
                            !showFullDescription ? 'line-clamp-3' : ''
                        }`}
                        dangerouslySetInnerHTML={{__html: userProfile.description}}
                    ></div>

                    {/* Toggle Button */}
                    {userProfile.description && (
                        <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="mt-3 text-gray-500 hover:text-gray-300 cursor-pointer text-sm font-medium transition-colors"
                        >
                            {showFullDescription ? 'Shorten' : 'More'}
                        </button>
                    )}
                </div>
            </div>

            {/* Edit Profile Button */}
            {isOwnerProfile && <button onClick = {() => {navigate(`/profile/edit`)}} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors cursor-pointer">
                Edit Profile
            </button>}
        </div>
    );
}



export default function ProfilePage(){
    const {user} = useAuth();
    const {username_id} = useParams();
    const userId = username_id.split("_")[1];
    const isOwnerProfile = userId === user?._id;

    const [posts, setPosts] = useState ([]);

    useEffect (() => {
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
    }, [])
    return(
        <div className=" pt-20 px-4 ">
            <div className = " flex flex-col mx-auto w-[80%] ">
                <ProfileHeader />
                <div className = "grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 mt-8">
                    <div className = "w-full">
                        <Posts isOwnerProfile={isOwnerProfile} posts = {posts}></Posts>
                    </div>
                    <ShortcutToMap className = "top-[60%] right-[10%] w-[300px] static"></ShortcutToMap>
                </div>
                
            </div>
            
            
        </div>
    );

}