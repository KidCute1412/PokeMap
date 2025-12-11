// components/PokedexCard.jsx
import React from 'react';
import { TYPE_COLORS } from './constants'; // Import file màu ở trên

const PokedexCard = ({ pokemon, onClick }) => {
  // Format ID: #001
  const formattedId = `#${String(pokemon.id).padStart(3, '0')}`;

  return (
    <div onClick={onClick} className="group relative flex flex-col items-center p-4 rounded-3xl border-2 border-slate-100 bg-slate-800 hover:bg-slate-700 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer">
      {/* Pokemon Image */}
      <div className="relative w-32 h-32 mb-4 transition-transform duration-300 group-hover:scale-110">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-lg"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="w-full text-left pl-2">
        <span className="text-gray-400 text-sm font-bold">{formattedId}</span>
        <h3 className="text-white text-xl font-bold capitalize mb-3">
          {pokemon.name}
        </h3>
        
        {/* Type Badges */}
        <div className="flex gap-2 mt-auto">
          {pokemon.types.map((typeInfo) => {
            const typeName = typeInfo.type.name;
            return (
              <span
                key={typeName}
                className={`${TYPE_COLORS[typeName] || 'bg-gray-500'} 
                  text-white text-xs font-semibold px-3 py-1 rounded-full capitalize shadow-sm`}
              >
                {typeName}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PokedexCard;