const hasRealtimeValue = (value, rt) => rt !== undefined && rt !== value;

const getRealtimeValue = (value, rt, defaultVal) =>
  hasRealtimeValue(value, rt)
    ? { value: rt, changed: true, original: value }
    : { value: value !== undefined ? value : defaultVal, changed: false };

module.exports = { hasRealtimeValue, getRealtimeValue };
