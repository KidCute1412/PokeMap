import { useState, useEffect} from 'react';
import { Eye, Trash2, Users, Search } from 'lucide-react';
import PaginationComponent from '@/components/common/Pagination';
import UserDetailModal from '@/pages/admin/users/components/UserDetailModal';
import DeleteConfirmModal from '@/pages/admin/users/components/UserDeleteModal';
import { useSearchParams } from 'react-router-dom';
import {toast} from "sonner";
import Loading from '@/components/common/Loading';
// User Detail Modal Component


// Delete Confirmation Modal Component



export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
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

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
  };



  // List Users and Total Users
  useEffect (() => {
    // List Users
    setIsLoading(true);
    const page = searchParams.get("page") || 1;
    fetch(`http://localhost:10000/api/admin/user/listUsers?page=${page}&limit=5`)
    .then (res => res.json())
    .then (data => {
      if (data.success){
        setUsers (data.data);
      }
    })
    .catch (err => {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    });

    // Total Users
    fetch(`http://localhost:10000/api/admin/user/total-users`)
    .then (res => res.json())
    .then (data => {
      if (data.success){
        
        setTotalUsers (data.data.totalUsers);
      }
    })
    .catch (err => {
      console.error("Error fetching total users:", err);
      toast.error("Failed to fetch total users");
    });

    setIsLoading(false);
  }, [searchParams]);

  // Number of Pages
  useEffect (()=> {
    //  Number of Pages
    setIsLoading(true);
    fetch("http://localhost:10000/api/admin/user/total-pages?limit=5")
    .then (res => res.json())
    .then (data => {
      if (data.success){
        setNumberOfPages (data.data.totalPages);
      }

    })
    .catch (err => {
      console.error("Error fetching total user pages:", err);
      toast.error("Failed to fetch total user pages");
    });
    setIsLoading(false);
    setCurrentPage (Number(searchParams.get("page")) || 1);
  }, [searchParams]);



  
  






  return (
    isLoading ? <Loading></Loading> :<div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-rose-400 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-500 text-3xl font-bold ">User Management Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-gray-600 mb-1">Total Users</p>
                <p className="text-green-500 font-bold text-2xl">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
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

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">User</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Role</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Sex</th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">Join In</th>
                  <th className="px-6 py-4 text-right text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">

                {
                  users && users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {/* User */}
                        <div className="flex items-center gap-3">
    
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-rose-300 flex items-center justify-center text-white flex-shrink-0">
                            {user.profile && user.profile.avatar ? (
                              <img
                                src={user.profile.avatar}
                                alt={user.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) :
                            (user.username.charAt(0))
                            }
                          </div>
                          <span className="text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text text-shadow-2xs bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      {/* Sex */}
                      <td className="px-6 py-4">
                        {user.sex ? <span className={`${user.sex === "Male" ? "text-blue-400" : "text-rose-400"}`}>{user.sex}</span>
                        : <span className="text-gray-400">N/A</span>}
      
                      </td>
                      <td className="px-6 py-4 text-sm text-shadow-2xs text-gray-600 w-[100px]">
                        {new Date(user.createdAt).toLocaleString('vi-VN', {
                          timeZone: 'Asia/Ho_Chi_Minh',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className = "h-5"></div>
            <PaginationComponent numberOfPages = {numberOfPages} currentPage = {currentPage} controlPage={handleSetCurrentPage} ></PaginationComponent>
          </div>
          
        </div>
        
        {/* Modals */}
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        <DeleteConfirmModal 
          user={userToDelete} 
          onClose={() => setUserToDelete(null)} 
        />

        
        
      </div>
    </div>
  );
}
