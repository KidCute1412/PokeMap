import PostCard from "../components/common/PostCard";
import ShortcutToMap from "@/components/common/ShortcutToMap";


function ProfileHeader(){
    const userProfile = {
        name: "Lucifer",
        description: "Handsome Lucifer",
        followers: "1k2",
        following: "1k2",
        avatar: "https://i.pinimg.com/736x/e1/1d/96/e11d969662134a1cf1550a6a64401b0a.jpg"
    };

    return(
        <div className="bg-gray-800 rounded-2xl p-8 border-2 border-blue-500 shadow-lg ">
            <div className="flex justify-between items-start mb-6">
                {/* Left side - User info and stats */}
                <div className="grid grid-cols-2 w-full">
                    {/* Name and description */}
                    <div className="mb-6">
                        <h1 className="text-white text-4xl font-bold mb-2">{userProfile.name}</h1>
                        <p className="text-gray-300 text-lg">{userProfile.description}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex space-x-12">
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Followers</h3>
                            <p className="text-white text-2xl font-bold">{userProfile.followers}</p>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-1">Following</h3>
                            <p className="text-white text-2xl font-bold">{userProfile.following}</p>
                        </div>
                    </div>
                </div>
                
                {/* Right side - Profile picture */}
                <div className="relative ml-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 p-1">
                        <img 
                            src={userProfile.avatar} 
                            alt={userProfile.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    {/* Star decoration */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✦</span>
                    </div>
                </div>
            </div>
            
            {/* Edit Profile Button */}
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold py-4 rounded-2xl transition-colors cursor-pointer">
                Edit Profile
            </button>
        </div>
    );
}


function Posts(){
    const samplePosts = [
        {
            id: 1,
            user: {
                name: "Lucifer",
                avatar: "https://i.pinimg.com/736x/e1/1d/96/e11d969662134a1cf1550a6a64401b0a.jpg"
            },
            timestamp: "9:00pm 11/1/2025",
            content: "Nội dung bài viết",
            likes: 1001,
            comments: 1001,
            isFollowing: false
        },
        {
            id: 2,
            user: {
                name: "Ash Ketchum",
                avatar: "https://i.pinimg.com/736x/48/47/5d/48475d0b40a4b80c5bcb9a0061e83e5e.jpg"
            },
            timestamp: "8:30pm 11/1/2025",
            content: "Just caught a rare Pikachu in the wild! The weather was perfect for Pokemon hunting today. #PokemonGO #Pikachu",
            likes: 542,
            comments: 89,
            isFollowing: true
        },
        {
            id: 3,
            user: {
                name: "Misty Waters",
                avatar: "https://i.pinimg.com/736x/b1/8c/a6/b18ca68d356b63a5ccbc9f68c4be9525.jpg"
            },
            timestamp: "7:15pm 11/1/2025",
            content: "Beautiful sunset at the Pokemon Center today. Met some amazing trainers and their Pokemon companions!",
            likes: 823,
            comments: 156,
            isFollowing: false
        }
    ];

    return(
        <div className="max-w-2xl px-2 py-2 bg-sky-800 rounded-2xl">
            {samplePosts.map(post => (
                <PostCard 
                    key={post.id}
                    user={post.user}
                    timestamp={post.timestamp}
                    content={post.content}
                    likes={post.likes}
                    comments={post.comments}
                    isFollowing={post.isFollowing}
                />
            ))}
        </div>
    );
}
export default function ProfilePage(){

    return(
        <div className=" pt-20 px-4 ">
            <div className = " flex flex-col mx-auto w-[80%] ">
                <ProfileHeader />
                <div className = "w-[70%] mt-[30px]">
                    <Posts></Posts>
                </div>
            </div>
            <ShortcutToMap className = "top-[60%] right-[10%] w-[300px]"></ShortcutToMap>
            
        </div>
    );

}