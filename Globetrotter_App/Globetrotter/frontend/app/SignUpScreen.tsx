import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import ReusableButton from "@/ components/buttons";
import Input from "@/ components/inputs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import Checkbox from "expo-checkbox";

export default function SignUpScreen() {
  const [fullname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const navigateToWelcome = () => {
    router.push("/");
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match! Please check your entries.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Password must be at least 8 characters long.");
      return;
    }
    if (username.length < 5) {
      Alert.alert("Username must be at least 5 characters long.");
      return;
    }
    if (fullname.length == 0) {
      Alert.alert("Please input a full name.");
      return;
    }
    if (email === "" || !email.includes("@")) {
      Alert.alert("Please input a valid email.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert(data.message);
        router.push("/");
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      Alert.alert("An error occured during sign up.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigateToWelcome}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.welcomeText}> Please Create an Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          placeholder="enter full name"
          onChangeText={setFullName}
          value={fullname}
          textHeader="Full Name"
        />
        <Input
          placeholder="enter username"
          onChangeText={setUsername}
          value={username}
          textHeader="Username"
        />
        <Input
          placeholder="example@email.com"
          onChangeText={setEmail}
          value={email}
          textHeader="Email"
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
        <Input
          placeholder="re enter password"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          textHeader="Confirm Password"
          secureTextEntry={!showConfirmPassword}
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            style={styles.checkbox}
            value={showConfirmPassword}
            onValueChange={setShowConfirmPassword}
            color={showConfirmPassword ? "#162D3A" : undefined}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            activeOpacity={1}
          >
            <Text style={styles.checkboxLabel}>Show Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginButtonContainer}>
          <ReusableButton
            title="Sign Up"
            onPress={handleSignUp}
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
    flex: 1,
    backgroundColor: "#4C809C",
    padding: 20,
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
    marginTop: -20,
    marginLeft: 40,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 15,
  },
  inputContainer: {
    marginTop: 30,
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
  },
});
