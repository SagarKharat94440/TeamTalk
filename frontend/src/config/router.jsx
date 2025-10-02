import React from 'react'
import App from '../App'
import { Route, Router, Routes } from 'react-router'
import ChatPage from '../component/ChatPage'

const AppRouter = () => {
  return (
   
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage/>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  )
}

export default AppRouter