
import PostCard from "@/components/common/PostCard.jsx";
import ShortCutToMap from "@/components/common/ShortcutToMap.jsx";
import DragonModel from "@/components/3DModel.jsx";

export function Posts(){
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
        <div className="max-w-2xl mx-auto px-2 py-2 bg-sky-800 rounded-2xl">
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




export default function HomePage(){

    return(
        <div className="min-h-screen pt-20 px-4">
            <div className = "w-[55%] ml-[100px]">
                <Posts></Posts>
            </div>
            <DragonModel></DragonModel>
            <ShortCutToMap></ShortCutToMap>
        </div>
    );
}