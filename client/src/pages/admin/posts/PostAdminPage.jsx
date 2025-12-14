import React, { useState, useEffect } from 'react';
import {useSearchParams} from "react-router-dom";
import {MessageCircle, Search  } from 'lucide-react';
import PostLine from '@/pages/admin/posts/components/PostLine.jsx';
import PaginationComponent from '@/components/common/Pagination';
import Loading from '@/components/common/AdminLoading';
import {toast} from "sonner";
const PostManagementDashboard = () => {
  const [posts, setPosts] = useState([]);
   const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ? parseInt(searchParams.get("page")) : 1);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total_posts, setTotalPosts] = useState(0);
  

  const [searchQuery, setSearchQuery] = useState('');


  // Fetch posts data -> get posts in current page and number of page
  useEffect (() => {
    setIsLoading(true);
    const page = searchParams.get("page") || 1;
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/post/listPosts?page=${page}&limit=5`,{
          method: "GET",
          credentials: "include"
        });
        const data = await response.json();
        if (!response.ok){
          throw new Error (data.message || "Failed to fetch posts");
        }
        setPosts(data.data);
        setNumberOfPages(data.numberOfPages);
        setTotalPosts(data.totalPost);
      }
      catch (error) {
        console.error("Error fetching posts:", error);
        toast.error(error.message || "Failed to fetch posts");
      }
    }
    fetchPosts().finally(() => setIsLoading (false));
    
    
  }, [searchParams]);

  



  const handleSetCurrentPage = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  }



  
  return (

    isLoading ? <Loading></Loading> : 
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-slate-800 text-4xl font-bold tracking-tight">Post Management</h1>
              <p className="text-slate-600 text-lg mt-1 font-medium">Monitor and manage posts across the platform</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-2">Total Posts</p>
                <p className="text-slate-800 font-bold text-3xl">{total_posts}</p>
                <p className="text-emerald-600 text-sm font-medium mt-1">Active content</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-slate-700 text-sm font-semibold mb-2">Search Posts</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search posts by author, content, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Posts Directory</h2>
            <p className="text-slate-600 text-sm mt-1">View and manage all posts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Warnings</th>
                   <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors duration-150">
                    <PostLine postInfo={post} />
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-slate-600 text-sm font-medium">
                Showing page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{numberOfPages}</span>
              </div>
              <PaginationComponent
                numberOfPages={numberOfPages}
                currentPage={currentPage}
                controlPage={handleSetCurrentPage}
              />
            </div>
          </div>
        </div>


      </div>
    </div>
    </div>
  );

};






export default PostManagementDashboard;