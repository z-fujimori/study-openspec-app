export function createTaskRecord({ id, title, completed = false, createdAt = new Date().toISOString() }) {
  return {
    id,
    title,
    completed,
    createdAt,
  };
}
