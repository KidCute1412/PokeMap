import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import speakingurl from "speakingurl";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function SearchBar() {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState({ users: [], posts: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("all"); // "all", "users", "posts"
    const searchRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (keyword.trim().length < 2) {
            setResults({ users: [], posts: [] });
            setShowDropdown(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            await performSearch();
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [keyword]);

    const performSearch = async () => {
        if (keyword.trim().length < 2) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/search?keyword=${encodeURIComponent(keyword.trim())}&userLimit=5&postLimit=5`
            );
            const data = await response.json();
            
            if (data.success) {
                setResults({
                    users: data.data.users || [],
                    posts: data.data.posts || [],
                    totalUsers: data.data.totalUsers || 0,
                    totalPosts: data.data.totalPosts || 0
                });
                setShowDropdown(true);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleUserClick = (user) => {
        setShowDropdown(false);
        setKeyword("");
        navigate(`/profile/${speakingurl(user.username)}_${user._id}`);
    };

    const handlePostClick = (post) => {
        setShowDropdown(false);
        setKeyword("");
        // Navigate directly to the post page
        navigate(`/post/${post._id}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && keyword.trim().length >= 2) {
            setShowDropdown(false);
            navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
        }
        if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    const handleViewAll = (type) => {
        setShowDropdown(false);
        navigate(`/search?q=${encodeURIComponent(keyword.trim())}&tab=${type}`);
    };

    // Highlight matching text
    const highlightText = (text, keyword) => {
        if (!text || !keyword) return text;
        const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === keyword.toLowerCase() 
                ? <span key={index} className="bg-yellow-500/30 text-yellow-300">{part}</span>
                : part
        );
    };

    // Strip HTML tags from content
    const stripHtml = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const filteredUsers = activeTab === "posts" ? [] : results.users;
    const filteredPosts = activeTab === "users" ? [] : results.posts;
    const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;

    return (
        <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-80">
                <input
                    type="text"
                    placeholder="Search users, posts..."
                    className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
                    value={keyword}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => keyword.trim().length >= 2 && setShowDropdown(true)}
                />
                <button 
                    className="text-gray-400 hover:text-white"
                    onClick={performSearch}
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-[70vh] overflow-hidden z-50">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                        <button
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === "all" 
                                    ? "text-blue-400 border-b-2 border-blue-400" 
                                    : "text-gray-400 hover:text-white"
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            All
                        </button>
                        <button
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === "users" 
                                    ? "text-blue-400 border-b-2 border-blue-400" 
                                    : "text-gray-400 hover:text-white"
                            }`}
                            onClick={() => setActiveTab("users")}
                        >
                            Users ({results.totalUsers || 0})
                        </button>
                        <button
                            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                                activeTab === "posts" 
                                    ? "text-blue-400 border-b-2 border-blue-400" 
                                    : "text-gray-400 hover:text-white"
                            }`}
                            onClick={() => setActiveTab("posts")}
                        >
                            Posts ({results.totalPosts || 0})
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-[60vh]">
                        {!hasResults && !isLoading && (
                            <div className="p-4 text-center text-gray-400">
                                No results found for "{keyword}"
                            </div>
                        )}

                        {/* Users Section */}
                        {filteredUsers.length > 0 && (
                            <div className="p-2">
                                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                    Users
                                </div>
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <img
                                            src={user.profile?.avatar || "/default-avatar.png"}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover bg-gray-600"
                                            onError={(e) => {
                                                e.target.src = "/default-avatar.png";
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-medium truncate">
                                                {highlightText(user.username, keyword)}
                                            </div>
                                            {user.description && (
                                                <div className="text-gray-400 text-sm truncate">
                                                    {highlightText(user.description, keyword)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            {user.profile?.followers || 0} followers
                                        </div>
                                    </div>
                                ))}
                                {results.totalUsers > 5 && (
                                    <button
                                        className="w-full text-center text-blue-400 hover:text-blue-300 text-sm py-2"
                                        onClick={() => handleViewAll("users")}
                                    >
                                        View all {results.totalUsers} users →
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Posts Section */}
                        {filteredPosts.length > 0 && (
                            <div className="p-2 border-t border-gray-700">
                                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                    Posts
                                </div>
                                {filteredPosts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="flex items-start gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                        onClick={() => handlePostClick(post)}
                                    >
                                        <img
                                            src={post.avatar || "/default-avatar.png"}
                                            alt={post.username}
                                            className="w-8 h-8 rounded-full object-cover bg-gray-600 flex-shrink-0"
                                            onError={(e) => {
                                                e.target.src = "/default-avatar.png";
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-gray-400 text-xs mb-1">
                                                @{post.username}
                                            </div>
                                            <div className="text-white text-sm line-clamp-2">
                                                {highlightText(stripHtml(post.content)?.substring(0, 150), keyword)}
                                                {stripHtml(post.content)?.length > 150 && "..."}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-gray-500 text-xs">
                                                <span>❤️ {post.likesCount || 0}</span>
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        {post.images?.length > 0 && (
                                            <img
                                                src={post.images[0]}
                                                alt="Post"
                                                className="w-12 h-12 rounded object-cover flex-shrink-0"
                                            />
                                        )}
                                    </div>
                                ))}
                                {results.totalPosts > 5 && (
                                    <button
                                        className="w-full text-center text-blue-400 hover:text-blue-300 text-sm py-2"
                                        onClick={() => handleViewAll("posts")}
                                    >
                                        View all {results.totalPosts} posts →
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {hasResults && (
                        <div className="border-t border-gray-700 p-2">
                            <button
                                className="w-full text-center text-gray-400 hover:text-white text-sm py-1"
                                onClick={() => handleViewAll("all")}
                            >
                                Press Enter to see all results
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}