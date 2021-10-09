import { Theme, DefaultTheme as _DefaultTheme, DarkTheme as _DarkTheme } from '@react-navigation/native';

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    ..._DefaultTheme.colors,
    primary: "#2f95dc",
    background: "#fff",
    card: "#eee",
    text: "#000"
  }
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    ..._DarkTheme.colors,
    primary: "#2f95dc",
    background: "#17181c",
    card: "#20202a",
    text: "#fff"
  }
};