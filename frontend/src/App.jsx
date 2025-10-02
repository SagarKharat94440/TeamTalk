import { useState } from 'react'
import './App.css'
import JoinCreateChat from './component/JoinCreateChat'
import ChatPage from './component/ChatPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div >
        <JoinCreateChat />
       
    </div>
  )
}

export default App
