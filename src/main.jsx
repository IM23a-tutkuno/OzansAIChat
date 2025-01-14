import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {Route, BrowserRouter, Routes} from 'react-router-dom'
import {Login} from './components/login'
import BaseLayout from './layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedRouteLogin from "@/components/ProtectedRouteLogin.jsx";
import LandingPage from "@/components/LandingPage";
import DarkThemedChat from "@/components/ui/chat_template";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <BaseLayout>
                <Routes>

                    <Route path='/' element={<LandingPage/>}/>
                    <Route path='/login' element={<ProtectedRouteLogin><Login/></ProtectedRouteLogin>}/>
                    <Route
                        path='/chat' element={
                        <ProtectedRoute>
                            <DarkThemedChat></DarkThemedChat>
                        </ProtectedRoute>
                    }
                    />
                </Routes>
            </BaseLayout>
        </BrowserRouter>

    </StrictMode>,
)
