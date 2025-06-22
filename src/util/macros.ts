// Conditionally execute a function
export const cf: <T extends unknown[], K extends any>
  (fn: ((...args: T) => K) | undefined, ...params: T) => 
    K | undefined = (fn, ...params) => {
  return (fn??(()=>undefined))(...params);
};

export const alphabeticSort = (a: string, b: string) => {
  if (a < b) return -1;
  if (b < a) return 1
  return 0;
}