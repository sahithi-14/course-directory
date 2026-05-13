import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <nav className="pagination" aria-label="Course pages">
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default memo(Pagination);
