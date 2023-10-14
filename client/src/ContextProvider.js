import React from "react";
import { useState } from "react";

import chatContext from "./chatContext";

const ChatState=(props)=>{
    const [selectedChat,setSelectedChat]=useState()

   
    return (
        <chatContext.Provider value={{selectedChat,setSelectedChat}}>
        {props.children}
        </chatContext.Provider>
    )
}

export default ChatState;