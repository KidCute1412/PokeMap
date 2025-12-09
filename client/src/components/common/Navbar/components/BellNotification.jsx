import React, {useState} from "react";
import notificationIcon from "@/assets/icons/bell.png"

export default function BellNotification({children}){
    
    const [open, setOpen] = useState(false);
    return(
        <>
            <div className = {`relative  w-fit p-2 hover:cursor-pointer hover:bg-gray-700 rounded-3xl 
                transition-all duration-300 ${open ? "bg-gray-700" : ""}`}  onClick = {() => setOpen (o => !o)}>
                <img src = {notificationIcon} className = "w-[30px]"></img>
                <div className = "absolute top-0 right-0 bg-red-400 w-5 h-5 rounded-full flex justify-center items-center \
                    text-white font-bold text-sm border-2 border-white">
                    3   
                </div>
                <div className = {`absolute top-full mt-2 right-0 w-[300px] h-fit max-h-[300px] bg-sky-950 border-2 border-blue-500 shadow-lg rounded-lg p-4 \
                    hover:visible hover:opacity-100 transition-all duration-300 overflow-y-auto scrollbar-hide text-white
                    ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
                    {children}

                </div>
                
            </div>
        </>
    );
}

export function MenuInsideBell(){
    const notifications = [
        {
            id: 1,
            image: "https://i.pinimg.com/736x/e1/1d/96/e11d969662134a1cf1550a6a64401b0a.jpg", // Placeholder image
            description: "John Doe liked your post about Pikachu."
        },
        {
            id: 2,
            image: "https://i.pinimg.com/736x/48/47/5d/48475d0b40a4b80c5bcb9a0061e83e5e.jpg",
            description: "Jane Smith commented on your Charizard sighting."
        },
        {
            id: 3,
            image: "https://i.pinimg.com/736x/b1/8c/a6/b18ca68d356b63a5ccbc9f68c4be9525.jpg",
            description: "Mike Johnson shared your Eevee photo."
        }
    ];

    return (
        <div className="space-y-2">
            {notifications.map(notification => (
                <div key={notification.id} className="flex items-center space-x-3 p-2 bg-sky-800/70 rounded-lg hover:bg-sky-600 transition-colors">
                    <img src={notification.image} alt="Account" className="w-10 h-10 rounded-full" />
                    <p className="text-sm text-white">{notification.description}</p>
                </div>
            ))}
        </div>
    );
}
