import {createContext, useState, useEffect} from 'react'

import axiosInstance from '../api/axios.jsx';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(null);  
    const [token, setToken] = useState(null);

    useEffect(()=>{
        const savedUser = JSON.parse(localStorage.getItem("user"));
        const savedToken = localStorage.getItem("token");
        if(savedToken && savedUser){
            setUser(savedUser);
            setToken(savedToken);
        }

    }, []);


    const loginUser = async (credentials) => {
        try{
            const res = await  axiosInstance.post(`/users/login`,credentials);
            setUser(res.data.user);
            setToken(res.data.token);


            localStorage.setItem("user",JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);  


            return true;

        }
        catch(err){
            console.error(err.response?.data?.message || err.message);
            return false;
        }
    };

    const registerUser = async (credentials) => {
        try{
            const res = await  axiosInstance.post(`/users/register`,credentials);
            setUser(res.data.user);
            setToken(res.data.token);


            localStorage.setItem("user",JSON.stringify(res.data.user));
            localStorage.setItem("token",res.data.token);

   

            return true;

        }
        catch(err){
            console.error(err.response?.data?.message || err.message);
            return false;
        }
    };

    const loginOutUser = () => {
        try{
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");

        }
        catch(err){
            console.error(err.response?.data?.message || err.message);
            return false;
        }
    };

    return(
        <AuthContext.Provider value={{user,token,loginOutUser,loginUser,registerUser}}>
            {children}
        </AuthContext.Provider>
        
    );  

};



