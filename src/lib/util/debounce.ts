
const debounce = (func: (...args: unknown[]) => void, delay = 500) => {
  let timer: NodeJS.Timeout | undefined;

  return (...args: unknown[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default debounce;