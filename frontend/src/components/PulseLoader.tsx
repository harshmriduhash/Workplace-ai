import React from 'react';

export const PulseLoader = ({ size = '12px', color = 'var(--accent)' }) => {
    return (
        <div className="pulse-container">
            <div className="pulse-dot" style={{ width: size, height: size, background: color }}></div>
            <div className="pulse-ring" style={{ width: `calc(${size} * 2.5)`, height: `calc(${size} * 2.5)`, borderColor: color }}></div>
            <style>{`
        .pulse-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-dot {
          border-radius: 50%;
          z-index: 2;
        }
        .pulse-ring {
          position: absolute;
          border: 2px solid;
          border-radius: 50%;
          animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
          opacity: 0;
        }
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
        </div>
    );
};
