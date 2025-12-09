
export default function SearchBar(){

    return(
        <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-80">
            <input 
                type="text" 
                placeholder="Search Pokémon, locations..." 
                className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
            />
            <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
    );
}