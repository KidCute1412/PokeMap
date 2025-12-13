import PostCard from "@/pages/client/Posts/components/PostCard.jsx";
import CreatePostModal from "./components/CreatePostModal";
import {useState, memo} from "react";

const Posts = memo(function Posts({isOwnerProfile = false, posts = []}) {
    const [openCreatePostModal, setOpenCreatePostModal] = useState(false);


    return(
        <div className="max-w-full px-2 py-2 rounded-2xl">


            {isOwnerProfile && (
                <div className="mb-6">
                    <button
                        onClick={() => {setOpenCreatePostModal(true);}}
                        className="w-full bg-white/90 shadow-[5px_5px_10px] shadow-blue-900 hover:shadow-blue-500 hover:bg-white cursor-pointer text-gray-700 text-lg font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[101%] flex items-center justify-center space-x-3"
                    >
                        <span className="text-2xl">+</span>
                        <span>Create New Post</span>
                    </button>
                </div>
            )}
            {posts.map(post => (
                <PostCard
                    key={post._id}
                    data = {post}
                    isOwnerProfile={isOwnerProfile}
                />
            ))}

            {openCreatePostModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <CreatePostModal onClose={() => setOpenCreatePostModal(false)} />
                </div>
            )}
        </div>
    );
});

export default Posts;