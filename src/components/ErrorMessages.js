import React from 'react';

const ErrorMessages = ({ errors }) => {
	const errorStyle = { color: 'red' };
  return (
<div>
  <ul style={{ padding: '0' }}>
    {typeof errors === 'string' ? (
      <li style={errorStyle}>{errors}</li>
    ) : Array.isArray(errors) ? (
      // Si errors es un array
      errors.map((error, index) => (
        <li key={index} style={errorStyle}>
          {error}
        </li>
      ))
    ) : (
      // Si errors es un objeto
      Object.keys(errors).map((key) => (
        <li key={key} style={errorStyle}>
          {errors[key][0]}
        </li>
      ))
    )}
  </ul>
</div>
  );
};

export default ErrorMessages;