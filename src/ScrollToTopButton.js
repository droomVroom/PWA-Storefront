import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTopButton({darkMode}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', toggle);
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollUp = () => window.scrollTo({top: 0, behavior: 'smooth'});

  return visible ? (
    <div
      title="Scroll to top"
      onClick={scrollUp}
      style={{
        position:"fixed", bottom:110, right:32, zIndex:1100,
        background: darkMode ? "#334155" : "#bae6fd",
        color: darkMode ? "#fbbf24" : "#0ea5e9",
        width:58, height:58, borderRadius:"50%",
        boxShadow:"0 4px 16px #0003", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:30
      }}
    >
      <FaArrowUp />
    </div>
  ) : null;
}
