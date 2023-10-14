import { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import chatContext from "../chatContext";

const Chatpage = () => {
  const context=useContext(chatContext)
  const {selectedChat,setSelectedChat}=context;
  const navigate = useNavigate();

  const[chats,setChats]=useState([])

  const fetchClassGroups = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    try {
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          isClassGroup: true,
          isMessagingGroup: true,
        }),
      };

      const response = await fetch("/api/chat/fetchGroups", config);
      const data = await response.json();
      setChats(data);
      await fetchAssignmentGroups();
    } catch (error) {
      console.log(error);
    }
 };

 const fetchAssignmentGroups = async () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  try {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        isGroupAssignmentGroup:true,
      }),
    };

    const response = await fetch("/api/chat/fetchGroups", config);
    const data = await response.json();
    setChats((prevChats) => [...prevChats, ...data])
    
    
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    fetchClassGroups();
   
  }, []);

  const handleDivClick = (c) => {
    // Navigate to another page using history.push()
    
    setSelectedChat(c)
    navigate(`/groupchats`);
  };

  return (
    <div>
    <div className="container align-items-start">
      {chats.map((c) => {
        return (
          
            <div className='row my-3' key={c._id} onClick={() => handleDivClick(c)}>
              {c.groupName}
        
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default Chatpage;

