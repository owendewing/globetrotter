import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

interface reusableButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export default function reusableButton({
  title,
  onPress,
  style,
  textStyle,
  children,
}: reusableButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.authenticationButton, style]}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.authenticationButtonText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  authenticationButton: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    width: 340,
    height: 50,
    borderRadius: 15,
    marginTop: 20,
  },
  authenticationButtonText: {
    fontSize: 15,
    justifyContent: "center",
    textAlign: "center",
  },
});
