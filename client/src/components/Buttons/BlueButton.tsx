import React from 'react';
import { useData } from '../../contexts/DataContext';
import styles from './BlueButton.module.css';
import { useNavigate } from 'react-router-dom';

interface BlueButtonProps {
  buttonText: string;
  buttonStyle?: string;
  redirectPath?: string;
  disabled?: boolean;
  onClickAction?: () => void;
}

const BlueButton: React.FC<BlueButtonProps> = ({
  buttonText,
  buttonStyle,
  // redirectPath = '/klienci',
  disabled = false,
  onClickAction
}) => {
  const { sendDataToServerAddedClient } = useData();
  // const navigate = useNavigate();

  const handleClick = async () => {
    if (!disabled) {
      if (onClickAction) {
        await onClickAction();
      } else {
        sendDataToServerAddedClient();
      }
      // navigate(redirectPath);
    }
  };

  return (
    <button className={`${buttonStyle || styles.blueButton} ${disabled ? styles.disabled : ''}`} onClick={handleClick} disabled={disabled}>
      {buttonText}
    </button>
  );
};

export default BlueButton;
