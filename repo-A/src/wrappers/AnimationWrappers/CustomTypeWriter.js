import React, { useState, useEffect } from 'react';

const CustomTypewriter = ({content, key}) => {
  const [visibleContent, setVisibleContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleContent(content.slice(0, currentIndex + 1));
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 1); // Adjust typing speed as needed

    return () => clearTimeout(timer);
  }, [content, currentIndex]);

  return (
    <span key={key} dangerouslySetInnerHTML={{ __html: visibleContent }} />
  );
};

export default CustomTypewriter;
