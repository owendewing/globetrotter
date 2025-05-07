import { Modal, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const ReusableModal = ({ visible, onClose, children }: ModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: 350,
            height: 600,
            backgroundColor: "white",
            borderRadius: 25,
            padding: 5,
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          }}
        >
          {children}
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10, marginTop: 6 }}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
