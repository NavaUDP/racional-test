import React from 'react';

export const ErrorMessage = ({ message }) => {
  const style = {
    padding: '15px',
    backgroundColor: '#ffefef',
    color: '#d90000',
    border: '1px solid #d90000',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '20px'
  };
  return <div style={style}><strong>Error:</strong> {message}</div>;
};