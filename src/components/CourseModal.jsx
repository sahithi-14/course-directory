import { useEffect, useRef } from 'react';
import { BookOpen, Clock3, Star, Users, X } from 'lucide-react';

export default function CourseModal({ course, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={course.name}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-topline">
            <span className="category-badge">{course.category}</span>
            <span className={`level-badge level-${course.level.toLowerCase()}`}>
              {course.level}
            </span>
          </div>
          <h2 className="modal-title">{course.name}</h2>
          <div className="modal-instructor">
            <Users size={17} aria-hidden="true" />
            {course.instructor}
          </div>
        </div>

        <p className="modal-description">{course.description}</p>

        <div className="modal-stats">
          <div className="modal-stat">
            <Clock3 size={18} aria-hidden="true" />
            <div>
              <strong>{course.duration}</strong>
              <span>Duration</span>
            </div>
          </div>
          <div className="modal-stat">
            <BookOpen size={18} aria-hidden="true" />
            <div>
              <strong>{course.lessons} lessons</strong>
              <span>Content</span>
            </div>
          </div>
          <div className="modal-stat">
            <Star size={18} fill="currentColor" aria-hidden="true" style={{ color: '#b75f09' }} />
            <div>
              <strong>{course.rating.toFixed(1)} / 5.0</strong>
              <span>Rating</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="enroll-button">
            Enroll now
          </button>
          <button type="button" className="wishlist-button" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
