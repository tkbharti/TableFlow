import React,{useState} from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Settings}   from 'lucide-react';
import "../../index.css";  
const SettingsPage = ()=> {
  const { theme, toggleTheme, setColorTheme } = useTheme();
  const themes     = ['default','primary', 'dark', 'secondary','info']; 
  const themesname = ['Theme 1','Theme 2', 'Theme 3', 'Theme 4', 'Theme 5']; 
   
  const [bgColor, setBgColor] = useState("#015a99");
  const [txtColor, setTxtColor] = useState("#FFFFFF");
  const [otherTxtColor, setOtherTxtColor] = useState("#015a99");
  
  const handleBgColorChange = (e) => {
    const selectedColor = e.target.value;
    setBgColor(selectedColor);   
  }

  const handleTxtColorChange = (e) => {
    const selectedColor = e.target.value;
    setTxtColor(selectedColor);  
  }

  const setNormalTxtColor = (e) => {
    const selectedColor = e.target.value;
    setOtherTxtColor(selectedColor);  
  } 

  const applyCustomTheme = ()=>{ 
    
  }
 return (
     
        <div className="p-0">
          <div className="d-flex justify-content-between align-items-center mb-1">
          <h6 className={`txt-${theme.color}`}>Settings</h6>
            
        </div>  
 
        <div className="dashboard-container">  
            <div className="dashboard-main"> 	 
              <div className="dashboard-content">  

                  <div className="card" style={{height:'300px',width:'50%'}}>  

                     <div className={`card-header d-flex justify-content-between align-items-center 
                                        text-white txt-${theme.color}`} style={{padding:'4px',backgroundColor:"#e1e1e1"}}>
                      <h6 className={`txt-${theme.color}`}> <Settings  size={20} /> Select Theme</h6> 
                     </div>
                      
                      <div id="cardsRow" className="row g-3 mb-3"></div> 
                        <div className="row g-3">
                          <div className="col-lg-12">
                              
                              <div className="card-body p-3">
                                <div className="history-table p-2">

                                  {themes.map((color,i) => (
                                    <button 
                                      key={color}
                                      className={`btn btn-${color} me-2 setting-btn`}
                                      onClick={() => setColorTheme(color)}>
                                     
                                    </button>
                                  ))} 
                                  
                                </div>
                              </div> 
                          </div> 
                        </div> 

                                  

                  </div>

                   
                  
              </div>
            </div>
          </div> 

        </div>
    );  
}

export default SettingsPage;