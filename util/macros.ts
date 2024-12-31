// Conditionally execute a function
export const cf: <T extends unknown[], K extends any>
  (fn: ((...args: T) => K) | undefined, ...params: T) => 
    K | undefined = (fn, ...params) => {
  return (fn??(()=>undefined))(...params);
};