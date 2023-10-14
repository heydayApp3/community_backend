import { Button } from '@chakra-ui/button';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
import ChattingPage from './pages/ChattingPage';
import ChatState from './ContextProvider';


function App() {
  return (
    <ChatState>
    <div className="App">
     
      <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route exact path="/chats" element={<Chatpage />} />
      <Route exact path="/groupchats" element={<ChattingPage />}></Route>
      </Routes>
      
      
    </div>
    </ChatState>
  );
}

export default App;
