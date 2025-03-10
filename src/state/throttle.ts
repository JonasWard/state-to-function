import { useMethodData } from './method';

export const throttle = <T extends unknown[]>(callback: (...args: T) => void) => {
  return (...args: T) => {
    if (useMethodData.getState().isWaiting) return;
    callback(...args);
    useMethodData.setState({ isWaiting: true });
    setTimeout(() => useMethodData.setState({ isWaiting: false }), 101);
  };
};
