import { AlertCircle, Search } from 'lucide-react';
import CourseCard from './CourseCard';

export default function CourseGrid({ status, error, visibleCourses, onViewDetails, onReset }) {
  if (status === 'loading') {
    return (
      <section className="course-grid" aria-label="Loading courses">
        {Array.from({ length: 6 }).map((_, i) => (
          <article className="course-card skeleton" key={i}>
            <div />
            <div />
            <div />
          </article>
        ))}
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="empty-state error-state" role="alert">
        <AlertCircle size={32} aria-hidden="true" />
        <h2>{error}</h2>
      </section>
    );
  }

  if (visibleCourses.length === 0) {
    return (
      <section className="empty-state">
        <Search size={32} aria-hidden="true" />
        <h2>No courses found</h2>
        <p>Try a different keyword, category, or instructor.</p>
        <button type="button" onClick={onReset}>
          Clear filters
        </button>
      </section>
    );
  }

  return (
    <section className="course-grid" aria-label="Course list">
      {visibleCourses.map((course) => (
        <CourseCard key={course.id} course={course} onViewDetails={onViewDetails} />
      ))}
    </section>
  );
}
