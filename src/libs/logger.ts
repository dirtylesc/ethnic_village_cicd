const isDev = process.env.NODE_ENV === 'development';

type Logger = {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

const logger: Logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) {
      console.info(`INFO: ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`WARN: ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (isDev) {
      console.error(`ERROR: ${message}`, ...args);
    }
  },
};

export default logger;
