export default class EventEmitter {
  constructor() {
    this.events = {};
    this.listeners = new Set();
  }

  subscribe(event, key, listener) {
    if (!this.events[event]) this.events[event] = [];

    const id = event + "-" + key;
    if (!this.listeners.has(id)) {
      this.listeners.add(event + "-" + key);
      this.events[event].push({ key, listener });
    }
  }

  unsubscribe(event, key) {
    const id = event + "-" + key;
    if (this.events[event] && this.listeners.has(id)) {
      this.listeners.delete(id);
      this.events[event] = this.events[event].filter((e) => e.key !== key);
    }
  }

  emit(event, payload) {
    if (this.events[event])
      this.events[event].forEach(({ listener }) => listener(payload));
  }
}
