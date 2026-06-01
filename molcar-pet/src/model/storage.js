const KEY = 'molcar-pet-save';

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* quota exceeded — silently skip */ }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clear() {
  localStorage.removeItem(KEY);
}
