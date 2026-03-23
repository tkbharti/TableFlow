import React, { useRef, useEffect,useState } from "react";
import { Modal } from "bootstrap";
import { useTheme } from '../../context/ThemeContext';
const InputUserForm = ({ show, onClose, onSave, user, setEdit }) => {
    const modalRef      = useRef(null);
    const modalInstance = useRef(null);
    const { theme }     = useTheme();
    const [name, setName]	 				  = useState("");
    const [email, setEmail] 		    = useState(""); 
    const [role, setRole]	    	    = useState("2"); 
    const [password, setPassword]	  = useState("");
    const [cpassword, setCPassword]	= useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => { 
        
        if (modalRef.current) {
            modalInstance.current = new Modal(modalRef.current, {
                backdrop: "static",
                keyboard: false,
            });
        }
    }, []);

    useEffect(() => {
        const modal = modalInstance.current;
        if (!modal) return;
        if (show) { 
            modal.show();  
             
            setName(user.name); 
            setEmail(user.email); 
            
            setPassword('');
            setCPassword('');
        } else {
            modal.hide(); 
            document.activeElement?.blur();
            setName('');
            setEmail('');
            setRole(''); 
            setPassword('');
            setCPassword('');
        }

         

        // Handle when user closes modal manually
        const handleHidden = (e) => { 
            onClose?.();
        };

        modalRef.current.addEventListener("hidden.bs.modal", handleHidden);

        return () => {
            modalRef.current?.removeEventListener("hidden.bs.modal", handleHidden);
        };
    }, [show, onClose]);    

    const handleChange = (e) => { 
       // const { id, value } = e.target; 
       // setEdit((prev) => ({ ...prev, [id]: value })); 
    };
 

    const handleSave = (e) => {
        e.preventDefault();	  
        user.name= name;
        user.email= email;
        user.password= password;
        onSave();
    }; 

    return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      aria-hidden="true">
       
      <div className="modal-dialog">
        <div className="modal-content">
          <div className={`modal-header btn-${theme.color}`} 
		     style={{padding: '5px 10px',}}>
            <h6 className="modal-title">
              {user.id ? "Edit User" : "Add User"}
            </h6>
             
          </div>

          <form className="row g-3" onSubmit={handleSave} id="Addform">
       
          <div className="modal-body p-4">  

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
 

           {!user.id && 
            <div>

              <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="password">Password</label>
                  <div className="col-sm-8 input-group">
        
                  <input   
                    required
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    autoComplete="off"
                    placeholder="Password"  
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                  <span className="input-group-text">
                    <i className="fa fa-eye" 
                    onClick={() => setShowPassword(!showPassword)}
                    id="togglePassword" style={{"cursor": "pointer"}}></i>
                  </span> 
                    
                  </div>
                  
              </div>

              <div className="row mb-3">
                  <label className="col-sm-4 col-form-label" htmlFor="cpassword">Confirm Password</label>
                  <div className="col-sm-8 input-group">
        
                  <input   
                    required
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="cpassword"
                    autoComplete="off"
                    placeholder="Confirm  Password" 
                    onChange={(e)=>setCPassword(e.target.value)}
                    />
                  <span className="input-group-text">
                    <i className="fa fa-eye" 
                    onClick={() => setShowPassword(!showPassword)}
                    id="togglecPassword" style={{"cursor": "pointer"}}></i>
                  </span> 
                    
                  </div>

                  
              </div>
            </div>
           }
            
          </div>

          <div className="modal-footer" style={{borderTop:'none'}}>
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Close 
            </button>
            <button className={`btn btn-${theme.color}`} type="submit" 
              >  
               {user.id ? "Update" : "Save"} 
            </button>
          </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default InputUserForm;
