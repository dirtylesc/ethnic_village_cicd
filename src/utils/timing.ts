export function debounce(fn: any, delay = 500) {
  let timerId: any;
  return () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    timerId = setTimeout(() => {
      fn();
    }, delay);
  };
}

export function throttle(fn: any, limit = 1000) {
  let inThrottle: boolean;
  return () => {
    if (!inThrottle) {
      fn();
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
