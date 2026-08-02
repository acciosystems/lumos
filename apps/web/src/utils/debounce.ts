export function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
      timeout = undefined;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
  };

  return debounced;
}
