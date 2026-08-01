import type { StateCreator, StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

export type ThemeOption = "dark" | "light" | "system";

type UserStore = {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
};

const createUserStore: StateCreator<UserStore, [], []> = (set) => ({
  theme: "dark",
  setTheme: (theme) => set(() => ({ theme })),
});

export const useBoundedStore = create<UserStore>()((...a) => ({
  ...createUserStore(...a),
}));

// Helpful Typescript selectors for Zustand
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as WithSelectors<typeof _store>["use"];
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => unknown>)[k] = () =>
      store((s) => s[k as keyof typeof s]);
  }
  return store;
};

export const bStore = createSelectors(useBoundedStore);
