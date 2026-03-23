import React, { useState, useEffect } from 'react';

const ProcessingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 3) {
          return '';
        } else {
          return prevDots + '.';
        }
      });
    }, 500); // Update every 500ms

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <span><i className="fa fa-cog rotating-icon"></i></span>;
};

export default ProcessingDots;
