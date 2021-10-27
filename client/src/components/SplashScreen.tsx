import React, { FC, ReactNode, useState } from "react";
import { Animated, StyleSheet, View, useColorScheme } from "react-native";
import * as _SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

import { hexToRgb } from "../utils/utils";
import { DefaultTheme, DarkTheme } from "../constants/Colors";

const splashImage = require("../assets/images/logo.png");
const { backgroundColor: defaultBackgroundColor, resizeMode } = Constants.manifest!.splash!;

const FADE_DURATION = 300;

const darkColor = hexToRgb(defaultBackgroundColor!);
const lightColor = DefaultTheme.colors.card; // Already in RGB format apparently.

const SplashScreen: FC<ISplashScreenProps> = (props) => {
  const { children, loadAsync } = props;
  const mode = useColorScheme();

  const [isAppReady, setAppReady] = useState(false);
  const [isAnimationComplete, setAnimationComplete] = useState(false);

  const [bodyOpacity] = useState(new Animated.Value(1));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [backgroundColor] = useState(new Animated.Value(0));

  const lightTransition = backgroundColor.interpolate({ inputRange: [0, 1], outputRange: [darkColor!, lightColor!] });

  const loadResources = () => {
    loadAsync()
    .catch(console.warn)
    .finally(() => {
      setAppReady(true);
      setTimeout(hideSplashScreen, 100);
    });
  }

  const startSplashScreen = () => {
    _SplashScreen.hideAsync();
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: FADE_DURATION, useNativeDriver: true }),
      Animated.timing(backgroundColor, { toValue: 1, duration: FADE_DURATION, useNativeDriver: false })
    ])
    .start();
  }

  const hideSplashScreen = () => {
    Animated.timing(bodyOpacity, { toValue: 0, duration: FADE_DURATION, useNativeDriver: true })
    .start(() => setAnimationComplete(true));
  }

  const bgColor = mode === "dark" ? darkColor : lightTransition;
  const logoColor = mode === "dark" ? DarkTheme.colors.text : DefaultTheme.colors.text;
  return (
    <View style={{ flex: 1 }} onLayout={startSplashScreen}>
      {isAppReady && children}
      {!isAnimationComplete && (
        <Animated.View style={[StyleSheet.absoluteFill, styles.body, { backgroundColor: bgColor }]}>
          <Animated.Image source={splashImage} onLoadEnd={loadResources} 
            style={[styles.splash, { opacity: logoOpacity, tintColor: logoColor }]} />
        </Animated.View>
      )}
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  body: {
    justifyContent: "center",
    alignItems: "center"
  },
  splash: {
    resizeMode,
    width: "50%"
  }
});

interface ISplashScreenProps {
  children: ReactNode
  loadAsync: () => Promise<void>
}