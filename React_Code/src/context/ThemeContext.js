import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({ mode: 'light', color: 'default' });

  useEffect(() => {
    const storedTheme = localStorage.getItem('dashboard-theme');
    if (storedTheme) setTheme(JSON.parse(storedTheme));
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-theme', JSON.stringify(theme));  
  }, [theme]);

  useEffect(() => {
     /*
    let newColor = "#8a0533";
    let newTxtCol = "#ffffff";
    const root = document.documentElement; 
    if(theme.color === "custom"){
      root.style.setProperty("--custom-txt-color", newColor);
      root.style.setProperty("--custom-bg-bgcolor", newColor);
      root.style.setProperty("--custom-bg-txtcolor", newTxtCol);
      root.style.setProperty("--custom-btn-bgcolor", newColor);
      root.style.setProperty("--custom-btn-txtcolor", newTxtCol); 

      //--tabulator-header-bgcolor: #f2f2f2;
      //--tabulator-footer-bgcolor: #f2f2f2;
      //--tabulator-txtcolor:#000;

    }
    */

  },[]);

  const toggleTheme = () =>{ 
     return {
        btnbgColor:"",
        btntxtColor:"",
        otherTxtColor:""
     }
  };

  /*
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark',
    }));
  */

  const setColorTheme = (color) => setTheme(prev => ({ ...prev, color }));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
