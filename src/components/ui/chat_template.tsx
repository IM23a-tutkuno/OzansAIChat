'use client'
import React from 'react'
import {useState, useEffect} from 'react'
import {send_chat} from "@/openAI_api.js";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import axios from "axios";
import {Tooltip} from "@mui/material"
import {Label} from "@/components/ui/label"
import {response} from "express";

type Message = {
    role: 'ai' | 'user'
    content: string
}

export default function DarkThemedChat({onLogout}) {
    const [messages, setMessages] = useState<Message[]>([
        {role: 'ai', content: `Welcome ${localStorage.getItem('username')}! Ask me anything!`}
    ])

    const [prompt, setPrompt] = useState('');
    const [apiKey, setAPIKey] = useState('')
    const [type, setType] = useState('password')
    const [placeholder_api, setPlaceholder_api] = useState('Show')
    const [tooltip, setTooltip] = useState('Click to copy!')
    useEffect(() => {
        const storedApiKey = localStorage.getItem('api-key');
        if (storedApiKey) {
            setAPIKey(storedApiKey);
        }
    }, []);

    const handlePrompt = async (e) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {role: 'user', content: prompt}
        ]);

        e.preventDefault();
        let local_token = localStorage.getItem('token')
        const token = {'Authorization': local_token, 'prompt': prompt}
        setPrompt('')
        axios.post('https://aibackend-production-f2e2.up.railway.app/api/chat', token).then(
            response => {
                console.log(response)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {role: 'ai', content: response.data.response},
                ])
            },
        )

    }

    function toggle_api_key() {
        if (type == 'password') {
            setType('text')
            setPlaceholder_api('Hide')
        } else if (type == 'text') {
            setType('password')
            setPlaceholder_api('Show')
        }

    }

    function copy_api() {
        setTooltip('Copied!')
        navigator.clipboard.writeText(localStorage.getItem('api-key'))
    }


    return (
        <Card className="w-full h-[600px] bg-black border border-black">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-white">AI Chat (powered by Claude)</CardTitle>
                <div className="flex items-center space-x-2">
                    <Button className="bg-white text-black w-3/6"
                            onClick={toggle_api_key}>{placeholder_api}</Button>
                    <Button className="bg-white text-black w-3/6"
                            onClick={copy_api}>{tooltip}</Button>

                    <div className="relative">
                        <Tooltip title={tooltip}>
                            <Input
                                className="pr-10 bg-neutral-800 text-white border-white w-96
                            "
                                disabled value={apiKey}
                                type={type}

                            />
                        </Tooltip>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full"
                        >
                        </Button>
                    </div>
                    <Button variant="destructive" size="icon" className="bg-red-500 w-3/6" onClick={onLogout}>Logout
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {messages.map((message, index) => (
                        <div key={index}
                             className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div
                                className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="w-8 h-8 bg-white text-black font-bold">
                                    <AvatarFallback>{message.role === 'ai' ? 'AI' : 'U'}</AvatarFallback>
                                    <AvatarImage
                                        src={message.role === 'ai' ? '/anthropic.png' : '/user-avatar.png'}/>
                                </Avatar>
                                <div
                                    className={`mx-2 p-3 rounded-lg ${message.role === 'ai' ? 'bg-secondary bg-neutral-800' : 'bg-primary bg-white text-black'}`}>
                                    <p className={`text-sm ${message.role === 'ai' ? 'text-secondary-foreground' : 'text-primary-foreground'}`}>
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <div className="flex w-full">
                    <Input
                        placeholder="Type your message here..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="flex-grow mr-2 mb-8"
                        id="response"
                    />
                    <Button onClick={handlePrompt} className="bg-white text-black">Send</Button>
                </div>
            </CardFooter>

        </Card>
    )

}

