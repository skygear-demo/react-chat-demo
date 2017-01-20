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
      <div
        style={{
          position: 'relative',
          backgroundColor: '#FFF',
          padding: '1rem',
        }}>
        <header>
          <span
            style={{
              color: '#777',
              fontSize: '2rem',
              cursor: 'pointer',
              position: 'absolute',
              right: '1.2rem',
              top: '1rem',
            }}
            onClick={onClose}>
            ×
          </span>
          <h1 style={{
            textAlign: 'center',
            margin: '0',
          }}>
            {header}
          </h1>
        </header>
        {children}
      </div>
    </div>
  );
}
