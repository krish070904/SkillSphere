import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const skillsArray = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const success = await registerUser({
      name,
      email,
      password,
      skills: skillsArray,
    });

    if (success) {
      navigate("/feed"); // 🚀 REDIRECT FIXED
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br/>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br/>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <input
          type="text"
          placeholder="HTML, CSS, JS"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
        <br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
