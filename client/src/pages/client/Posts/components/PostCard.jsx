import { useState, memo}from "react";

import ContentPostCard from "./ContentPostCard.jsx";
import PostDetailModal from "./PostDetailModal";
import ImageDetailModal from "../../Posts/components/ImageDetailModal";   
import useIntersectionObserver from "@/hooks/useIntersectionObserver.jsx";






const PostCard = memo (function PostCard({data}) {

    const [showPostDetail, setShowPostDetail] = useState(false);
    const [showImageDetail, setShowImageDetail] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const imageObserver = useIntersectionObserver({ threshold: 0.1 });
    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setShowImageDetail(true);
    }

    const handlePostClick = () => {
        setShowPostDetail(true);
    }


    return (
        <>
            <div ref = {imageObserver.ref} className={`bg-gray-800/70 rounded-2xl p-6 mb-6 shadow-lg border border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors
                 ${imageObserver.hasIntersected ? "animate__animated animate__fadeInUp" : ""}`} onClick={handlePostClick}>
                {imageObserver.hasIntersected && (
                    <ContentPostCard data={data} handleImageClick={handleImageClick} />
                )}
            </div>      

            {/* Post Detail Modal */}
            {showPostDetail && (
                <PostDetailModal
                    data = {data}   
                    onClose={() => setShowPostDetail(false)}
                    onImageClick={handleImageClick}
                />
            )}

            {/* Image Detail Modal */}
            {showImageDetail && (
                <ImageDetailModal
                    images={data.images}
                    currentIndex={selectedImageIndex}
                    onClose={() => setShowImageDetail(false)}
                />
            )}
    </>
    );
})
export default PostCard;