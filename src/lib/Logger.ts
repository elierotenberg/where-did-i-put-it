export type Logger = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
};

export const createConsoleLogger = (): Logger => ({
  log: (...args: unknown[]) => console.log(new Date().toISOString(), ...args),
  error: (...args: unknown[]) =>
    console.error(new Date().toISOString(), ...args),
});
