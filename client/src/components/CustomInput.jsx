import React from 'react';

import styles from '../styles';

const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ label, placeHolder, value, handleValueChange }) => {
  const inputId = `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className="flex flex-col">
      <label htmlFor={inputId} className={styles.label}>{label}</label>
      <input
        id={inputId}
        type="text"
        placeholder={placeHolder}
        value={value}
        onChange={(e) => {
          if (e.target.value === '' || regex.test(e.target.value)) handleValueChange(e.target.value);
        }}
        className={styles.input}
      />
    </div>
  );
};

export default CustomInput;
