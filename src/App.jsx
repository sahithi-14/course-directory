import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownAZ } from 'lucide-react';
import { fetchCourses } from './api/courses';
import { avgRating, PAGE_SIZE, sorters, uniqueOptions } from './utils';
import SummaryPanel from './components/SummaryPanel';
import Toolbar from './components/Toolbar';
import CourseGrid from './components/CourseGrid';
import Pagination from './components/Pagination';

// Lazy-loaded: only fetched when a user clicks "View details"
const CourseModal = lazy(() => import('./components/CourseModal'));

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
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => {
        const matchesText =
          c.name.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
        return (
          matchesText &&
          (category === 'All' || c.category === category) &&
          (instructor === 'All' || c.instructor === instructor) &&
          (level === 'All' || c.level === level)
        );
      })
      .sort(sorters[sortBy]);
  }, [courses, query, category, instructor, level, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const visibleCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategory('All');
    setInstructor('All');
    setLevel('All');
    setSortBy('rating');
  }, []);

  const handlePrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNext = useCallback(
    () => setPage((p) => Math.min(totalPages, p + 1)),
    [totalPages],
  );

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
        <SummaryPanel
          courseCount={courses.length}
          categoryCount={categories.length}
          avg={overallAvg}
        />
      </section>

      <Toolbar
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        instructor={instructor}
        setInstructor={setInstructor}
        level={level}
        setLevel={setLevel}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        instructors={instructors}
        levels={levels}
        onReset={resetFilters}
      />

      <section className="results-bar" aria-live="polite">
        <div>
          <ArrowDownAZ size={18} aria-hidden="true" />
          <span>
            Showing {visibleCourses.length} of {filteredCourses.length} matching courses
          </span>
        </div>
      </section>

      <CourseGrid
        status={status}
        error={error}
        visibleCourses={visibleCourses}
        onViewDetails={setSelectedCourse}
        onReset={resetFilters}
      />

      {status === 'success' && filteredCourses.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      {selectedCourse && (
        <Suspense fallback={null}>
          <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
        </Suspense>
      )}
    </main>
  );
}

export default App;
