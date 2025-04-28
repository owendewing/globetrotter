import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import Dropdown from "./dropdown";
import InputSpinner from "react-native-input-spinner";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

interface shortenedFormProps {
  onSubmit: (data: any) => void;
  destination: string;
}

export const ShortenedForm = ({
  onSubmit,
  destination,
}: shortenedFormProps) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [tripLength, setTripLength] = useState(1);
  const [departureDate, setDepartureDate] = useState(new Date());

  const items = [
    { label: "Party/Bachelorette", value: "party" },
    { label: "Family", value: "family" },
    { label: "Solo", value: "solo" },
    { label: "Couple/Romantic", value: "couple" },
    { label: "Business", value: "business" },
    { label: "Adventure", value: "adventure" },
    { label: "Relaxation", value: "relaxation" },
    { label: "Cultural/Historical", value: "cultural" },
    { label: "Nature/Sightseeing", value: "nature" },
    { label: "Cruise", value: "cruise" },
    { label: "Relaxation/Spa", value: "wellness" },
    { label: "Other", value: "other" },
  ];
  const handleSubmit = () => {
    onSubmit({
      tripType: selectedItem,
      tripLength: tripLength,
      departureDate: departureDate,
      destination: destination,
    });
  };
  const handleTripTypeSelect = (item: { value: string; label: string }) => {
    setSelectedItem(item.value);
  };
  return (
    <ScrollView>
      <Text style={styles.headerText}>Travel Preferences Form</Text>
      <View style={styles.container}>
        <View style={styles.tripBasicsContainer}>
          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="location-outline" size={20} color="#328640" />

              <Text style={[styles.CategoryHeaderText, { marginLeft: 8 }]}>
                Trip Destination
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 10,
                padding: 5,
                borderColor: "#aaa",
              }}
            >
              <Text>{destination}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.tripBasicsContainer, { marginTop: 15 }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="briefcase"
              size={20}
              color="#328640"
              style={{ marginTop: -8 }}
            />
            <Text style={[styles.CategoryHeaderText, { marginLeft: 8 }]}>
              Trip Basics
            </Text>
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.label}>Trip Length (days):</Text>
            <View
              style={{
                backgroundColor: "#eee",
                borderRadius: 8,
                height: 35,
                justifyContent: "center",
              }}
            >
              <InputSpinner
                max={10}
                min={1}
                colorMax={"#fff"}
                colorMin={"#fff"}
                value={tripLength}
                onChange={(num) => setTripLength(num as number)}
                width={100}
                height={30}
                buttonStyle={styles.spinnerButton}
                buttonTextStyle={styles.spinnerButtonText}
                colorPress={"#eee"}
                color={"#eee"}
              />
            </View>
          </View>

          <View style={styles.optionContainer}>
            <Text style={styles.label}>Departure Date:</Text>
            <DateTimePicker
              value={departureDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDepartureDate(selectedDate);
              }}
              minimumDate={new Date()}
            />
          </View>
        </View>

        <View style={[styles.tripBasicsContainer, { marginTop: 15 }]}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="airplane"
              size={20}
              color="#328640"
              style={{ marginTop: 0 }}
            />
            <Text style={[styles.CategoryHeaderText, { marginLeft: 5 }]}>
              Vacation Style
            </Text>
          </View>

          <Dropdown
            title="Select Trip Type"
            items={items}
            onSelect={handleTripTypeSelect}
            selectedValue={selectedItem}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 24,
    color: "black",
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  tripBasicsContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#aaa",
    padding: 10,
  },
  CategoryHeaderText: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: {
    fontSize: 15,
    color: "black",
    flexShrink: 1,
    marginRight: 10,
  },
  spinnerButton: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  spinnerButtonText: {
    marginTop: -5,
  },
  submitButton: {
    backgroundColor: "#328640",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
