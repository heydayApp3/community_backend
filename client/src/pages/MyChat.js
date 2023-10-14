
import React, { useState, useEffect, useContext,useRef} from 'react';
import chatContext from '../chatContext';
import io from "socket.io-client"
import ScrollableFeed from 'react-scrollable-feed'

const MyChat = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const context = useContext(chatContext)
    const { selectedChat, setSelectedChat } = context;
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            const config = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            };
            const response = await fetch(`/api/message/${selectedChat._id}`, config);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = async (event) => {
        setMessage("");
        if(message!==""){
        try {
            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    content: message,
                    chatId: selectedChat._id
                }),
            };

            const response = await fetch(`/api/message/`, config);
            const data = await response.json();
            setMessages([...messages, data]);
            const obj = { data: data, selectedChatId: selectedChat._id }
            socket.emit("send_message", obj);
        } catch (error) {
            console.log(error);
        }
    }
    };

    const enterMessage=async (event)=>{
        if (event.key === "Enter"){
            await sendMessage();
        }
    }



    const socketConnection = () => {
        if (socket) {
            socket.emit("leave_room")
        }
        const newSocket = io.connect("http://localhost:5000");
        setSocket(newSocket);

        newSocket.emit("join_room", selectedChat._id);
    };

    useEffect(() => {
        socketConnection();
    }, [selectedChat]);

    useEffect(() => {
        setMessages([]);
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        if (socket) {
            socket.on("receive_message", (messageReceived) => {
                setMessages([...messages, messageReceived]);
            });
        }
    },);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
      }, [messages]);

    const convertTime = (t) => {
        const createdAt = new Date(t);
        return createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div>
            {selectedChat ? <div className='container' >
                <div className='container align-items-start border border-dark rounded '>
                    <h1>{selectedChat.groupName}</h1>
            
                    {messages.map((c) => {
                        return <div class={c.sender.email === user.email ? "d-flex justify-content-end my-3" : "d-flex justify-content-start my-3"} key={c._id}>
                            <div style={{ width: "15rem" }} className=" border border-dark rounded p-3">
                                <span className='d-flex justify-content-start'>{c.sender.name}</span>
                                {`${c.content}`}
                                <div className="d-flex justify-content-end">
                                    <span className='d-flex justify-content-start'>{convertTime(c.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    })}
                    <div ref={messagesEndRef} />
                    <div style={{}} className='position-relative align-items-start'>
                    <div className='row'>
                        <input className='col-11  border border-dark rounded'
                            placeholder="Message..."
                            value={message}
                            onKeyDown={enterMessage}
                            onChange={(event) => {
                                setMessage(event.target.value);
                            }}
                        />
                   
                        <button className="col-1   btn btn-primary"  onClick={sendMessage}>Send</button>
                    
                    </div>
                    
                </div>
                </div>

            </div> : <p>Slect a chat</p>}
            
        </div>
    )
}

export default MyChat
