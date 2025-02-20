export default {
  getTotalScores(items) {
    let result = 0;
    if(items.length > 0){
      result = items.reduce((total, item) => total + (item.score || 0), 0);
    }
    return result;
  },
  getTotalScoreByInvoice(items) {
    let result = 0;
    if(items.length > 0){
      result = items.reduce((total, item) => total + (item.quantity || 0), 0);
    }
    return result;
  }
};
