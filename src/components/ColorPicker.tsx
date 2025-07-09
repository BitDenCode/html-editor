// src/components/ColorPicker.tsx
import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import './ColorPicker.css';

interface Props {
  onColorSelect: (color: string) => void;
  currentColor?: string;
}

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc', '#efefef',
  '#f3f3f3', '#ffffff', '#ff0000', '#ff9900', '#ffff00', '#00ff00',
  '#00ffff', '#0000ff', '#9900ff', '#ff00ff', '#f4cccc', '#fce5cd',
  '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'
];

const ColorPicker: React.FC<Props> = ({ onColorSelect, currentColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="color-picker-container">
      <button 
        className="color-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Text Color"
      >
        <Palette size={18} strokeWidth={2} />
        {currentColor && (
          <span 
            className="color-indicator" 
            style={{ backgroundColor: currentColor }}
          />
        )}
      </button>
      
      {isOpen && (
        <div className="color-picker-dropdown">
          <div className="color-grid">
            {COLORS.map(color => (
              <button
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => {
                  onColorSelect(color);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          <button 
            className="color-reset"
            onClick={() => {
              onColorSelect('');
              setIsOpen(false);
            }}
          >
            Reset Color
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;