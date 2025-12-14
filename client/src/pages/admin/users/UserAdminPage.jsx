import { useState, useEffect} from 'react';
import {Users, Search } from 'lucide-react';
import PaginationComponent from '@/components/common/Pagination';
import { useSearchParams } from 'react-router-dom';
import {toast} from "sonner";
import Loading from '@/components/common/AdminLoading';
import UserLine from '@/pages/admin/users/components/UserLine';
// User Detail Modal Component


// Delete Confirmation Modal Component



export default function UserAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState();
  const [totalUsers, setTotalUsers] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") || 1);
  console.log("Current Page:", currentPage);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSetCurrentPage = (page) => {
    setCurrentPage(page);
    setSearchParams({ page });
  }




  // List Users and Total Users
  useEffect (() => {
    // List Users
    setIsLoading(true);
    const page = searchParams.get("page") || 1;
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/user/listUsers?page=${page}&limit=5`,{
      method: "GET",
      credentials: "include"
    })
    .then (res => { 
      if (!res.ok) {
        return res.json().then (data => {
          throw new Error (data.message || "Failed to fetch users");
        })
      }
      return res.json();
    })
    .then (data => {
        setUsers (data.data);
        setNumberOfPages (data.totalPages);
    })
    .catch (err => {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    });

    // Total Users
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/user/total-users`)
    .then (res => {
      if (!res.ok) {
        return res.json().then (data => {
          throw new Error (data.message || "Failed to fetch total users");
        })
      }
      return res.json();
    })
    .then (data => { 
        setTotalUsers (data.data);
    })
    .catch (err => {
      console.error("Error fetching total users:", err);
      toast.error("Failed to fetch total users");
    });

    setIsLoading(false);
  }, [searchParams]);




  return (
    isLoading ? <Loading></Loading> : 
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto overflow-x-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-slate-800 text-4xl font-bold tracking-tight">User Management</h1>
              <p className="text-slate-600 text-lg mt-1 font-medium">Manage and monitor user accounts across the platform</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-2">Total Users</p>
                <p className="text-slate-800 font-bold text-3xl">{totalUsers}</p>
                <p className="text-emerald-600 text-sm font-medium mt-1">Active accounts</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-slate-700 text-sm font-semibold mb-2">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by username, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-800 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800">Users Directory</h2>
            <p className="text-slate-600 text-sm mt-1">View and manage all registered users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {
                  users && users.map((user, index) => (
                      <UserLine key ={index} userInfo = {user}></UserLine>
                  ))
                }
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
}
