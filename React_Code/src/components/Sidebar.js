 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ChevronDown, Settings, Users, Home, FolderCog , LucideMonitorCheck , ArrowRight , ArrowLeft, MonitorPlay, SendToBack, Combine    } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { px } from 'framer-motion';

export default function Sidebar({ collapsed, toggleSidebar, permissions, name }) {
  const [openMenu, setOpenMenu] = useState(null);
  const { theme } = useTheme();
  const toggleSubmenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  
  const styles = {
    dashboardGradient: {
      backgroundImage: `linear-gradient(45deg, black, transparent)`,
        },
      
    noGradient: {}
  } 
  const [bgnav, setBg] = useState(''); 

   const [subnav, setNav] = useState('');  

  const setTop = (nav)=>{
    setBg(nav);
    setNav('');
    localStorage.setItem('topnav',nav); 
    localStorage.removeItem('subnav'); 
  }
  
  const setSub = (nav)=>{ 
      setNav(nav);
      localStorage.setItem('subnav',nav); 
  }
 
  useEffect( () => { 
    setBg(localStorage.getItem('topnav'));
    setNav(localStorage.getItem('subnav'));  
  },[bgnav,subnav]);   
 
  return (
    <aside
      className={`position-fixed bg-${theme.color} text-white`}
      style={{
        backgroundColor:`${theme.color}`,
        top: '40px',
        bottom: 0,
        left: 0,
        width: collapsed ? '60px' : '200px',
        overflowY: 'auto', 
        zIndex: 1000, 
      }}
    >
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-light">
        {!collapsed && <strong style={{marginTop:'5px'}}>{name}</strong>}
        <button className="btn btn-sm" 
        style={{color:"#FFF",'paddingLeft':'14px',border:'0px',}} 
        onClick={toggleSidebar}>
          <Menu size={16} />
        </button>
      </div>

      <nav className="nav flex-column mt-2">

     { permissions && permissions.includes(1) &&   
      <Link to="/singledrag" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('singledrag');}}
         style={
              bgnav === 'singledrag'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <SendToBack  size={24} color={bgnav === 'singledrag'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Single Drag</span>}  
      </Link> 
      }

      { permissions && permissions.includes(1) &&   
      <Link to="/multidrag" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('multidrag');}}
         style={
              bgnav === 'multidrag'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Combine  size={24} color={bgnav === 'multidrag'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Multi Drag</span>}  
      </Link>  
      }  

      <Link to="/settings" className="nav-link text-white d-flex align-items-center" 
        onClick={()=>{setTop('settings');}}
         style={
              bgnav === 'settings'
                ? styles.dashboardGradient
                : styles.noGradient
            }
        >
        <Settings  size={24} color={bgnav === 'settings'?'#15A5FF':'#FFF'} /> {!collapsed && <span className="ms-2">Settings</span>}  
      </Link>  
         
      </nav>
    </aside>
  );
}
