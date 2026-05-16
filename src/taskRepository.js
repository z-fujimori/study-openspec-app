export class LocalTaskRepository {
  constructor(storage, storageKey = "taskflow.tasks") {
    this.storage = storage;
    this.storageKey = storageKey;
  }

  list() {
    return this.#read();
  }

  saveAll(tasks) {
    this.storage.setItem(this.storageKey, JSON.stringify(tasks));
    return tasks;
  }

  #read() {
    const raw = this.storage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

export class MemoryStorage {
  constructor(seed = {}) {
    this.values = new Map(Object.entries(seed));
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }
}
