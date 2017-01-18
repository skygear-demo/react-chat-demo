import React from 'react';

export default function({
  header,
  onClose,
  children,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}>
      <div>
        <h1 style={{textAlign: 'center'}}>
          {header}
        </h1>
        <a
          style={{
            color: '#777',
            fontSize: '2rem',
            float: 'right',
            margin: '1rem'
          }}
          onClick={onClose}>
          ×
        </a>
        {children}
      </div>
    </div>
  );
}
