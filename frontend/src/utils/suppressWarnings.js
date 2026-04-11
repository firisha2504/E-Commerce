// Suppress React Router future flag warnings in development
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      args[0].includes('React Router Future Flag Warning')
    ) {
      return; // Suppress React Router warnings
    }
    originalWarn.apply(console, args);
  };
}

export {};