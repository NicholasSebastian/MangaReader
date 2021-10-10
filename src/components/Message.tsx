import React, { NamedExoticComponent, memo } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from "@react-navigation/native";

const Message: NamedExoticComponent<IMessageProps> = memo(() => {
  const { colors } = useTheme();
  return (
    <View style={styles.offline}>
      <Text style={[styles.offlineText, { color: colors.text }]}>
        {}
      </Text>
    </View>
  );
});

export default Message;

const styles = StyleSheet.create({
  offline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  offlineText: {
    fontSize: 16,
    fontFamily: "poppins-bold"
  }
});

interface IMessageProps {
  text: string
}