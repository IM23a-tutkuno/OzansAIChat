import {Link} from "react-router-dom";

export default function BaseLayout({children}) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-100 font-sans">
            <div className="bg-gray-900 backdrop-blur-lg p-10 rounded-xl  text-center   w-10/12 h-5/6">
                {children}
            </div>
        </div>

    );
}