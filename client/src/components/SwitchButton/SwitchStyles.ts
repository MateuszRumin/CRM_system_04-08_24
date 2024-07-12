import styled from 'styled-components';

export const SwitchContainer = styled.div`
  position: relative;
  width: 77px;
  height: 30px;
`;

export const SwitchInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

export const SwitchLabel = styled.label`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
  user-select: none;
`;

export const SwitchTrack = styled.div<{ checked: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ checked }) => (checked ? '#24304F' : '#FBFBFB')}; /* Color change when checked */
  border-radius: 50px;
  border: 1px solid #24304F;
  transition: background-color 0.3s ease;
`;

export const SwitchThumb = styled.div<{ checked: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  background-color: ${({ checked }) => (checked ? '#FBFBFB' : '#24304F')};
  border-radius: 50%;
  transition: transform 0.4s ease, background-color 0.4s ease;
  left: ${({ checked }) => (checked ? 'calc(100% - 27px)' : '2px')};
`;

export const SwitchText = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: ${({ checked }) => (checked ? '#fbfbfb' : '#24304F')};
  transition: opacity 0.4s ease;
  left: ${({ checked }) => (checked ? '10px' : 'calc(100% - 43px)')};
  user-select: none;

  
`;
