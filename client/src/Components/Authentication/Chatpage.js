import { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import chatContext from "../chatContext";

const Chatpage = () => {
  const context=useContext(chatContext)
  const {selectedChatId,setSelectedChatId}=context;
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
    fetchAssignmentGroups();
  }, []);

  const handleDivClick = (id) => {
    // Navigate to another page using history.push()
    
    setSelectedChatId(id)
    navigate(`/groupchats`);
  };

  return (
    <div>
    <div className="container align-items-start">
      {chats.map((c) => {
        return (
          
            <div className='row my-3' key={c._id} onClick={() => handleDivClick(c._id)}>
              {c.groupName}
        
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default Chatpage;

