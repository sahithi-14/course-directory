export const PAGE_SIZE = 6;

export const sorters = {
  name: (a, b) => a.name.localeCompare(b.name),
  rating: (a, b) => b.rating - a.rating,
  duration: (a, b) => Number.parseInt(a.duration, 10) - Number.parseInt(b.duration, 10),
};

export function uniqueOptions(courses, key) {
  return [...new Set(courses.map((course) => course[key]))].sort();
}

export function avgRating(courses) {
  if (!courses.length) return '—';
  const avg = courses.reduce((sum, c) => sum + c.rating, 0) / courses.length;
  return avg.toFixed(1);
}
