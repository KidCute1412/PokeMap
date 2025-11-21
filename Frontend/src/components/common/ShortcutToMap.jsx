import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import PokemapIcon from "../../assets/icons/pokemap_icon.png";
import PokedexIcon from "../../assets/icons/pokedex_icon.png";
import {cn} from "../../lib/utils.jsx";
export default function ShortcutToMap({className}){

    return(
        <div className= {cn("bg-gray-800 rounded-2xl p-3 h-fit fixed w-[25%] right-[50px] top-32 pb-6", className)}>
            <h2 className="text-white text-xl font-bold mb-6">Tiện ích</h2>
            <div className="grid grid-cols-2 gap-6">
                <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform
                    duration-300 cursor-pointer`}>
                    <img src = {PokedexIcon}></img>
                </div>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl hover:scale-110 transition-transform
                    duration-300 cursor-pointer`}>
                    <img src = {PokemapIcon}></img>
                </div>
            </div>
        </div>
    );
}