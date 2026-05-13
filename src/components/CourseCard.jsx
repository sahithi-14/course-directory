import { memo } from 'react';
import { BookOpen, Clock3, Star, Users } from 'lucide-react';

function CourseCard({ course, onViewDetails }) {
  return (
    <article className="course-card">
      <div className="card-topline">
        <span>{course.category}</span>
        <strong>
          <Star size={16} fill="currentColor" aria-hidden="true" />
          {course.rating.toFixed(1)}
        </strong>
      </div>

      <h2>{course.name}</h2>

      <div className="instructor">
        <Users size={18} aria-hidden="true" />
        {course.instructor}
      </div>

      <dl className="course-meta">
        <div>
          <dt>
            <Clock3 size={17} aria-hidden="true" />
            Duration
          </dt>
          <dd>{course.duration}</dd>
        </div>
        <div>
          <dt>
            <BookOpen size={17} aria-hidden="true" />
            Lessons
          </dt>
          <dd>{course.lessons}</dd>
        </div>
      </dl>

      <div className="level-row">
        <span className={`level-badge level-${course.level.toLowerCase()}`}>{course.level}</span>
        <button type="button" onClick={() => onViewDetails(course)}>
          View details
        </button>
      </div>
    </article>
  );
}

export default memo(CourseCard);
