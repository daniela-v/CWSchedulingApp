export default {
  datetime: {
    fromUTC(date) {
      if (!date) return date;
      return new Date(date).getTime();
    },
  },
};
