import React, { useState,  useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import LoginPage from "../pages/Login/LoginPage";   

import TickerPlay from "../pages/TickerPlay/TickerPlay";  

import TickerPlayMulti from "../pages/TickerPlay/TickerPlayMulti";  


import Settings from "../pages/Settings/SettingsPage";  


import {UserService} from "../services/apiService";

 
import PrivateRoute from "../route/PrivateRoute";
 

export default function AdminLayout({openMenu}) {
  const [collapsed, setCollapsed] = useState(true);
  const { theme } = useTheme();
  const sidebarWidth = collapsed ? 60 : 200;

  const navigate = useNavigate(); 
  
  const [permissions, setPermissions] = useState([]);
  const [name, setName] = useState("");
  const [udata, setUData] = useState({}) ;
  
  const [error, setError] = useState("");
  const handleError = async (error) =>{
    if (error.response) { 
      setError(error.response.data.message); 
    } else if (error.request) { 
      setError('Network Error:', error.request);
    } else { 
      setError('Unknown Error:', error.message);
    }
  }

  const logout = async (e) => { 
		localStorage.removeItem('token'); 
    localStorage.setItem('topnav','dashboard'); 
    localStorage.removeItem('subnav');  
		navigate('/'); 
	}
  
  const checkUser = useCallback(async () => { 
  try {
    const isAuthenticated = localStorage.getItem("token");
    if(isAuthenticated){
        const response = await UserService.checkToken(); 
        
        if(response.data.length>0){  
            if(!response.data[0].name){
              logout();
            }else{
              setName(response.data[0].name);
              let pageaccess = JSON.parse(response.data[0].permissions);
              setPermissions(pageaccess); 
              setUData(response.data[0]);
            } 
        }
    }
          
  } catch (error) {  
    handleError(error);	
  }
    
}, []); 
    
  useEffect( () => { 
    checkUser();   
  },[checkUser]);   


  return (
    <div className={`${theme.mode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Header udata={udata} handleLogout={logout} />
   
      <Sidebar collapsed={collapsed} name={name} permissions={permissions} toggleSidebar={() => setCollapsed(!collapsed)} />

      <div
        className="d-flex flex-column"
        style={{
          marginTop: '50px',
          marginLeft: `${sidebarWidth}px`,
          minHeight: 'calc(100vh - 50px)',
          backgroundColor: '#fff',
          transition: 'margin-left 0.3s ease',
          overflowY: 'auto',
          height: 'calc(100vh - 50px)', 
        }}
      >
        <main className="flex-grow-1 p-3">
          <Routes>
            
            <Route path="/" element={<LoginPage />} />

            <Route path="/singledrag" element=
                  {
                    <PrivateRoute> 
                    { permissions && permissions.includes(1) &&
                      <TickerPlay />
                    }
                    </PrivateRoute>
                  }/> 
               
             <Route path="/multidrag" element=
                  {
                    <PrivateRoute> 
                    { permissions && permissions.includes(1) &&
                      <TickerPlayMulti />
                    }
                    </PrivateRoute>
                 }
                 /> 
                  
             
              <Route path="/settings" element={<Settings />} />    
          </Routes>
        </main>
 
        <Footer/>
      </div>
    </div>
  );
}
