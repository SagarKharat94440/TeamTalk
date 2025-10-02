import { useState } from 'react'
import chatIcon from '../assets/ChatIcon.png'
import { toast } from 'react-hot-toast'
import { createroom, joinChatApi } from '../services/RoomService'
import { useNavigate } from 'react-router-dom';
import useChatContext from '../context/ChatContext';  

function JoinCreateChat() {
  const [detail, setDetail] = useState({ name: "", roomId:""});
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDetail({ ...detail, [e.target.name]: e.target.value });
  }

  function validateForm() {
    if (!detail.roomId || !detail.name) {
      toast.error("Please fill all the fields");
      return false;
    }
    return true;
  }

  async function joinOrCreateChat(action) {
    if (!validateForm()) return;

    try {
      if (action === "join") {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined room successfully");
      } else if (action === "create") {
        await createroom(detail);
        toast.success("Room created successfully");
      }

      // common steps after success
      setCurrentUser(detail.name);
      setRoomId(detail.roomId);
      setConnected(true);
      navigate('/chat');

    } catch (error) {
      // handle 400 errors specifically
      if (error.response?.status === 400) {
        toast.error(error.response.data || "Bad Request");
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center border'>
      <div className='p-8 rounded-lg border-gray-300 max-w-md w-full bg-white dark:bg-gray-900 shadow'>
        <div className='flex justify-center mb-6'>
          <img src={chatIcon} alt="Chat Icon" className='w-20 h-20' />
        </div>
        <h1 className='text-3xl font-bold'>Join or Create Chat Room</h1>
        <div className='mt-4'>
          <label className='text-lg font-semibold'>Your Name</label>
          <input
            type="text"
            placeholder="Enter Your name"
            name='name'
            value={detail.name}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-3"
          />
          <label className='text-lg font-semibold mt-4'>Room ID</label>
          <input
            type="text"
            placeholder="Enter Room ID"
            name='roomId'
            value={detail.roomId}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />
        </div>
        <div className='flex justify-center'>
          <button
            onClick={() => joinOrCreateChat("join")}
            className="mt-2 px-6 bg-blue-500 hover:bg-blue-800 text-white py-2 rounded-full"
          >
            Join Room
          </button>
          <button
            onClick={() => joinOrCreateChat("create")}
            className="mt-2 ml-4 px-6 bg-orange-500 hover:bg-orange-800 text-white py-2 rounded-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;
