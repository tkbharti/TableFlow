import React from 'react';
import { useTheme } from '../context/ThemeContext';
export default function Footer() {
   const { theme } = useTheme();
  return (
    <footer
      className={`d-flex justify-content-center align-items-center text-black txt-${theme.color}`}
      style={{
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #c3bfbfff',
        height: '50px',
        fontWeight:"bold"
      }}
    >
      Powered By : Tarun Bharti
    </footer>
  );
}
