import React, { memo, NamedExoticComponent } from "react";
import { StyleSheet, View, Text, Pressable, GestureResponderEvent } from "react-native";
import { useTheme } from "@react-navigation/native";

const Button: NamedExoticComponent<IButtonProps> = memo((props) => {
  const { text, onPress } = props;
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.button, { backgroundColor: colors.primary }]}>
        <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
      </View>
    </Pressable>
  );
});

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15
  },
  text: {
    fontFamily: "poppins-medium"
  }
});

interface IButtonProps {
  text: string
  onPress: ((event: GestureResponderEvent) => void)
}