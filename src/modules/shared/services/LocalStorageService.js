export default {
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
  addToArray(key, item) {
    const existingData = this.getItem(key) || [];
    existingData.push(item);
    this.setItem(key, existingData);
  }
};
