import React, {useState} from 'react';
import {Login} from "@/components/login.jsx";
import DarkThemedChat from "./components/ui/chat_template"

function App() {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white font-sans">
            <div
                className="bg-gray-900 backdrop-blur-lg p-10 rounded-xl  text-center   w-10/12 h-5/6">
                {localStorage.getItem('loggedIn') === true ?
                    (
                        <DarkThemedChat></DarkThemedChat>
                    ) : (
                        <Login></Login>)}
            </div>
        </div>
    );
}

export default App;
