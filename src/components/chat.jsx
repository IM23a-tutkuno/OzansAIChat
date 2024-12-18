import React, {useState} from 'react';
import {send_chat} from "@/openAI_api.js";
import { Button } from "@/components/ui/button"
import { Textarea } from "./ui/textarea";
import DarkThemedChat from "@/components/ui/chat_template"



const Chat = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handlePrompt = async (e) => {
        let response_field = document.getElementById('response')
        response_field.innerText = ' '
        e.preventDefault();
        const response_ai = await send_chat(prompt);
        console.log(response_ai);
        let response_arr = response_ai.split(" ")
        word_for_word(response_arr)
    };


    function word_for_word(response_arr) {
        let response_component = document.getElementById('response')
        let currentIndex = 0;
        response_arr.forEach((element) => {
            setResponse(response + element)
        })

        function displayWord() {
            if (currentIndex < response_arr.length) {
                response_component.textContent += `${response_arr[currentIndex]} `
                currentIndex++;
                setTimeout(displayWord, 250); // Call again after 500ms
            }
        }

        displayWord()


    }

    return (
        <div>
            <h1 className="text-2xl mb-4">Ozans AI Chat (powered by Claude)</h1>
            <form onSubmit={handlePrompt} className="flex justify-between">
                <Textarea className="text-2xl" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Enter your message...."></Textarea>
                <Button onClick={handlePrompt} className="">Prompt</Button>
            </form>
            <div className="text-xl mt-5" id="response"><br></br> {response}</div>
            <DarkThemedChat></DarkThemedChat>

        </div>
    )


}
export {Chat}