import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
 
import UserList from "./UserList";

const UsersPage = () => {  
	const [sharedData, setSharedData] 	= useState([]);  
	const [error, setError] 				    = useState("");   

  const navigate 	= useNavigate();
	
	const handleError = async (error) =>{
		if (error.response) { 
			setError(error.response.data.message); 
		} else if (error.request) { 
			setError('Network Error:', error.request);
		} else { 
			setError('Unknown Error:', error.message);
		}
	}
 
  
  const handleChildData = async (dataFromChild) => { 
    
  }
  

 	return (
			  
		<div className="p-0"> 
				<UserList   
					onDataChange={handleChildData}   
				/>    
		</div> 
					 
	);  
};

export default UsersPage;