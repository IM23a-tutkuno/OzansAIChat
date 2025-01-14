import React, {useState} from 'react';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import axios from 'axios';
import {useNavigate} from "react-router-dom";



export const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate()



    const handleSubmit = (e) => {
        e.preventDefault();


        const loginData = {username, password};

        axios.post('http://localhost:5000/api/login', loginData)
            .then(response => {
                let msg = document.getElementById('login_msg')
                if (response.data.result === true) {
                    msg.textContent = response.data.message
                    localStorage.setItem('token', response.data.token)
                    localStorage.setItem('api-key', response.data.apiKey)
                    console.log(response.data.result)
                    localStorage.setItem('username', username)
                    localStorage.setItem('loggedIn', '1')
                    navigate('/chat')

                } else if (response.data.result === false) {
                    onLogin(0)
                }
                console.log(response)
            })
            .catch(error => {
                setError('Invalid credentials'); // Handle error
                console.error('Login error:', error);
            });
    };

    return (
        <Card className="mx-auto max-w-sm bg-black border border-black">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
                <CardDescription>Enter your Username and password to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2 text-left">
                        <Label htmlFor="user" id="username">Username</Label>
                        <Input id="user" type="email" placeholder="username"
                               onChange={(e) => setUsername(e.target.value)} required/>
                    </div>
                    <div className="space-y-2 text-left">
                        <Label htmlFor="password" id="password">Password</Label>
                        <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)}
                               required/>
                    </div>
                    <div id="login_msg"></div>
                    <Button type="submit" className="w-full  bg-white text-black hover:bg-gray-300"
                            onClick={handleSubmit}>
                        Login
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default Login
