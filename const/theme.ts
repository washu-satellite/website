"use client";

import { AppContext } from "@/components/AppContext";
import { useContext } from "react";

export const darkTheme = {
    bg: "#1C1C1C",
    fg: "#181818",
    fgHover: "#242424",
    text: "#FFFFFF",
    textHover: "#E9E9E9",
    textSecondary: "#8C8C8C",
    textAlt: "#303C47",
    textDark: "#B6B6B6",
    accentRed: "#B43D3D",
    accentRedHover: "#9A2727"
};

// TODO: Implement light theme
export const lightTheme = {
    bg: "#1C1C1C",
    fg: "#181818",
    fgHover: "#242424",
    text: "#FFFFFF",
    textHover: "#E9E9E9",
    textSecondary: "#8C8C8C",
    textAlt: "#303C47",
    textDark: "#B6B6B6",
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