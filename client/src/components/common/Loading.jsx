// @ts-expect-error
import milotic from "@/assets/icons/milotic.png";

export default function Loading({ src, size = "w-16 h-16", text = "Loading..." }) {
    if (!src) {
        src = milotic;
    }
    return (
        <div className="fixed inset-0 ml-64 flex items-center justify-center bg-opacity-50 z-50">
            <div className="flex flex-row items-center space-y-4">
                {src && (
                    <><img
                        src={src}
                        alt="Loading"
                        className={`${size} animate-spin rounded-full shadow-[0px_0px_10px] shadow-rose-400`}
                    />
                    <span className={`w-8 h-8 ml-5 border-4 border-rose-300 border-t-gray-500 rounded-full animate-spin`}></span>
                    </>
                    
                )}

                <p className="text-white text-lg">{text}</p>
            </div>
        </div>
    );
}