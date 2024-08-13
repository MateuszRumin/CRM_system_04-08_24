import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './ButtonTopBar.module.css'; // Importowanie stylizacji CSS

interface ButtonTopBarProps {
  src: string;
  alt: string;
  path: string;
  onClick?: () => void; // Dodaj tę linię
}

export const ButtonTopBar: React.FC<ButtonTopBarProps> = ({ src, alt, path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Wywołaj funkcję onClick, jeśli została przekazana
    }
    navigate(path);
  };

  return (
    <button className={style.buttontopbar} onClick={onClick}>
      <img src={src} alt={alt} />
    </button>
  );
};
