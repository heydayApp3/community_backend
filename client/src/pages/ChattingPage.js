import React, { useState, useEffect, useContext } from 'react';
import chatContext from '../chatContext';
import MyChat from './MyChat';

const ChattingPage = () => {
  const context = useContext(chatContext)
  const { selectedChat, setSelectedChat } = context;
  
  const [electives, setElectives] = useState([selectedChat]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
 

  const fetchElectives = async () => {
    try {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          isElectiveGroup: true,
          isMessagingGroup: true
        }),
      };

      const response = await fetch("/api/chat/fetchGroups", config);
      const data = await response.json();
      setElectives([...electives, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchElectives()
    return ()=>{
      setElectives([])
    }
  }, [])

  const handleDivClick = (c) => {
    // socket.emit("leave_room")
    setSelectedChat(c);
  };
  
  return (
    <>
    
      <div className='container'  style={{overflowY:'scroll',height:"100vh"}}>
        <div className="container align-items-start">
          {electives.map((c) => {
            return (
              <div
                key={c._id}
                onClick={() => handleDivClick(c)}
                className='container align-items-start my-3 p-5 border border-dark rounded '
                style={{ width: "" }}
                >
                {c.groupName}
                <div>{c.latestMessage.sender.name}:{c.latestMessage.content}</div>
              </div>
              
            );
          })}
        </div>
      </div>
       <div className="container" style={{overflowY:'scroll',height:"100vh"}}>
      <MyChat />
      </div>
      
    </>
  );
};

export default ChattingPage;
