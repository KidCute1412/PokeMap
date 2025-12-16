import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import speakingurl from "speakingurl";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";
    const initialTab = searchParams.get("tab") || "all";

    const [keyword, setKeyword] = useState(query);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [userPage, setUserPage] = useState(1);
    const [postPage, setPostPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);

    const limit = 10;

    useEffect(() => {
        if (query) {
            setKeyword(query);
            fetchResults(query);
        }
    }, [query]);

    const fetchResults = async (searchKeyword) => {
        if (activeTab === "all" || activeTab === "users") {
            await fetchUsers(searchKeyword, 1);
        }
        if (activeTab === "all" || activeTab === "posts") {
            await fetchPosts(searchKeyword, 1);
        }
    };

    const fetchUsers = async (searchKeyword, page) => {
        setIsLoadingUsers(true);
        try {
            const response = await fetch(
                `${API_URL}/api/search/users?keyword=${encodeURIComponent(searchKeyword)}&page=${page}&limit=${limit}`
            );
            const data = await response.json();
            if (data.success) {
                if (page === 1) {
                    setUsers(data.data.users);
                } else {
                    setUsers((prev) => [...prev, ...data.data.users]);
                }
                setTotalUsers(data.data.total);
                setUserPage(page);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchPosts = async (searchKeyword, page) => {
        setIsLoadingPosts(true);
        try {
            const response = await fetch(
                `${API_URL}/api/search/posts?keyword=${encodeURIComponent(searchKeyword)}&page=${page}&limit=${limit}`
            );
            const data = await response.json();
            if (data.success) {
                if (page === 1) {
                    setPosts(data.data.posts);
                } else {
                    setPosts((prev) => [...prev, ...data.data.posts]);
                }
                setTotalPosts(data.data.total);
                setPostPage(page);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?q=${encodeURIComponent(keyword.trim())}&tab=${activeTab}`);
            fetchResults(keyword.trim());
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/search?q=${encodeURIComponent(query)}&tab=${tab}`);
        if (tab === "users" && users.length === 0) {
            fetchUsers(query, 1);
        }
        if (tab === "posts" && posts.length === 0) {
            fetchPosts(query, 1);
        }
    };

    const handleUserClick = (user) => {
        navigate(`/profile/${speakingurl(user.username)}_${user._id}`);
    };

    const handlePostClick = (post) => {
        // Navigate directly to the post page
        navigate(`/post/${post._id}`);
    };

    const handleLoadMoreUsers = () => {
        fetchUsers(query, userPage + 1);
    };

    const handleLoadMorePosts = () => {
        fetchPosts(query, postPage + 1);
    };

    // Highlight matching text
    const highlightText = (text, keyword) => {
        if (!text || !keyword) return text;
        const parts = text.split(new RegExp(`(${keyword})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === keyword.toLowerCase() ? (
                <span key={index} className="bg-yellow-500/30 text-yellow-300">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    // Strip HTML tags from content
    const stripHtml = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Search Header */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search users, posts..."
                            className="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Results count */}
                {query && (
                    <div className="mb-4 text-gray-400">
                        Found {totalUsers} users and {totalPosts} posts for "{query}"
                    </div>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-700 mb-6">
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === "all"
                                ? "text-blue-400 border-b-2 border-blue-400"
                                : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => handleTabChange("all")}
                    >
                        All Results
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === "users"
                                ? "text-blue-400 border-b-2 border-blue-400"
                                : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => handleTabChange("users")}
                    >
                        Users ({totalUsers})
                    </button>
                    <button
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                            activeTab === "posts"
                                ? "text-blue-400 border-b-2 border-blue-400"
                                : "text-gray-400 hover:text-white"
                        }`}
                        onClick={() => handleTabChange("posts")}
                    >
                        Posts ({totalPosts})
                    </button>
                </div>

                {/* Users Section */}
                {(activeTab === "all" || activeTab === "users") && (
                    <div className="mb-8">
                        {activeTab === "all" && users.length > 0 && (
                            <h2 className="text-xl font-bold text-white mb-4">Users</h2>
                        )}
                        
                        {isLoadingUsers && users.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : users.length === 0 && query ? (
                            activeTab === "users" && (
                                <div className="text-center text-gray-400 py-8">
                                    No users found for "{query}"
                                </div>
                            )
                        ) : (
                            <div className="space-y-3">
                                {users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <img
                                            src={user.profile?.avatar || "/default-avatar.png"}
                                            alt={user.username}
                                            className="w-14 h-14 rounded-full object-cover bg-gray-600"
                                            onError={(e) => {
                                                e.target.src = "/default-avatar.png";
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-semibold text-lg">
                                                {highlightText(user.username, query)}
                                            </div>
                                            {user.description && (
                                                <div className="text-gray-400 text-sm line-clamp-2 mt-1">
                                                    {highlightText(user.description, query)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right text-gray-500 text-sm">
                                            <div>{user.profile?.followers || 0} followers</div>
                                            <div>{user.profile?.following || 0} following</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {users.length < totalUsers && (
                            <div className="text-center mt-4">
                                <button
                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                    onClick={handleLoadMoreUsers}
                                    disabled={isLoadingUsers}
                                >
                                    {isLoadingUsers ? "Loading..." : "Load more users"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Posts Section */}
                {(activeTab === "all" || activeTab === "posts") && (
                    <div className="mb-8">
                        {activeTab === "all" && posts.length > 0 && (
                            <h2 className="text-xl font-bold text-white mb-4">Posts</h2>
                        )}

                        {isLoadingPosts && posts.length === 0 ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : posts.length === 0 && query ? (
                            activeTab === "posts" && (
                                <div className="text-center text-gray-400 py-8">
                                    No posts found for "{query}"
                                </div>
                            )
                        ) : (
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                                        onClick={() => handlePostClick(post)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={post.avatar || "/default-avatar.png"}
                                                alt={post.username}
                                                className="w-10 h-10 rounded-full object-cover bg-gray-600 flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = "/default-avatar.png";
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium">
                                                        @{post.username}
                                                    </span>
                                                    <span className="text-gray-500 text-sm">
                                                        · {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-white mt-2 whitespace-pre-wrap">
                                                    {highlightText(stripHtml(post.content), query)}
                                                </div>
                                                {post.images?.length > 0 && (
                                                    <div className="flex gap-2 mt-3 overflow-x-auto">
                                                        {post.images.slice(0, 4).map((img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={img}
                                                                alt={`Post image ${idx + 1}`}
                                                                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                                                            />
                                                        ))}
                                                        {post.images.length > 4 && (
                                                            <div className="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center text-gray-400">
                                                                +{post.images.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 mt-3 text-gray-400 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        ❤️ {post.likesCount || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        💬 {post.commentsCount || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {posts.length < totalPosts && (
                            <div className="text-center mt-4">
                                <button
                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                    onClick={handleLoadMorePosts}
                                    disabled={isLoadingPosts}
                                >
                                    {isLoadingPosts ? "Loading..." : "Load more posts"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty state */}
                {!query && (
                    <div className="text-center text-gray-400 py-16">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <p className="text-xl">Start searching for users or posts</p>
                    </div>
                )}
            </div>
        </div>
    );
}
