import React from 'react';
import { SwitchContainer, SwitchInput, SwitchLabel, SwitchTrack, SwitchThumb, SwitchText } from './SwitchStyles';

interface OnOffSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const OnOffSwitch: React.FC<OnOffSwitchProps> = ({ checked, onChange }) => {
  const handleChange = () => {
    onChange(!checked);
  };

  return (
    <SwitchContainer>
      <SwitchInput
        type="checkbox"
        name="onoffswitch"
        className="onoffswitch-checkbox"
        checked={checked}
        onChange={handleChange}
      />
      <SwitchLabel htmlFor="onoffswitch" onClick={handleChange}>
        <SwitchTrack checked={checked}>
          <SwitchThumb checked={checked} />
        </SwitchTrack>
        <SwitchText checked={checked}>{checked ? 'ON' : 'OFF'}</SwitchText>
      </SwitchLabel>
    </SwitchContainer>
  );
};

export default OnOffSwitch;
