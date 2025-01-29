'use client'
import React from 'react'
import {useState, useEffect} from 'react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Label} from "./label"
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "./dropdown-menu";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "./tooltip"
import {Switch} from "./switch"
import {ChevronDown, Copy, Eye, EyeOff, LogOut, Send, Plus, Loader2} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
import {OpenAI} from "openai";


type Message = {
    role: 'assistant' | 'user',
    content: string,
    ai: string
}

export default function DarkThemedChat() {
    const navigate = useNavigate()

    const [prompt, setPrompt] = useState('');
    const [type, setType] = useState('password')
    const [placeholder_api, setPlaceholder_api] = useState('Show')
    const [tooltip, setTooltip] = useState('Click to copy!')
    const [apiKey, setApiKey] = useState('')
    const [showApiKey, setShowApiKey] = useState(false)
    const [selectedAI, setSelectedAI] = useState('Claude')
    const aiAvatars = {
        'deepseek-r1': './deepseek.png',
        'gpt-4': './gpt3.png',
        'Claude': './anthropic.png',
        // Add more AI models as needed
    };

    const [messages, setMessages] = useState<Message[]>([
        {role: 'assistant', content: `Welcome ${localStorage.getItem('username')}! Ask me anything!`, ai: selectedAI}
    ])

    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [darkMode, setDarkMode] = useState(true)
    useEffect(() => {
        const storedApiKey = localStorage.getItem('api-key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);


    const handlePrompt = async (e) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            {role: 'user', content: prompt, ai: selectedAI}
        ]);

        setPrompt('')


        const newMessage = {role: 'user', content: prompt, ai: selectedAI} as Message;

        const updatedMessages = messages.concat(newMessage);

        const filteredMessages = [...messages, newMessage].map(({ai, ...msg}) => msg);
        console.log("rff")
        console.log(filteredMessages)


        e.preventDefault();
        let local_token = localStorage.getItem('token')
        const token = {'token': local_token, 'messages': filteredMessages, ai: selectedAI}

        if (selectedAI === "deepseek-r1") {
            setMessages(prevMessages => [...prevMessages, {
                role: 'assistant',
                content: "thinking...",
                ai: "deepseek-r1"
            }]);
        }

        await axios.post('http://localhost:5000/api/chat', token).then(
            response => {
                console.log(response)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {role: 'assistant', content: response.data.response, ai: selectedAI},
                ])
            },
        )

    }


    useEffect(() => {
        console.log('Messages updated:', messages);
    }, [messages]);


    const handle_prompt_too = async (e) => {
        e.preventDefault();
        setMessages((prevMessages) => [
            ...prevMessages,
            {role: 'user', content: prompt, ai: selectedAI}
        ]);

        const newMessage = {role: 'user', content: prompt, ai: selectedAI} as Message;

        const updatedMessages = messages.concat(newMessage);
        setPrompt('')
        console.log(`TEST: ${messages}`)

        const message = {'Messages': updatedMessages, 'token': "fAFSKDFKSAFK"}
        console.log(updatedMessages)
        axios.post('http://localhost:5000', message).then(
            response => {
                console.log(messages)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {role: 'assistant', content: response.data.content[0].text, ai: selectedAI},
                ])
            },
        )

    };


    const copyApiKey = () => {
        navigator.clipboard.writeText(apiKey)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const startNewChat = () => {
        setMessages([])
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('api-key')
        localStorage.removeItem('username')
        localStorage.setItem('loggedIn', '0')
        navigate('/login')
    };

    const toggleApiKeyVisibility = () => {
        setShowApiKey(!showApiKey)
    }

    return (
        <div
            className={`flex h-screen bg-gradient-to-br rounded-2xl ${darkMode ? 'from-gray-900 via-purple-950 to-black' : 'from-gray-800 via-gray-700 to-gray-900'} transition-colors duration-300`}>
            {/* Sidebar */}
            <Card
                className={`w-80 ${darkMode ? 'bg-gray-800/30' : 'bg-gray-700/30'} backdrop-blur-md shadow-lg m-4 rounded-xl overflow-hidden border-0`}>
                <CardHeader>
                    <CardTitle
                        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">AI
                        Chat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="ai-model" className="text-sm mb-2 block text-gray-300">AI Model</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" id="ai-model"
                                        className="w-full justify-between bg-gray-700/50 text-gray-300 backdrop-blur-sm border-gray-600">
                                    {selectedAI}
                                    <ChevronDown className="h-4 w-4 opacity-50"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800/90 backdrop-blur-md">
                                <DropdownMenuItem onClick={() => setSelectedAI('Claude')}>
                                    Claude
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSelectedAI('deepseek-r1')}>
                                    deepseek-r1
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <Label htmlFor="api-key" className="text-sm mb-2 block text-gray-300">API Key</Label>
                        <div className="relative">
                            <Input
                                id="api-key"
                                type={showApiKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="pr-10 bg-gray-700/50 text-gray-300 backdrop-blur-sm border-gray-600"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-0 top-0 h-full text-gray-300"
                                onClick={toggleApiKeyVisibility}
                            >
                                {showApiKey ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </Button>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip open={isCopied}>
                            <TooltipTrigger asChild>
                                <Button className="w-full bg-gray-700/50 text-gray-300 backdrop-blur-sm border-gray-600"
                                        onClick={copyApiKey}>
                                    <Copy className="mr-2 h-4 w-4"/> {isCopied ? 'Copied!' : 'Copy API Key'}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>API Key copied to clipboard</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div className="flex items-center space-x-2">
                        <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode}/>
                        <Label htmlFor="dark-mode" className="text-gray-300">Dark Mode</Label>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button variant="outline"
                            className="w-full bg-gray-700/50 text-gray-300 backdrop-blur-sm border-gray-600"
                            onClick={startNewChat}>
                        <Plus className="mr-2 h-4 w-4"/> New Chat
                    </Button>
                    <Button variant="destructive" className="w-full bg-red-500/50 backdrop-blur-sm"
                            onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/> Logout
                    </Button>
                </CardFooter>
            </Card>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col p-4 text-left">
                <Card
                    className={`flex-1 ${darkMode ? 'bg-gray-800/30' : 'bg-gray-700/30'} backdrop-blur-md shadow-lg rounded-xl overflow-hidden border-0`}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-300">Chat with {selectedAI}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-16rem)] pr-4 scroll-area">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{opacity: 0, y: 50}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -50}}
                                        transition={{duration: 0.5}}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                                    >
                                        <div
                                            className={`flex items-start max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback>{message.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
                                                <AvatarImage
                                                    src={
                                                        message.role === 'assistant'
                                                            ? aiAvatars[message.ai] || '/avatars/default-ai.png'  // Use mapped AI image or default
                                                            : '/user.png'
                                                    }
                                                />

                                            </Avatar>
                                            <div className={`mx-2 p-3 rounded-lg ${
                                                message.role === 'assistant'
                                                    ? (darkMode ? 'bg-gray-700/50' : 'bg-gray-600/50')
                                                    : (darkMode ? 'bg-blue-600/50' : 'bg-blue-700/50')
                                            } backdrop-blur-sm`}>
                                                <p className="text-sm text-gray-200">{message.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isLoading && (
                                <div className="flex justify-center items-center h-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-300"/>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <form onSubmit={(e) => {
                        }} className="flex w-full space-x-2">
                            <Input
                                placeholder="Type your message here..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="flex-grow bg-gray-700/50 text-gray-300 backdrop-blur-sm border-gray-600"
                            />
                            <Button type="submit" onClick={handlePrompt} disabled={isLoading}
                                    className="bg-blue-600/50 text-gray-200 backdrop-blur-sm hover:bg-blue-700/50 border-blue-500">
                                <Send className="h-4 w-4 mr-2"/> Send
                            </Button>
                            <Button type="submit" onClick={handle_prompt_too} disabled={isLoading}
                                    className="bg-blue-600/50 text-gray-200 backdrop-blur-sm hover:bg-blue-700/50 border-blue-500 hidden">
                                <Send className="h-4 w-4 mr-2"/> Send to C#
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );

}
