import type { RootState } from './store';

// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, ms = 500) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: never, ...args: never[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('store');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export const saveState = async (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('store', serializedState);
  } catch (e) {
    console.log('Something went wrong in saveState: ', e);
  }
}
