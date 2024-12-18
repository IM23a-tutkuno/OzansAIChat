'use client'
import React from 'react'
import {useState} from 'react'
import {send_chat} from "@/openAI_api.js";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

type Message = {
    role: 'ai' | 'user'
    content: string
}

export default function DarkThemedChat() {
    const [messages, setMessages] = useState<Message[]>([])

    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handlePrompt = async (e) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {role: 'user', content: prompt}
        ]);
        e.preventDefault();
        const response_ai = await send_chat(prompt);
        console.log(response_ai);
        setMessages((prevMessages) => [
            ...prevMessages,
            {role: 'ai', content: response_ai}
        ]);
    };


    return (
        <Card className="w-full h-[600px] bg-black border border-black">
            <CardHeader>
                <CardTitle className="text-2xl">AI Chat (powered by Claude)</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {messages.map((message, index) => (
                        <div key={index}
                             className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <Avatar className="w-8 h-8 bg-white text-black font-bold">
                                    <AvatarFallback>{message.role === 'ai' ? 'AI' : 'U'}</AvatarFallback>
                                    <AvatarImage src={message.role === 'ai' ? '/anthropic.png' : '/user-avatar.png'}/>
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
                        className="flex-grow mr-2"
                        id="response"
                    />
                    <Button onClick={handlePrompt} className="bg-white text-black">Send</Button>
                </div>
            </CardFooter>
        </Card>
    )
}

