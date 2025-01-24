"use client";

import { AppContext } from "@/components/AppContext";
import { useContext } from "react";

export const darkTheme = {
    fg: "#1C1C1C",
    bg: "#181818",
    footer: "#141414",
    bgHighlight: "#37383b",
    fgHover: "#242424",
    text: "#e3e3e3",
    textHover: "#ffffff",
    textSecondary: "#8C8C8C",
    textAlt: "#303C47",
    textDark: "#B6B6B6",
    accentRed: "#B43D3D",
    accentRedHover: "#9A2727"
};

// TODO: Implement light theme
export const lightTheme = {
    fg: "#f5f5f5",
    bg: "#ffffff",
    footer: "#ffffff",
    bgHighlight: "#cfcfcf",
    fgHover: "#e2e2e2",
    text: "#212121",
    textHover: "#333333",
    textSecondary: "#3b3b3b",
    textAlt: "#475a6b",
    textDark: "#5c5c5c",
    accentRed: "#B43D3D",
    accentRedHover: "#9A2727"
};

export const ThemeColors = {
    dark: darkTheme,
    light: lightTheme
};

export const getTheme = () => {
    const ctx = useContext(AppContext);

    return ctx.theme;
}

export const getColors = () => {
    const theme = getTheme();

    return ThemeColors[theme];
}