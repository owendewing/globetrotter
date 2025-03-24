import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useFonts } from 'expo-font';
import LoginButton from "@/ components/buttons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function WelcomeScreen() {
    const router = useRouter();
    const navigateToLogin = () => {
        router.navigate("/LoginScreen");
    };
    const navigateToSignUp = () => {
        router.navigate("/SignUpScreen");
    };
    let [fontsLoaded] = useFonts({
        McLaren: require('../assets/fonts/McLaren-Regular.ttf'),
      });
    
      if (!fontsLoaded) {
        return <Text>Loading...</Text>;
      }
  return (
    <View style={styles.container}>
        <Image style={styles.welcomeImage} source={require('../assets/images/world.jpg')} />
        <Text style={styles.title}>Globetrotter</Text>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <View style={styles.buttonBlock}>
            <LoginButton title="Login" onPress={() => navigateToLogin()} backgroundColor="#162D3A" color="white" />
            <LoginButton title="Sign Up" onPress={() => navigateToSignUp()} backgroundColor="white" color="#162D3A" />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4C809C"
    },
    title: {
        fontFamily: "McLaren-Regular",
        color: "#fff",
        fontSize: 40,
        fontWeight: "bold",
        justifyContent: "center",
        textAlign: "center",
        marginTop: 10,
    },
    welcomeText: {
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold",
        justifyContent: "center",
        textAlign: "center",
        marginTop: 150,
    },
    welcomeImage: {
        width: 400,
        height: 200,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    },
    buttonBlock: {
        marginTop: 60,
        alignItems: "center",
    }
});