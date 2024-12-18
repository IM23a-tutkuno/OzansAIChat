import React, {useState} from 'react';
import {Login} from "@/components/login.jsx";
import DarkThemedChat from "@/components/ui/chat_template"

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = (userResult) => {
        if (userResult) {  // Only set the login status to true on success
            setIsLoggedIn(true);
            console.log("Login Successful!");
        } else {
            console.log("Login Failed!");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-gray-100 font-sans">
            <div
                className="bg-gray-900 backdrop-blur-lg p-10 rounded-xl  text-center   w-10/12 h-5/6">
                {isLoggedIn === true ?
                    (
                        <DarkThemedChat></DarkThemedChat>
                    ) : (
                        <Login onLogin={handleLogin}></Login>)}
            </div>
        </div>
    );
}

export default App;
