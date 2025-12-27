import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import Loading from '@/components/common/ClientLoading.jsx';
import PokemonCard from './PokemonCard.jsx';
import { getAllMapPokemonNames, getPokemonIdByName } from '@/utils/encounterParser.js';
import "animate.css";
export default function PokemonList({ onPokemonClick, selectedPokemon, selectedPokemonIds = [], onTogglePokemon }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch only Pokemon that appear on the map (from encounter data)
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const fetchMapPokemon = async () => {
            try {
                // Get unique Pokemon names from encounter data
                console.log('Loading Pokemon names from encounter data...');
                const pokemonNames = await getAllMapPokemonNames();
                console.log(`Found ${pokemonNames.length} unique Pokemon in encounter data`);

                if (pokemonNames.length === 0) {
                    throw new Error('No Pokemon found in encounter data');
                }

                // Fetch details for each Pokemon in batches
                const batchSize = 20;
                const validPokemon = [];

                for (let i = 0; i < pokemonNames.length; i += batchSize) {
                    const batch = pokemonNames.slice(i, i + batchSize);
                    const batchPromises = batch.map(async (pokemonName) => {
                        try {
                            // Get Pokemon ID first
                            const pokemonId = await getPokemonIdByName(pokemonName);
                            if (!pokemonId) {
                                console.warn(`Could not get ID for ${pokemonName}`);
                                return null;
                            }

                            // Fetch Pokemon details
                            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                            if (!pokemonResponse.ok) {
                                return null;
                            }
                            const pokemonData = await pokemonResponse.json();

                            return {
                                id: pokemonData.id,
                                name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
                                number: `#${String(pokemonData.id).padStart(3, '0')}`,
                                types: pokemonData.types.map(t => t.type.name),
                                image: pokemonData.sprites.front_default || pokemonData.sprites.other?.['official-artwork']?.front_default,
                                sprite: pokemonData.sprites.front_default
                            };
                        } catch (err) {
                            console.error(`Error fetching Pokemon ${pokemonName}:`, err);
                            return null;
                        }
                    });

                    const batchResults = await Promise.all(batchPromises);
                    validPokemon.push(...batchResults.filter(p => p !== null));

                    // Small delay between batches to avoid rate limiting
                    if (i + batchSize < pokemonNames.length) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                // Sort by ID
                validPokemon.sort((a, b) => a.id - b.id);

                console.log(`Loaded ${validPokemon.length} Pokemon from map encounter data`);
                setPokemonList(validPokemon);
            } catch (err) {
                console.error('Error fetching map Pokemon:', err);
                setError(`Failed to load Pokemon data: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMapPokemon();
    }, []);

    // Filter Pokemon based on search query
    const filteredPokemon = useMemo(() => {
        if (!searchQuery.trim()) return pokemonList;

        const query = searchQuery.toLowerCase();
        return pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query) ||
            pokemon.number.toLowerCase().includes(query) ||
            pokemon.types.some(type => type.toLowerCase().includes(query))
        );
    }, [pokemonList, searchQuery]);

    return (
        isLoading ? <Loading></Loading> :
            <div className="h-full flex flex-col bg-gray-900/80 border border-gray-700">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Enter pokemon name or number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white placeholder-gray-400 outline-none flex-1"
                        />
                    </div>
                </div>

                {/* Pokemon List */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {isLoading ? (
                        <div className="text-center text-white py-8">Loading Pokemon...</div>
                    ) : error ? (
                        <div className="text-center text-red-400 py-8">{error}</div>
                    ) : filteredPokemon.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">No Pokemon found</div>
                    ) : (
                        <div className="grid grid-cols-5 gap-3">
                            {filteredPokemon.map((pokemon) => {
                                const isSelected = selectedPokemonIds.includes(pokemon.id);
                                const isCurrentlySelected = selectedPokemon?.id === pokemon.id;

                                return (
                                    <PokemonCard
                                        key={pokemon.id}
                                        pokemon={pokemon}
                                        isSelected={isSelected}
                                        isCurrentlySelected={isCurrentlySelected}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onTogglePokemon) {
                                                onTogglePokemon(pokemon);
                                            } else {
                                                onPokemonClick(pokemon);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
    );
}

