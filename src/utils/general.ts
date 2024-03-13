export function onDev<T>(cb: (...args: any[]) => T) {
  return import.meta.env.DEV ? cb() : null
}

/* eslint-disable no-console */
export const Console = {
  log: (...args: any[]) => onDev(() => console.log(...args)),
  error: (...args: any[]) => onDev(() => console.error(...args)),
  warn: (...args: any[]) => onDev(() => console.warn(...args)),
}
