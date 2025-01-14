import {Button} from "./ui/button"
import { Sparkles, MessageCircle, Zap, Brain } from 'lucide-react'
import {useNavigate} from "react-router-dom";

export default function LandingPage() {
    let navigate = useNavigate()
    return (
        <div
            className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            <header
                className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                <div className="flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-blue-500"/>
                    <span
                        className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">AI Chat</span>
                </div>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <a className="text-sm font-medium hover:text-blue-500 transition-colors" href="#">
                        Home
                    </a>
                    <a className="text-sm font-medium hover:text-blue-500 transition-colors" href="#">
                        About
                    </a>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                    Welcome to Ozan's AI Chat
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    Try out my React and Node.js project and chat with the latest Claude model.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => navigate('/login')}>Get
                                    Started</Button>
                                <Button size="lg" variant="outline"
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50">Learn
                                    More</Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-gray-800">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-4xl">
                            <div
                                className="flex flex-col items-center text-center space-y-2 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                                <MessageCircle className="h-10 w-10 text-blue-500"/>
                                <h3 className="text-xl font-bold">Interactive Chats</h3>
                                <p className="text-gray-500 dark:text-gray-400">Engage in dynamic conversations with our
                                    AI.</p>
                            </div>
                            <div
                                className="flex flex-col items-center text-center space-y-2 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                                <Zap className="h-10 w-10 text-yellow-500"/>
                                <h3 className="text-xl font-bold">Fast Responses</h3>
                                <p className="text-gray-500 dark:text-gray-400">Get quick answers to your questions.</p>
                            </div>
                            <div
                                className="flex flex-col items-center text-center space-y-2 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-700">
                                <Brain className="h-10 w-10 text-purple-500"/>
                                <h3 className="text-xl font-bold">Learning AI</h3>
                                <p className="text-gray-500 dark:text-gray-400">Watch as our AI learns and improves over
                                    time.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-[800px] text-center">
                            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">About
                                Our Project</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                                This AI Chat is an exciting school project designed to explore the frontiers of
                                artificial
                                intelligence in
                                conversation. Our goal is to create an engaging, interactive chatbot that can discuss a
                                wide range of
                                topics.
                                It's not just a project; it's our journey into the fascinating world of natural language

                                ing
                                and AI development.
                                Join us as we push the boundaries of what's possible with AI!
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
                <div className="container px-4 md:px-6">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        © 2024 AI Chat School Project. All rights reserved. Created with passion and curiosity.
                    </p>
                </div>
            </footer>
        </div>
    )
}

