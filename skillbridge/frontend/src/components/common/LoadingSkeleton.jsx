import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="row g-4">
        {items.map((_, i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <div className="sb-card p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="skeleton rounded-circle" style={{ width: '52px', height: '52px' }}></div>
                <div className="flex-grow-1">
                  <div className="skeleton mb-2" style={{ height: '18px', width: '60%' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '40%' }}></div>
                </div>
              </div>
              <div className="skeleton mb-2" style={{ height: '14px', width: '100%' }}></div>
              <div className="skeleton mb-4" style={{ height: '14px', width: '80%' }}></div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '12px' }}></div>
                <div className="skeleton" style={{ height: '36px', width: '100px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-3">
      {items.map((_, i) => (
        <div key={i} className="skeleton mb-3" style={{ height: '48px', width: '100%' }}></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
