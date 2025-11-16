import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/UserProfilePage";
import SinglePostPage from "./pages/SinglePostPage";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        
      </div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile/:id?" element={<ProfilePage />} />
        <Route path="/post/:id" element={<SinglePostPage />} />
      </Routes>
    </div>
  );
}

export default App;
