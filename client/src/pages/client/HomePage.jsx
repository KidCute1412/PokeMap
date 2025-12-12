
import Posts from "@/pages/client/Posts/Posts.jsx";
import ShortCutToMap from "@/components/common/ShortcutToMap.jsx";
import DragonModel from "@/components/3DModel.jsx";






export default function HomePage(){

    return(
        <div className="min-h-screen pt-20 px-4">
            <div className = "w-[60%] ml-[100px] items-start">
                <Posts></Posts>
            </div>
            <DragonModel></DragonModel>
            <ShortCutToMap></ShortCutToMap>
        </div>
    );
}