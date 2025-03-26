import React from "react";
import {View, Text, StyleSheet} from "react-native";

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#4C809C",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold"
    }
});