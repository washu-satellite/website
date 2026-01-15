
import { StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand/react';
import { subscribeWithSelector } from 'zustand/middleware';

type UserData = {
  email: string,
  username: string,
  avatar: string
}

export type ThemeOption = 'dark' | 'light' | 'system';

// Contains all data for managing Centrifuge socket comms
type UserStore = {
  user: UserData | null;
  theme: ThemeOption;

  setUser: (user: UserData) => void;
  setTheme: (theme: ThemeOption) => void;
}

const createUserStore: StateCreator<UserStore, [], []> = (set) => ({
  user: null,
  theme: 'dark',

  setUser: (user) => set(() => ({ user })),
  setTheme: (theme) => set(() => ({ theme }))
});

// Put all the stores together
export const useBoundedStore = create<UserStore>()(
  // Add subscription middleware
  subscribeWithSelector((...a) => ({
      ...createUserStore(...a)
  }))
);

// Helpful Typescript selectors for Zustand
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
};

export const bStore = createSelectors(useBoundedStore);