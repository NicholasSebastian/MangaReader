import { Theme, DefaultTheme as _DefaultTheme, DarkTheme as _DarkTheme } from '@react-navigation/native';

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    ..._DefaultTheme.colors,
    primary: "#4C8CEE",
    background: "#FFFFFF",
    text: "#181818"
  }
};

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    ..._DarkTheme.colors,
    primary: "#4C8CEE",
    background: "#181818",
    text: "#FFFFFF"
  }
};