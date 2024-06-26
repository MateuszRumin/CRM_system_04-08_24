import React from 'react';
import { useData } from '../../contexts/DataContext';
import styles from './BlueButton.module.css';
import { useNavigate } from 'react-router-dom'; 

interface BlueButtonProps {
  buttonText: string;
  buttonStyle?: string; 
  redirectPath?: string; 
}

const BlueButton: React.FC<BlueButtonProps> = ({ buttonText, buttonStyle, redirectPath = '/klienci' }) => {
  const { sendDataToServer } = useData();
  const navigate = useNavigate(); // Użyj hooka useNavigate do nawigacji

  const handleClick = () => {
    sendDataToServer();
    navigate(redirectPath); // Przekierowanie użytkownika do określonej ścieżki za pomocą navigate
  };

  return (
    <button className={buttonStyle || styles.blueButton} onClick={handleClick}>
      {buttonText}
    </button>
  );
};

export default BlueButton;
