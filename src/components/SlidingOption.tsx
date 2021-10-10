import React, { FC, useState } from "react";
import { StyleSheet, View, Text, Pressable, Animated, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@react-navigation/native";
import { width } from "../constants/Dimensions";

const HEIGHT = 5;
const SLIDER_SPEED = 300;

const SlidingOption: FC<IButtonProps> = (props) => {
  const { options, onIndexChange, style } = props;
  const { colors } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatedIndex] = useState(new Animated.Value(0));

  const optionWidth = (width * 0.9) / options.length;

  const moveTo = (index: number) => {
    if (currentIndex !== index) {
      Animated.timing(animatedIndex, {
        toValue: index * optionWidth, duration: SLIDER_SPEED, useNativeDriver: true
      }).start();
      setCurrentIndex(index);
      onIndexChange(index);
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>
      <Animated.View style={[styles.slider, { 
        backgroundColor: colors.primary, width: optionWidth, transform: [{ translateX: animatedIndex }] }]}>
        <Text style={[styles.text, styles.selected, { color: colors.text }]}>
          {options[currentIndex]}
        </Text>
      </Animated.View>
      {options.map((option, index) => (
        <Pressable key={index} onPress={() => moveTo(index)}>
          <Text style={[styles.text, styles.unselected, { width: optionWidth }]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default SlidingOption;

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: "center",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  slider: {
    position: "absolute",
    zIndex: 1,
    borderRadius: 10
  },
  text: {
    fontSize: 13,
    fontFamily: "poppins",
    textAlign: "center",
    paddingVertical: HEIGHT
  },
  unselected: {
    color: "#808080"
  },
  selected: {
    fontFamily: "poppins-medium"
  }
});

interface IButtonProps {
  options: Array<string>
  onIndexChange: (index: number) => void
  style?: StyleProp<ViewStyle>
}