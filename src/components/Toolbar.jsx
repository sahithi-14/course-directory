import { RotateCcw, Search } from 'lucide-react';

export default function Toolbar({
  query,
  setQuery,
  category,
  setCategory,
  instructor,
  setInstructor,
  level,
  setLevel,
  sortBy,
  setSortBy,
  categories,
  instructors,
  levels,
  onReset,
}) {
  return (
    <section className="toolbar" aria-label="Course filters">
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Search courses</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search course or instructor"
        />
      </label>

      <label>
        <span>Category</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {categories.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Instructor</span>
        <select value={instructor} onChange={(e) => setInstructor(e.target.value)}>
          <option>All</option>
          {instructors.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Level</span>
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option>All</option>
          {levels.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Sort by</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="rating">Highest rating</option>
          <option value="name">Course name</option>
          <option value="duration">Duration</option>
        </select>
      </label>

      <button type="button" className="reset-button" onClick={onReset}>
        <RotateCcw size={17} aria-hidden="true" />
        Reset
      </button>
    </section>
  );
}
