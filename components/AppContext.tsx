"use client";

import React, { PropsWithChildren, useState } from 'react';

export type ThemeType = 'light' | 'dark';

type AppContextProps = {
    theme: ThemeType,
    setTheme: (theme: ThemeType) => void 
};

const defaultContextProps: AppContextProps = {
    theme: 'dark',
    setTheme: (_) => null
}

export const AppContext = React.createContext(defaultContextProps);

export const AppContextProvider = (props: PropsWithChildren) => {
    const [theme, setTheme] = useState<ThemeType>(defaultContextProps.theme);
    
    return (
        <AppContext.Provider
            value={{
                ...defaultContextProps,
                theme,
                setTheme
            }}
        >
            {props.children}
        </AppContext.Provider>
    )
}