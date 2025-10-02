import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRouter from './config/router.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
      <ChatProvider>
        <AppRouter />
        <Toaster position='top-center' reverseOrder={false} />
      </ChatProvider>
    </BrowserRouter>
  
)
