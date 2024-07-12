import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './ButtonTopBar.module.css'; // Importowanie stylizacji CSS

interface ButtonTopBarProps {
  src: string;
  alt: string;
  path: string;
}

export const ButtonTopBar: React.FC<ButtonTopBarProps> = ({ src, alt, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <button className={style.buttontopbar} onClick={handleClick}>
      <img src={src} alt={alt} />
    </button>
  );
};
