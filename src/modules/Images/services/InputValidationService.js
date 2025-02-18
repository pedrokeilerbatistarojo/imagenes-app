export default {
  isEmptyOrWhitespace(str) {
    if (typeof str === 'string') {
      return str.trim() === '';
    }
    return str == null;
  },
};
