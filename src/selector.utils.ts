export const getSelectorFrom = (
  value: string | Function,
  storage: { [key: string]: Function }
): any => {
  if (typeof value === 'function') {
    return value;
  }

  return storage[value];
};
