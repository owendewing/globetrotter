import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import TabViewExample from "@/ components/tabBar";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "@/constants";


interface User {
  full_name: string;
  username: string;
  image_url?: string;
}

export default function ProfileScreen() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImage(base64Image);
      uploadImage(base64Image);
    }
  };

  const uploadImage = async (base64Image: string) => {
    try {
      await axios.post(
        "http://localhost:5000/upload-profile-picture",
        { image: base64Image },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Upload failed", error);
    }
    await fetchUserData();
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get<{ user: User }>(
        `${BASE_URL}/get-current-user`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setUserData(response.data.user);
      if (response.data.user.image_url) {
        setProfileImage(response.data.user.image_url);
      }
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
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profilePicture} />
      ) : (
        <View style={styles.profilePicture}></View>
      )}
      <TouchableOpacity style={{ marginTop: 10 }} onPress={pickImage}>
        <Text style={{}}>
          {profileImage ? "Edit Profile Picture" : "Add Profile Picture"}
        </Text>
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Text style={[styles.text, { fontWeight: 500, fontSize: 30 }]}>
          {userData?.full_name}
        </Text>
        <Text style={styles.text}>@{userData?.username}</Text>
      </View>
      <TabViewExample />
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
    marginTop: 80,
    alignSelf: "center",
  },
  text: {
    color: "#fff",
  },
  userInfo: {
    marginTop: 30,
    alignItems: "center",
    paddingBottom: 20,
  },
});
