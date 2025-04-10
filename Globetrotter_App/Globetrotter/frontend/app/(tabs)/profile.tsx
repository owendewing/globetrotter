import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import TabViewExample from "@/ components/tabBar";

interface User {
  full_name: string;
  username: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get<{ user: User }>(
        "http://127.0.0.1:5000/get-current-user",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setUserData(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profilePicture}></View>
      <View style={styles.userInfo}>
        <Text style={[styles.text, { fontWeight: 500, fontSize: 30 }]}>
          {userData?.full_name}
        </Text>
        <Text style={styles.text}>@{userData?.username}</Text>
      </View>
      <TabViewExample></TabViewExample>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C809C",
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginTop: 90,
    alignSelf: "center",
  },
  text: {
    color: "#fff",
  },
  userInfo: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 20,
  },
});
