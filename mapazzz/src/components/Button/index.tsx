import React from "react";
import { View, StyleSheet } from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";
import type { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
};

export function Button({ title, ...rest }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.buttonContainer}>
      <PaperButton
        mode="outlined"
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={[styles.label, { color: theme.colors.primary }]}
        onPress={rest.onPress as () => void}
        theme={{ roundness: 100 }}
      >
        {title}
      </PaperButton>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    // Your container styles
  },
  button: {
    // Your button styles
  },
  buttonContent: {
    // Your button content styles
  },
  label: {
    // Your label styles
  },
});