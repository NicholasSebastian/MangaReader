import React, { NamedExoticComponent, memo } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from "@react-navigation/native";

const Message: NamedExoticComponent<IMessageProps> = memo((props) => {
  const { colors } = useTheme();
  const { text } = props;
  return (
    <View style={styles.center}>
      <Text style={[styles.text, { color: colors.text }]}>
        {text}
      </Text>
    </View>
  );
});

export const Loading: NamedExoticComponent = memo((props) => {
  const { colors } = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.text} />
    </View>
  );
});

export default Message;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 16,
    fontFamily: "poppins-bold"
  }
});

interface IMessageProps {
  text: string
}
