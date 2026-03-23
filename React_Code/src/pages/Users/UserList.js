import React, { useState, useEffect , useRef, useCallback} from "react";

import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'tabulator-tables/dist/css/tabulator.min.css'; 
Tabulator.registerModule([]);

import { CButton,  CRow,  CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle
 } from '@coreui/react';


 import {GripVertical,X,ListOrdered , LayoutGrid, List, Trash2, Delete, FolderPlus ,
  MessageSquarePlus, Save, Play, Search, Download, Layers, SatelliteDish    } from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import {UserService} from "../../services/apiService";  

import "./Users.css";  

const UserList = ({onDataChange}) => { 
	const tableRef 	= useRef(null);
	const [error, setError] = useState("");  
	const [table, setTable] = useState(null);
	const [editData, setEditData] = useState(); 
	const [showModal, setShowModal] = useState(false);
	const [editingUser, setEditingUser] = useState({}); 
	const [data, setData] = useState([]);   
	const { theme } = useTheme();

	const [name, setName]	 		 = useState("");
	const [email, setEmail] 		 = useState(""); 
	const [role, setRole]	    	 = useState(""); 
	const [password, setPassword]	 = useState("");
	const [cpassword, setCPassword]	= useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [allrole, setAllRole]	    	 = useState([]);

	const handleError = async (error) =>{
		if (error.response) { 
			setError(error.response.data.message); 
		} else if (error.request) { 
			setError('Network Error:', error.request);
		} else { 
			setError('Unknown Error:', error.message);
		}
	} 

	const userList = useCallback(async () => {
		setError(null); 
		try {
			const response = await UserService.getAllUsers();  
			const response2= await UserService.getAllRoles(); 
			setData(response.data);
			setAllRole(response2.data);
            onDataChange(response.data); 
			console.log('User list request completed');   
		} catch (error) { 
			handleError(error);
		} 
	}, []);
	
	useEffect( () => {  
		userList();
	},[userList]); 

	
	const updateStatus = async (rowData)=>{ 
		if (rowData.id) { 
			try{  
				await UserService.updateUserStatus(rowData);
				setEditingUser({});
			}catch(error){		 
				handleError(error);			 
			} 
		}  
	}
	  
  	const handleSave = async (e) => {  
		e.preventDefault();

		try{  
			
			if(!email && !name && !role){
				setError("Required all fields !");
				return ;
			}


			let usrdata = {
				id:editingUser.id??"",
				name: name,
				email: email,
				role:role
			}
			
			if(!editingUser.id) { 
				if(password!==cpassword){
					setError("Password & confirm password are not same !");
					return ;
				}else if(password.length<5){
					setError("Password should be of minimum 6 characters long !");
					return ;
				}  

				usrdata.password = password;
			}

			
 
			let inserted = "";
			if(usrdata.id){
				inserted = await UserService.updateUser(usrdata); 
			}else{
				inserted = await UserService.addUser(usrdata);
			}
				
			if(inserted.data[0]>0){
				const response = await UserService.getAllUsers();  
				setData(response.data); 
				onDataChange(response.data); 
				setShowModal(false); 
				setEditingUser({});
			}
		}catch(error){		 
			handleError(error);			 
		} 
   	};
 
  	////////Table List /////////

 	// Initialize Tabulator
	useEffect(() => {
		if (!tableRef.current || data.length === 0) return;
		const timeout = setTimeout(() => {
			const table = new Tabulator(tableRef.current, {
			data,
			layout: 'fitColumns',
			reactiveData: true,
			height: 'auto',
			pagination:true,  
			paginationSize:5,
			resizableColumnFit:true, 
			layout: "fitColumns",
			responsiveLayout: true,
			autoResize:false, 
			selectableRows:true, 
			//paginationCounter:"rows",
			//paginationSizeSelector:[10, 25, 50, 100, true],
	
			columns: [
				{ title: 'S.No.', formatter: "rownum",  width: 70, hozAlign: 'center' }, 
				{ title: 'Name', field: 'name'},
				{ title: 'Email', field: 'email', headerHozAlign: 'center',  hozAlign: 'center'}, 
				{ title: 'Added On', field: 'created_at', headerHozAlign: 'center',  hozAlign: 'center',
					formatter: (cell) => {
						return cell.getValue().replace("T", " ").split(".")[0]; 
					}
				}, 
				{title: 'Role', field: 'rolename', headerHozAlign: 'center',  hozAlign: 'center', width:'20%'},
				{title: 'Enabled',field: 'status',	headerHozAlign: 'center',width:100, hozAlign: 'center' ,
					formatter: (cell, row) => { 
						const value = cell.getValue();
						var row = cell.getRow();
						var rowData = row.getData();   
						const checked  = value === "A" ? "checked" : "";
						  
						const el = document.createElement("div");
						el.className = "form-check form-switch d-flex justify-content-center";
						el.innerHTML = `
						<input id="engchk-${rowData.id}" class="form-check-input enable-toggle" 
						type="checkbox" ${checked}  
						${rowData.role === '1' ? 'disabled="disabled"' : ''}
						 />
						`; 
						const input = el.querySelector(".enable-toggle");
						input.addEventListener("change", (e) => {
							const newStatus = e.target.checked ? "A" : "D";
							const rowData = cell.getRow().getData(); 
							cell.setValue(newStatus); 
							updateStatus(rowData); 
						}); 
						return el;
					}, 
				},
				{title: 'Actions',	headerHozAlign: 'center',hozAlign: 'center' , width:100,
					formatter: () => `<i class="fa fa-edit txt-${theme.color} edit-btn" 
						style="font-size: 20px;"></i>`,
					cellClick: (e, cell) => {
						const rowData = cell.getRow().getData(); 
						setEditingUser({ ...rowData }); 
						setShowModal(true);
					},
				},
			],
		}); 
		}, 100);
	
		return () => {
				clearTimeout(timeout);
				setTable(table);
				if(table) table.destroy();	    
			}
		
	}, [data]); 
 
	useEffect(() => { 
			if(editingUser.id>0){ 
				setName(editingUser.name); 
				setEmail(editingUser.email);  
				setPassword('');
				setRole(editingUser.role); 
				setCPassword('');
			} 
		},[editingUser]);

 	return (
    <div>
      	<div className="d-flex justify-content-between align-items-center mb-1">
			<h6 className={`txt-${theme.color}`}>Users</h6> 

			<button 
				className={`btn btn-${theme.color} btn-sm`}  
				onClick={() => { 
					setName('');
					setEmail('');
					setRole(''); 
					setPassword('');
					setCPassword('');
					setShowModal(true);
					setEditingUser({});
				}}>
			+ Add User
			</button>   
       	</div>
       
	   <div ref={tableRef}></div>
		 
      		 <CModal
					backdrop="static"
					visible={showModal}
					onClose={() => setShowModal(false)}>
					<CModalHeader className={`btn btn-${theme.color}`} 
						   closeButton={false}
						style={{padding: '5px 10px',  
						borderBottomLeftRadius:'0px',
						borderBottomRightRadius:'0px'}}>  
						<CModalTitle style={{'fontSize': '1rem'}}>
						 {editingUser.id ? "Edit User" : "Add User"}	
						</CModalTitle> 
						<CButton onClick={() => {setShowModal(false);}} 
						style={{padding:'0px', marginLeft:'80%'}}> 
							<X style={{color:'#FFF',}} />
						</CButton>
					</CModalHeader>
					<form className="row g-3" onSubmit={(e)=>handleSave(e)} id="Addform">	 
					<CModalBody>  
					<div style={{paddingTop:'10px'}}> 
					 
						<div className="row mb-3">
							<label className="col-sm-4 col-form-label" htmlFor="role">Role</label>
							<div className="col-sm-8">
							<select
								disabled={editingUser && editingUser.role==="1"}  
								id="role"
								className="form-select"  
								value={editingUser.role??role}
								onChange={(e)=>setRole(e.target.value)}>
								<option value="" key="0">-- Select --</option> 
								{allrole && allrole.map((item)=>
									<option  
									value={item.id} 
									key={item.id}>{item.role}</option> 
								)} 
								</select>
							</div>
						</div>
		 
							<div className="row mb-3">
								<label className="col-sm-4 col-form-label" htmlFor="name">Name</label>
								<div className="col-sm-8">
								<input
									required
									id="name"  
									type="text"
									className="form-control" 
									autoComplete="off"
									value={name}
									onChange={(e)=>setName(e.target.value)}
								/>
								</div>
							</div>
		 
		 
							<div className="row mb-3">
								<label className="col-sm-4 col-form-label" htmlFor="email">Email</label>
								<div className="col-sm-8">
								 <input
										required
										id="email" 
										type="email"
										autoComplete="off"
										className="form-control" 
										value={email}
										onChange={(e)=>setEmail(e.target.value)}
									/>
								</div>
							</div>

							{!editingUser.role &&	
							<>
							<div className="row mb-3">
								<label className="col-sm-4 col-form-label" htmlFor="password">Password</label>
								<div className="col-sm-8">
								 <input   
									required
									type={showPassword ? "text" : "password"}
									className="form-control"
									id="password"
									autoComplete="off"
									placeholder="Password"  
									onChange={(e)=>setPassword(e.target.value)}
									/>
								</div>
							</div> 

							<div className="row mb-3">
							<label className="col-sm-4 col-form-label" htmlFor="cpassword">Confirm Password</label>
							<div className="col-sm-8">	
							<input   
								required
								type={showPassword ? "text" : "password"}
								className="form-control"
								id="cpassword"
								autoComplete="off"
								placeholder="Confirm  Password" 
								onChange={(e)=>setCPassword(e.target.value)}
								/>
									
							</div> 
						</div> 
								</>
						}
					
					</div> 	 
					<div style={{"textAlign":'center', color:'red'}}>
						{error} 
					</div>
					</CModalBody>
					<CModalFooter>
						<CButton color="secondary" onClick={() => setShowModal(false)}>Close</CButton>
						<CButton  
						type="submit" 
						disabled={!role}
						className={`btn btn-${theme.color}`}>Save</CButton>
					</CModalFooter> 
					</form> 
					</CModal> 
				</div> 
         
     
  );
} 

export default UserList;