import Register from './Register.jsx'
import Login from './Login.jsx'
import { Route, Routes} from 'react-router-dom';
import Home from './Home.jsx';
import ChatBox from './ChatBox.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chat/:chatRoomID" element={<ChatBox />} />
    </Routes>
  );
};

export default App
