import React from 'react';
import { useData } from '../../contexts/DataContext';
import styles from './BlueButton.module.css';
import { useNavigate } from 'react-router-dom';

interface BlueButtonProps {
  buttonText: string;
  buttonStyle?: string;
  redirectPath?: string;
  disabled?: boolean;
  onClickAction?: () => void;  // Prop for custom onClick callback
}

const BlueButton: React.FC<BlueButtonProps> = ({
  buttonText,
  buttonStyle,
  redirectPath = '/klienci',
  disabled = false,
  onClickAction
}) => {
  const { sendDataToServerAddedClient } = useData();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!disabled) {
      if (onClickAction) {
        await onClickAction();  // If onClickAction is provided, execute it
      } else {
        sendDataToServerAddedClient();  // If no onClickAction, perform default behavior
      }
      navigate(redirectPath);
    }
  };

  return (
    <button className={buttonStyle || styles.blueButton} onClick={handleClick} disabled={disabled}>
      {buttonText}
    </button>
  );
};

export default BlueButton;
