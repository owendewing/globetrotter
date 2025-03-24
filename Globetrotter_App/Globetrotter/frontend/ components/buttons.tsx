import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


interface LoginButtonProps {
    title: string;
    onPress: () => void;
    backgroundColor?: string;
    color?: string;
}

export default function LoginButton({ title, onPress, backgroundColor, color }: LoginButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.authenticationButton, {backgroundColor}]}>
            <Text style={[styles.authenticationButtonText, {color}]}>{title}</Text>
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
        marginTop: 20
    },
    authenticationButtonText: {
        fontSize: 15,
        justifyContent: "center",
        textAlign: "center",
    }
})