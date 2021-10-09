import React, { FC } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { width } from "../constants/Dimensions";

const Heading: FC<IHeadingProps> = (props) => {
  const { title, description, onMore } = props;
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
        {onMore && (
          <Pressable onPress={onMore}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
            <Text style={styles.description}>
              Show more{"  "}
              <FontAwesome name="chevron-right" size={12} color={colors.text} />
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default Heading;

const styles = StyleSheet.create({
  content: {
    width: width * 0.9,
    alignSelf: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontFamily: "poppins-medium",
    marginBottom: 2
  },
  description: {
    color: "#808080",
    fontSize: 12,
    fontFamily: "poppins"
  }
});

interface IHeadingProps {
  title: string
  description?: string
  onMore?: () => void
}