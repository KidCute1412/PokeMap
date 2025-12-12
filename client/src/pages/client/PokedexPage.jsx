// pages/PokedexPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PokedexCard from '@/components/pokemon/PokedexCard';
import PokedexFilterBar from '@/components/pokemon/PokedexFilterBar';
import Loading from "@/components/common/ClientLoading.jsx";

export default function PokedexPage() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
        const data = await response.json();

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
  }, []);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter((pokemon) => {
      // 1. Lọc theo Search (Tên hoặc ID)
      const matchesSearch = 
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(pokemon.id).includes(searchQuery);

      // 2. Lọc theo Type (Nếu có chọn type thì pokemon phải có type đó)
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

  if (loading) return <Loading text="Fetching Pokedex..." />;

  return (
    <div className="min-h-screen text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Pokedex
        </h1>

        <PokedexFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTypes={selectedTypes}
          toggleType={toggleType}
        />

        {filteredPokemon.length === 0 ? (
           <div className="text-center text-gray-500 mt-20 text-xl">
             No Pokemon found matching your criteria.
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none z-0"></div>
    </div>
  );
}