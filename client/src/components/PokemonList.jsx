import { useState, useEffect, useMemo } from 'react';
import { Search, Check } from 'lucide-react';

export default function PokemonList({ onPokemonClick, selectedPokemon, selectedPokemonIds = [], onTogglePokemon }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Pokemon list from PokeAPI - Alola region
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        // Fetch Pokemon from Alola region Pokedex
        const fetchPokemon = async () => {
            try {
                // Try multiple endpoints for Alola Pokedex
                const pokedexEndpoints = [
                    'https://pokeapi.co/api/v2/pokedex/alola/',
                    'https://pokeapi.co/api/v2/pokedex/2/', // Alola Pokedex by ID
                    'https://pokeapi.co/api/v2/pokedex/21/' // Ultra Sun/Ultra Moon Pokedex
                ];

                let pokedexData = null;
                let pokedexResponse = null;

                // Try each endpoint until one works
                for (const endpoint of pokedexEndpoints) {
                    try {
                        console.log(`Trying pokedex endpoint: ${endpoint}`);
                        pokedexResponse = await fetch(endpoint);
                        if (pokedexResponse.ok) {
                            pokedexData = await pokedexResponse.json();
                            console.log(`Successfully loaded pokedex from ${endpoint}`);
                            break;
                        }
                    } catch (err) {
                        console.log(`Failed to load from ${endpoint}:`, err);
                        continue;
                    }
                }

                if (!pokedexData || !pokedexData.pokemon_entries) {
                    throw new Error('Could not load Alola Pokedex from any endpoint');
                }

                console.log('Alola Pokedex loaded:', pokedexData.pokemon_entries.length, 'Pokemon');

                // Extract Pokemon entries from the Pokedex
                const pokemonEntries = pokedexData.pokemon_entries || [];

                // Fetch details for each Pokemon (limit to first 200 for performance)
                // Process in batches to avoid overwhelming the API
                const batchSize = 20;
                const validPokemon = [];

                for (let i = 0; i < Math.min(pokemonEntries.length, 200); i += batchSize) {
                    const batch = pokemonEntries.slice(i, i + batchSize);
                    const batchPromises = batch.map(async (entry) => {
                        try {
                            // Get Pokemon species name
                            const speciesName = entry.pokemon_species.name;
                            // Fetch Pokemon details
                            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
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
                            console.error(`Error fetching Pokemon ${entry.pokemon_species?.name}:`, err);
                            return null;
                        }
                    });

                    const batchResults = await Promise.all(batchPromises);
                    validPokemon.push(...batchResults.filter(p => p !== null));

                    // Small delay between batches to avoid rate limiting
                    if (i + batchSize < Math.min(pokemonEntries.length, 200)) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                // Sort by ID
                validPokemon.sort((a, b) => a.id - b.id);

                console.log(`Loaded ${validPokemon.length} Alola region Pokemon`);
                setPokemonList(validPokemon);
            } catch (err) {
                console.error('Error fetching Pokemon:', err);
                setError(`Failed to load Pokemon data: ${err.message}`);

                // Fallback: Load Gen 7 Pokemon (722-809) if Pokedex fails
                console.log('Attempting fallback: Loading Gen 7 Pokemon...');
                try {
                    const fallbackPromises = [];
                    for (let i = 722; i <= 809; i++) {
                        fallbackPromises.push(
                            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                                .then(res => res.ok ? res.json() : null)
                                .catch(() => null)
                        );
                    }

                    const fallbackResults = await Promise.all(fallbackPromises);
                    const fallbackPokemon = fallbackResults
                        .filter(p => p !== null)
                        .map(p => ({
                            id: p.id,
                            name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
                            number: `#${String(p.id).padStart(3, '0')}`,
                            types: p.types.map(t => t.type.name),
                            image: p.sprites.front_default || p.sprites.other?.['official-artwork']?.front_default,
                            sprite: p.sprites.front_default
                        }));

                    console.log(`Fallback loaded ${fallbackPokemon.length} Gen 7 Pokemon`);
                    setPokemonList(fallbackPokemon);
                    setError(null);
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPokemon();
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

    const getTypeColor = (type) => {
        const colors = {
            normal: 'bg-gray-500',
            fire: 'bg-red-500',
            water: 'bg-blue-500',
            electric: 'bg-yellow-500',
            grass: 'bg-green-500',
            ice: 'bg-cyan-500',
            fighting: 'bg-orange-500',
            poison: 'bg-purple-500',
            ground: 'bg-amber-600',
            flying: 'bg-indigo-400',
            psychic: 'bg-pink-500',
            bug: 'bg-lime-500',
            rock: 'bg-stone-600',
            ghost: 'bg-indigo-700',
            dragon: 'bg-violet-600',
            dark: 'bg-gray-800',
            steel: 'bg-gray-400',
            fairy: 'bg-pink-300'
        };
        return colors[type] || 'bg-gray-500';
    };

    return (
        <div className="h-full flex flex-col bg-gray-900/80 rounded-lg border border-gray-700">
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
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="text-center text-white py-8">Loading Pokemon...</div>
                ) : error ? (
                    <div className="text-center text-red-400 py-8">{error}</div>
                ) : filteredPokemon.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">No Pokemon found</div>
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        {filteredPokemon.map((pokemon) => {
                            const isSelected = selectedPokemonIds.includes(pokemon.id);
                            const isCurrentlySelected = selectedPokemon?.id === pokemon.id;

                            return (
                                <div
                                    key={pokemon.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onTogglePokemon) {
                                            onTogglePokemon(pokemon);
                                        } else {
                                            onPokemonClick(pokemon);
                                        }
                                    }}
                                    className={`relative bg-gray-800/70 rounded-lg p-2 cursor-pointer hover:bg-gray-700 transition-colors border ${isSelected || isCurrentlySelected
                                        ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-900/30'
                                        : 'border-gray-700'
                                        }`}
                                >
                                    {/* Check icon overlay */}
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1 z-10">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-400 mb-1">{pokemon.number}</div>
                                    <div className="text-xs font-semibold text-white mb-2 truncate">
                                        {pokemon.name}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {pokemon.types.map((type, idx) => (
                                            <span
                                                key={idx}
                                                className={`text-[10px] px-1.5 py-0.5 rounded ${getTypeColor(type)} text-white`}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </span>
                                        ))}
                                    </div>
                                    {pokemon.sprite && (
                                        <img
                                            src={pokemon.sprite}
                                            alt={pokemon.name}
                                            className="w-full h-auto"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

