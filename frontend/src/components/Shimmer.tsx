import React from 'react';

export const Shimmer = ({ width = '100%', height = '20px', borderRadius = '4px' }) => {
    return (
        <div className="shimmer-wrapper" style={{ width, height, borderRadius }}>
            <div className="shimmer"></div>
            <style>{`
        .shimmer-wrapper {
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }
        .shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
};

export const ShimmerCard = () => (
    <div className="card" style={{ gap: '15px', display: 'flex', flexDirection: 'column' }}>
        <Shimmer height="150px" borderRadius="12px" />
        <Shimmer width="60%" height="24px" />
        <Shimmer width="90%" height="16px" />
        <Shimmer width="40%" height="16px" />
    </div>
);
