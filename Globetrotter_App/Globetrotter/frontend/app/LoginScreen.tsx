import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import ReusableButton from "@/ components/buttons";
import Input from "@/ components/inputs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { BASE_URL } from "@/constants";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const navigateToWelcome = () => {
    router.push("/");
  };
  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert(data.message);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      Alert.alert("An error occured during login.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigateToWelcome}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.welcomeText}>Please sign in to continue</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="example@email.com / username"
          onChangeText={setIdentifier}
          value={identifier}
          textHeader="Email or Username"
        />
        <Input
          placeholder="example password"
          onChangeText={setPassword}
          value={password}
          textHeader="Password"
          secureTextEntry={!showPassword}
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={showPassword}
            onValueChange={setShowPassword}
            color={showPassword ? "#162D3A" : undefined}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={1}
          >
            <Text style={styles.checkboxLabel}>Show Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginButtonContainer}>
          <ReusableButton
            title="Login"
            onPress={() => handleLogin()}
            style={{ backgroundColor: "#162D3A" }}
            textStyle={{ color: "white" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#4C809C",
  },
  backButton: {
    width: 50,
    height: 50,
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  welcomeContainer: {
    marginTop: 150,
    marginLeft: 40,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 15,
  },
  inputContainer: {
    marginTop: 50,
  },
  email: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 20,
  },
  password: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    marginLeft: 15,
    borderColor: "#162D3A",
    borderRadius: 5,
    width: 16,
    height: 16,
  },
  checkboxLabel: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
  loginButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
