import { View, Text } from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import { Colors } from '@/constants/Colors'

type ThemeContextType = {
    isDark: boolean,
    toggleTheme: () => void,
    colors: any,
}

const ThemeContext = createContext<ThemeContextType | null>(null)

type ThemeProviderProps = {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDark, setIsDark] = useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
    };

    const theme = {
        isDark,
        toggleTheme,
        colors: isDark ? Colors.dark : Colors.light,
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

