import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PokedexCard from '@/components/pokemon/PokedexCard';
import PokedexFilterBar from '@/components/pokemon/PokedexFilterBar';
import Loading from "@/components/common/ClientLoading.jsx";

export default function PokedexPage() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 100;

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
        const data = await response.json();

        setTotalPokemon(data.count);

        const detailedPromises = data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return res.json();
        });

        const detailedData = await Promise.all(detailedPromises);
        setAllPokemon(detailedData);
      } catch (error) {
        console.error("Error fetching pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      const matchesSearch = 
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(pokemon.id).includes(searchQuery);

      const matchesType = 
        selectedTypes.length === 0 || 
        pokemon.types.some(t => selectedTypes.includes(t.type.name));

      return matchesSearch && matchesType;
    });
  }, [allPokemon, searchQuery, selectedTypes]);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const totalPages = Math.ceil(totalPokemon / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <Loading text={`Pika pika~`} />;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto pb-10">
        
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Pokedex
        </h1>

        <PokedexFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTypes={selectedTypes}
          toggleType={toggleType}
        />

        <div className="flex justify-center items-center gap-6 my-6">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-lg font-semibold text-slate-300">
            Page <span className="text-white">{currentPage}</span> of {totalPages}
          </span>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {filteredPokemon.length === 0 ? (
           <div className="text-center text-gray-500 mt-20 text-xl">
             No Pokemon found on this page.
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemon.map((pokemon) => (
              <PokedexCard 
                key={pokemon.id} 
                pokemon={pokemon} 
                onClick={() => {navigate(`/pokedex/detail?id=${pokemon.id}`);}}
              />
            ))}
          </div>
        )}

        {filteredPokemon.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-slate-400">
                Page {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none z-0"></div>
    </div>
  );
}