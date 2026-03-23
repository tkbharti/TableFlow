import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { useTheme } from '../../context/ThemeContext';
import {UserService} from "../../services/apiService";

import "./Login.css";   

const LoginPage = () => { 
  const [email, setUsername] 	= useState("admin");
  const [password, setPassword] = useState("admin@123#");
  const [error, setError] 		= useState(""); 
  const navigate = useNavigate();
   const { theme } = useTheme();
	
  	const handleError = async (error) =>{
		if (error.response) { 
			setError(error.response.data.message); 
		} else if (error.request) { 
			setError('Network Error:', error.request);
		} else { 
			setError('Unknown Error:', error.message);
		}
	}

 	const handleSubmit = async (e) => {
		e.preventDefault();
		try{ 
			let response = await UserService.login({email,password});
			if (response.data.length>0) { 
				localStorage.setItem('token', response.data[0].token);
				localStorage.setItem('topnav','singledrag'); 
				navigate('/singledrag'); 
			} 
		} catch (error) {  
			handleError(error);
		}   
  	}; 

  	const checkUser = useCallback(async () => { 
		try {
			const isAuthenticated = localStorage.getItem("token");
			if(isAuthenticated){
            	const response = await UserService.checkToken(); 
				if(response.data.length>0){ 
					navigate('/singledrag'); 
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
		
		<div className={`login-container bg-${theme.color}`}>
		  <div className="login-box">
			<img src="logo.png" alt="logo" /> 
 
			{error && <p className="error">{error}</p>}
			<form onSubmit={handleSubmit}>
			  <div className="input-group"
			  	style={{
					width:'100%', 
				}}
				>
				<label htmlFor="email"
				style={{ 
					display: 'block',
					marginBottom: '6px',
					fontWeight: '500',
					color: '#555', 
				}}
				>Email</label>
				<input
				style={{
					width:'100%',
					padding: '5px',
					border: '1px solid #ccc',
					borderRadius: '6px',
					fontZize: '16px',
					transition: '0.3s',
					borderTopLeftRadius: '6px',
					borderBottomLeftRadius: '6px'
				}}
				  id="email"
				  autoComplete="off"	
				  type="text"
				  className="form-control"
				  placeholder="Enter your email"
				  value={email}
				  onChange={(e) => setUsername(e.target.value)}
				  required
				/>
			  </div>
			  <div className="input-group"
			  	style={{
					width:'100%', 
				}}>
				<label htmlFor="pass"
				style={{ 
					display: 'block',
					marginBottom: '6px',
					fontWeight: '500',
					color: '#555', 
				}}
				>Password</label>
				<input 
				style={{
					width:'100%',
					padding: '5px',
					border: '1px solid #ccc',
					borderRadius: '6px',
					fontZize: '16px',
					transition: '0.3s',
					borderTopLeftRadius: '6px',
					borderBottomLeftRadius: '6px'
				}}
				  className="form-control"
				  id="pass"	
				  autoComplete="off"
				  type="password"
				  placeholder="Enter your password"
				  value={password}
				  onChange={(e) => setPassword(e.target.value)}
				  required
				/>
			  </div>
			  <button type="submit"  style={{"padding": "4px","width":"50%","marginTop":"5%"}} 
			  className={`btn btn-${theme.color}`}>Login</button> 
			</form>
		<div className={`txt-${theme.color}`}>
		  <div style={{padding:'10px'}}>Powered By</div>
		  <div>Tarun Bharti</div>
		</div>				
		  </div>

		  

		</div>
	 );  
};

export default LoginPage;