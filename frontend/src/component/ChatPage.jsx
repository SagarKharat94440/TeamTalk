import { useState, useRef, useEffect } from 'react';
import { MdSend } from 'react-icons/md';
import { timeAgo } from '../config/helper';
import { useNavigate } from 'react-router-dom';
import useChatContext from '../context/ChatContext';
import { baseURL } from '../config/AxiosHelper';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { toast } from 'react-hot-toast';
import { getMessages } from '../services/RoomService';

const ChatPage = () => {
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setCurrentUser,
    setRoomId,
  } = useChatContext();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!connected) {
      navigate('/');
    }
  }, [connected, roomId, currentUser]);

  useEffect(() => {
    let client;
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      client = Stomp.over(sock);
      client.connect({}, () => {
        setStompClient(client);
        toast.success('WebSocket connected');
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }

    return () => {
      if (client) {
        client.disconnect(() => {
          console.log('WebSocket disconnected');
        });
      }
    };
  }, [roomId, connected]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const initialMessages = await getMessages(roomId);
        setMessages(initialMessages);
      } catch (error) {
        console.error('Failed to load messages', error);
      }
    }
    if (connected) {
      loadMessages();
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (stompClient && connected && input.trim() !== '') {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId,
        timeStamp: new Date().getTime(),
      };
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput('');
    }
  };

  const handleLogout = () => {
    if (stompClient) stompClient.disconnect();
    setConnected(false);
    setRoomId('');
    setCurrentUser('');
    navigate('/');
  };

  return (
    <div>
      {/* Header */}
      <header className="fixed w-full dark:bg-gray-900 py-3 shadow flex justify-around items-center dark:border-gray-700">
        <h1 className="text-xl font-bold">Room: <span>{roomId}</span></h1>
        <h1 className="text-xl font-bold">User: <span>{currentUser}</span></h1>
        <button
          onClick={handleLogout}
          className="mt-2 px-6 bg-red-500 hover:bg-red-800 text-white py-2 rounded-full"
        >
          Leave Room
        </button>
      </header>

      {/* Messages */}
      <main
  ref={chatBoxRef}
  className="py-20 w-2/3 mx-auto h-screen overflow-auto dark:bg-slate-600"

>
  {messages.map((message, index) => (
    <div
      key={index}
      className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`my-2 ${message.sender === currentUser ? 'bg-green-800' : 'bg-gray-800'} p-3 rounded-lg max-w-[80%] w-fit break-words whitespace-pre-wrap`}
      >
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-white">{message.sender}</p>
          <p className="text-sm text-white break-words whitespace-pre-wrap">
            {message.content}
          </p>
          <p className="text-xs text-gray-300">{timeAgo(message.timeStamp)}</p>
        </div>
      </div>
    </div>
  ))}
</main>

      {/* Input */}
      <div className="fixed bottom-2 w-full h-16">
        <div className="h-full rounded w-2/3 mx-auto dark:bg-gray-900 flex items-center px-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
                inputRef.current?.blur();
              }
            }}
            type="text"
            placeholder="Type a message..."
            className="flex-1 dark:bg-gray-700 dark:border-gray-700 px-3 py-2 rounded-full h-10 outline-none"
          />
          <button
            onClick={sendMessage}
            className="ml-2 dark:bg-green-600 p-3 rounded-3xl text-white hover:bg-green-700"
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
