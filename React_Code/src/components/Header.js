import React, { useCallback, useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from "react-router-dom";
 
 
import {
  CButton,
  CCloseButton,
  COffcanvas,
  COffcanvasBody,
  COffcanvasHeader,
  COffcanvasTitle,
} from '@coreui/react'

export default function Header({udata, handleLogout}) {
  const { theme } = useTheme();
  const navigate = useNavigate(); 
  const [usrdata, setUdata] = useState("");
  const [visible, setVisible] = useState(false);
  const [passvisible, setPassVisible] = useState(false); 

  useEffect( () => { 
    setUdata(udata);  
  },[udata]); 
  
  return (
    <header
      className="d-flex justify-content-between align-items-center text-black px-1 shadow-sm"
      style={{
        height: '50px',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #dee2e6',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <h5 className={`txt-${theme.color}`}>Drag Drop Feature Between Tables Using SQLite</h5> 
      </div> 

      <div className="d-flex align-items-center gap-3">
         
        <User onClick={() => setVisible(true)} 
        className={`txt-${theme.color}`} style={{"fontSize": "24px", 'cursor':'pointer'}} /> 
        <LogOut className={`txt-${theme.color}`} onClick={handleLogout}  
		       style={{"fontSize": "24px", 'cursor':'pointer'}}> 
        </LogOut>
      </div>

      <COffcanvas backdrop={false} placement="end" visible={visible} 
      onHide={() => {setVisible(false); setPassVisible(false)}}>
        <COffcanvasHeader className={`bg-${theme.color}`} style={{padding:'5px'}} >
          <COffcanvasTitle style={{fontSize:'1rem'}}>Profile</COffcanvasTitle> 
            <CCloseButton  white={visible}
             onClick={() => setVisible(false)} />
        </COffcanvasHeader>
        <COffcanvasBody>
          <div className='card'> 
              <div className='row' style={{padding:'10px', textAlign:'left'}}>
                <div className='col-4'> 
                  <User size={50}  className={`txt-${theme.color}`} 
                  style={{"fontSize": "50px"}} />
                </div>
                <div className='col-8'>
                     <div className='row'>
                        <div className='col-12'>{usrdata.rolename}</div>
                        <div className='col-12'>{usrdata.name}</div>  
                        <div className='col-12'>{usrdata.email}</div>
                     </div>

                </div>
              </div> 
              
          </div> 

           <div style={{marginTop:'20px', textAlign:'center'}}>  
               <button className={`btn bg-${theme.color} btn-sm`} 
               style={{width:'40%'}} onClick={() => {setVisible(false); setPassVisible(false)}}>Close</button> 

                <button className={`btn bg-${theme.color} btn-sm`} 
               style={{width:'40%', marginLeft:'10px'}} onClick={() => setPassVisible(true)}>Change Password</button> 

           </div> 
          {passvisible && 
            <div className='card' style={{marginTop:'20px',padding:'10px'}}>  
              <h6>Update Password</h6>
              <div className='row' style={{padding:'10px', textAlign:'left'}}>
                <div className='col-12'> 
                  Current Password
                </div>
                <div className='col-12'> 
                    <input name="oldpassword" class="form-control"  />
                </div>
              </div>  

              <div className='row' style={{padding:'10px', textAlign:'left'}}>
                <div className='col-12'> 
                  New Password
                </div>
                <div className='col-12'> 
                    <input name="newpassword" class="form-control"  />
                </div>
              </div> 

              <div className='row' style={{padding:'10px', textAlign:'left'}}>
                <div className='col-12'> 
                  Confirm New Password
                </div>
                <div className='col-12'> 
                    <input name="cnfpassword" class="form-control"  />
                </div>
              </div> 

              <div style={{marginTop:'20px', textAlign:'center'}}>  
               <button className={`btn bg-${theme.color} btn-sm`} 
               style={{width:'40%'}} onClick={() => {setPassVisible(false)}}>Cancel</button> 

                <button className={`btn bg-${theme.color} btn-sm`} 
               style={{width:'40%', marginLeft:'10px'}} onClick={() =>alert("in progress")}>Update</button> 

           </div>  

            </div>   
          }
        </COffcanvasBody>
      </COffcanvas>

    </header>
  );
}
