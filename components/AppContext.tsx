"use client";

import { useTheme } from 'next-themes';
import React, { PropsWithChildren, useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark';

type AppContextProps = {
};

const defaultContextProps: AppContextProps = {
}

export const AppContext = React.createContext(defaultContextProps);

export const AppContextProvider = (props: PropsWithChildren) => {
    const {setTheme} = useTheme();

    useEffect(() => {
        fetch('/api/theme').then(res => {
            res.json().then(data => {
                setTheme(data.theme);
            });
        });
    }, []);

    return (
        <AppContext.Provider
            value={{
                ...defaultContextProps
            }}
        >
            {props.children}
        </AppContext.Provider>
    )
}