import React from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";

interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  textHeader: string;
  secureTextEntry?: boolean;
  style?: object;
}

export default function Input({
  placeholder,
  onChangeText,
  value,
  textHeader,
  secureTextEntry,
  style,
}: InputProps) {
  return (
    <View style={styles.container}>
      {textHeader ? <Text style={styles.textHeader}>{textHeader}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor="#888"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  textHeader: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 15,
    marginTop: 20,
  },
  input: {
    height: 45,
    marginLeft: 12,
    marginRight: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#fff",
    borderRadius: 10,
    backgroundColor: "white",
  },
});
