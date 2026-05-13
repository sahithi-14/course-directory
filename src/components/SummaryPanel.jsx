import { memo } from 'react';

function SummaryPanel({ courseCount, categoryCount, avg }) {
  return (
    <div className="summary-panel" aria-label="Course summary">
      <div>
        <strong>{courseCount}</strong>
        <span>Courses</span>
      </div>
      <div>
        <strong>{categoryCount}</strong>
        <span>Categories</span>
      </div>
      <div>
        <strong>{avg}</strong>
        <span>Avg rating</span>
      </div>
    </div>
  );
}

export default memo(SummaryPanel);
