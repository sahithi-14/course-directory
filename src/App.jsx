import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDownAZ,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RotateCcw,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import { fetchCourses } from './api/courses';

const PAGE_SIZE = 6;

const sorters = {
  name: (a, b) => a.name.localeCompare(b.name),
  rating: (a, b) => b.rating - a.rating,
  duration: (a, b) => Number.parseInt(a.duration, 10) - Number.parseInt(b.duration, 10),
};

function uniqueOptions(courses, key) {
  return [...new Set(courses.map((course) => course[key]))].sort();
}

function avgRating(courses) {
  if (!courses.length) return '—';
  const avg = courses.reduce((sum, c) => sum + c.rating, 0) / courses.length;
  return avg.toFixed(1);
}

function StarRating({ value }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'full';
    if (i === full && hasHalf) return 'half';
    return 'empty';
  });
  return (
    <span className="star-row" aria-label={`${value} out of 5`}>
      {stars.map((type, i) => (
        <Star
          key={i}
          size={15}
          aria-hidden="true"
          className={`star star-${type}`}
          fill={type === 'full' ? 'currentColor' : type === 'half' ? 'url(#half)' : 'none'}
        />
      ))}
      <span>{value.toFixed(1)}</span>
    </span>
  );
}

function CourseModal({ course, onClose }) {
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
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={course.name}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-topline">
            <span className="category-badge">{course.category}</span>
            <span className={`level-badge level-${course.level.toLowerCase()}`}>{course.level}</span>
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
          <button type="button" className="enroll-button">Enroll now</button>
          <button type="button" className="wishlist-button" onClick={onClose}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [instructor, setInstructor] = useState('All');
  const [level, setLevel] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    let active = true;

    fetchCourses()
      .then((data) => {
        if (!active) return;
        setCourses(data);
        setStatus('success');
      })
      .catch(() => {
        if (!active) return;
        setError('Courses could not be loaded. Please try again.');
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, category, instructor, level, sortBy]);

  const categories = useMemo(() => uniqueOptions(courses, 'category'), [courses]);
  const instructors = useMemo(() => uniqueOptions(courses, 'instructor'), [courses]);
  const levels = useMemo(() => uniqueOptions(courses, 'level'), [courses]);
  const overallAvg = useMemo(() => avgRating(courses), [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courses
      .filter((course) => {
        const matchesText =
          course.name.toLowerCase().includes(normalizedQuery) ||
          course.instructor.toLowerCase().includes(normalizedQuery);
        const matchesCategory = category === 'All' || course.category === category;
        const matchesInstructor = instructor === 'All' || course.instructor === instructor;
        const matchesLevel = level === 'All' || course.level === level;

        return matchesText && matchesCategory && matchesInstructor && matchesLevel;
      })
      .sort(sorters[sortBy]);
  }, [courses, query, category, instructor, level, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const visibleCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setQuery('');
    setCategory('All');
    setInstructor('All');
    setLevel('All');
    setSortBy('rating');
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <div>
          <span className="eyebrow">Edutech catalog</span>
          <h1>Course Directory</h1>
          <p>
            Browse practical programs, compare instructors, and quickly narrow the catalog by
            topic, teacher, or rating.
          </p>
        </div>

        <div className="summary-panel" aria-label="Course summary">
          <div>
            <strong>{courses.length}</strong>
            <span>Courses</span>
          </div>
          <div>
            <strong>{categories.length}</strong>
            <span>Categories</span>
          </div>
          <div>
            <strong>{overallAvg}</strong>
            <span>Avg rating</span>
          </div>
        </div>
      </section>

      <section className="toolbar" aria-label="Course filters">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search courses</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search course or instructor"
          />
        </label>

        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All</option>
            {categories.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Instructor</span>
          <select value={instructor} onChange={(event) => setInstructor(event.target.value)}>
            <option>All</option>
            {instructors.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Level</span>
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option>All</option>
            {levels.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="rating">Highest rating</option>
            <option value="name">Course name</option>
            <option value="duration">Duration</option>
          </select>
        </label>

        <button type="button" className="reset-button" onClick={resetFilters}>
          <RotateCcw size={17} aria-hidden="true" />
          Reset
        </button>
      </section>

      <section className="results-bar" aria-live="polite">
        <div>
          <ArrowDownAZ size={18} aria-hidden="true" />
          <span>
            Showing {visibleCourses.length} of {filteredCourses.length} matching courses
          </span>
        </div>
      </section>

      {status === 'loading' && (
        <section className="course-grid" aria-label="Loading courses">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="course-card skeleton" key={index}>
              <div />
              <div />
              <div />
            </article>
          ))}
        </section>
      )}

      {status === 'error' && (
        <section className="empty-state error-state" role="alert">
          <AlertCircle size={32} aria-hidden="true" />
          <h2>{error}</h2>
        </section>
      )}

      {status === 'success' && visibleCourses.length > 0 && (
        <section className="course-grid" aria-label="Course list">
          {visibleCourses.map((course) => (
            <article className="course-card" key={course.id}>
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
                <button type="button" onClick={() => setSelectedCourse(course)}>View details</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {status === 'success' && visibleCourses.length === 0 && (
        <section className="empty-state">
          <Search size={32} aria-hidden="true" />
          <h2>No courses found</h2>
          <p>Try a different keyword, category, or instructor.</p>
          <button type="button" onClick={resetFilters}>
            Clear filters
          </button>
        </section>
      )}

      {status === 'success' && filteredCourses.length > PAGE_SIZE && (
        <nav className="pagination" aria-label="Course pages">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
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
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>
      )}

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </main>
  );
}

export default App;
