import React, { useState, useEffect } from 'react';
import {useSearchParams} from "react-router-dom";
import { Eye, Trash2, AlertCircle, MessageCircle, Search  } from 'lucide-react';
import PostDetailModal from "@/pages/admin/posts/components/PostDetailModal";
import WarnModal from "@/pages/admin/posts/components/WarnModal";
import DeleteModal from "@/pages/admin/posts/components/DeleteModal";
import PaginationComponent from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
const PostManagementDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  

  const [searchQuery, setSearchQuery] = useState('');
  const [detailPost, setDetailPost] = useState(null);
  const [warnPost, setWarnPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);

  // Fetch posts data -> get posts in current page and number of page
  useEffect (() => {
    setIsLoading(true);
    const page = searchParams.get("page") || 1;
    fetch (`http://localhost:10000/api/admin/post/listPosts?page=${page}`)
    .then (res => res.json())
    .then (data => {
      if (data.success){
        setPosts (data.data);
        setNumberOfPages (data.numberOfPages);
      }
    })
    .catch (err => {
      console.error("Error fetching posts:", err);
    })
    .finally(()=> {
        setIsLoading(false);
    })
  }, [searchParams]);

  



  const handleSetCurrentPage = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  }



  return (
     isLoading ? <Loading></Loading> : <div className="min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-rose-400 p-3 rounded-2xl">
          <MessageCircle className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-500">Post Management Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-gray-500 text-sm">Total Posts</p>
            <p className="text-2xl font-bold text-green-500">{posts.length}</p>
          </div>
          <div className="bg-rose-400 p-3 rounded-2xl">
          <MessageCircle className="text-white" size={28} />
        </div>
        </div>
      </div>

      {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Content</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Engagement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Warning</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Created At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.avatar ? (
                        <img src={post.avatar} alt={post.username} className="w-10 h-10 rounded-full object-cover "></img>
                        ) :
                        (
                            <div className={` bg-linear-to-tr from-rose-500 to-rose-200 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold`}>
                              {post.username ? post.username.charAt(0) : null}
                            </div>
                        )
                      }

                      <span className="text-gray-800 font-medium">{post.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700 text-sm line-clamp-2">{post.content}</p>
                  </td>
            
                  <td className="px-6 py-4 text-sm w-[150px]">
                    <p className = "text-green-600 font-semibold">{post.likes} likes</p>
                    <p className = "text-gray-500 font-semibold ">{post.comments} comments</p> 
                  </td>

                  <td className="px-6 py-4 w-[100px] justify-center flex">
                    <p className="text-orange-500">{post.warning_counts ?? 0}</p>
                  </td>   

                  <td className="px-6 py-4 w-[100px]">
                    <p className="text-gray-700 text-sm">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN",{
                            timeZone: 'Asia/Ho_Chi_Minh',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour : '2-digit',
                            minute : '2-digit',
                            second : '2-digit'
                        })
                        }
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDetailPost(post)}
                        className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
                        title="View details"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => setWarnPost(post)}
                        className="text-orange-500 hover:text-orange-700 transition cursor-pointer"
                        title="Warn post"
                      >
                        <AlertCircle size={20} />
                      </button>
                      <button
                        onClick={() => setDeletePost(post)}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationComponent numberOfPages={numberOfPages} currentPage = {currentPage} controlPage = {handleSetCurrentPage}/>
          
        </div>
        

        
      </div>
      

      {/* Modals */}
      {detailPost && <PostDetailModal post={detailPost} onClose={() => setDetailPost(null)} />}
      {warnPost && <WarnModal post={warnPost} onClose={() => setWarnPost(null)} />}
      {deletePost && <DeleteModal post={deletePost} onClose={() => setDeletePost(null)} />}
    </div>
  );
};






export default PostManagementDashboard;