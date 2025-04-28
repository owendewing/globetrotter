import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useState, useCallback } from "react";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

interface DropdownProps {
  title: string;
  items: { value: string; label: string }[];
  onSelect: (item: { value: string; label: string }) => void;
  selectedValue?: string;
}

export default function Dropdown({
  title,
  items,
  onSelect,
  selectedValue,
}: DropdownProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleDropdown = useCallback(() => setExpanded(!expanded), [expanded]);
  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : title;

  const handleSelect = (item: { value: string; label: string }) => {
    onSelect(item);
    setExpanded(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        activeOpacity={0.8}
        onPress={toggleDropdown}
      >
        <Text style={styles.dropdownText}>{displayText}</Text>
        <AntDesign
          name={expanded ? "caretup" : "caretdown"}
          size={12}
          color="white"
        />
      </TouchableOpacity>
      {expanded ? (
        <View style={styles.options}>
          {items.map((item, index) => (
            <React.Fragment key={item.value}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.optionButton,
                  selectedValue === item.value && styles.selectedOption,
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.dropdownText}>{item.label}</Text>
              </TouchableOpacity>
              {index !== items.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  dropdownButton: {
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#328640",
    borderRadius: 10,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  options: {
    backgroundColor: "#4C809C",
    borderRadius: 10,
    marginTop: 5,
    padding: 10,
  },
  separator: {
    // height: 1,
    backgroundColor: "#ccc",
    marginVertical: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: "#328640",
    borderRadius: 10,
    marginVertical: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#fff",
  },
});
