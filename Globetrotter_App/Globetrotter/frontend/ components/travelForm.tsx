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

interface myFormProps {
  onSubmit: (data: any) => void;
}

export const MyForm = ({ onSubmit }: myFormProps) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [tripLength, setTripLength] = useState(1);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [selectedWeather, setSelectedWeather] = useState("");
  const [selectedBiome, setSelectedBiome] = useState("");
  const [selectedContinents, setSelectedContinents] = useState<any[]>([]);
  const [avoidDestinations, setAvoidDestinations] = useState("");
  const [sliderValue, setSliderValue] = useState(50);

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
  const weather = [
    { label: "Sunny", value: "sunny" },
    { label: "Rainy", value: "rainy" },
    { label: "Snowy", value: "snowy" },
    { label: "Windy", value: "windy" },
    { label: "Cloudy", value: "cloudy" },
    { label: "Stormy", value: "stormy" },
    { label: "Doesn't matter", value: "doesnt_matter" },
  ];
  const biome = [
    { label: "Desert", value: "desert" },
    { label: "Tropical", value: "tropical" },
    { label: "Mountainous", value: "mountainous" },
    { label: "Urban", value: "urban" },
    { label: "Rural", value: "rural" },
    { label: "Forest", value: "forest" },
    { label: "Beach", value: "beach" },
    { label: "Snowy", value: "snowy" },
  ];
  const continents = [
    { label: "North America", value: "north_america" },
    { label: "South America", value: "south_america" },
    { label: "Europe", value: "europe" },
    { label: "Asia", value: "asia" },
    { label: "Africa", value: "africa" },
    { label: "Australia", value: "australia" },
    { label: "Antarctica", value: "antarctica" },
  ];
  const handleSubmit = () => {
    onSubmit({
      tripType: selectedItem,
      tripLength: tripLength,
      departureDate: departureDate,
      temperature: sliderValue,
      // weather: selectedWeather,
      biome: selectedBiome,
      continents: selectedContinents,
      avoidDestinations: avoidDestinations,
    });
  };
  const handleTripTypeSelect = (item: { value: string; label: string }) => {
    setSelectedItem(item.value);
  };
  const handleWeatherSelect = (item: { value: string; label: string }) => {
    setSelectedWeather(item.value);
  };
  const handleBiomeSelect = (item: { value: string; label: string }) => {
    setSelectedBiome(item.value);
  };
  return (
    <ScrollView>
      <Text style={styles.headerText}>Travel Preferences Form</Text>
      {/* <View style={styles.horizontalBar} /> */}
      <View style={styles.container}>
        <View style={styles.tripBasicsContainer}>
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="leaf"
              size={20}
              color="#328640"
              style={{ marginTop: -8 }}
            />
            <Text style={[styles.CategoryHeaderText, { marginLeft: 5 }]}>
              Environmental Preferences
            </Text>
          </View>

          <View style={{}}>
            <Text style={[styles.label, { marginTop: 15 }]}>
              Temperature Preference:
            </Text>
            {/* <Text>Value: {sliderValue.toFixed(2)}</Text> */}
            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor="#40c5f4"
              maximumTrackTintColor="#f04048"
              value={sliderValue}
              onValueChange={(value) => setSliderValue(value)}
              step={10}
              thumbTintColor="#eee"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: -12,
                marginRight: 0,
              }}
            >
              <Text style={{ color: "#444", fontSize: 12 }}>Cold (0° F)</Text>
              <Text style={{ color: "#444", fontSize: 12 }}>Warm (50° F)</Text>
              <Text style={{ color: "#444", fontSize: 12 }}>Hot (100° F)</Text>
            </View>
          </View>
          {/* <Text style={[styles.label, { marginTop: 10 }]}>
            Weather Preferences:
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Dropdown
              title="Select Weather"
              items={weather}
              onSelect={handleWeatherSelect}
              selectedValue={selectedWeather}
            ></Dropdown>
          </View> */}
          <Text style={[styles.label, { marginTop: 15 }]}>Biome:</Text>

          <Dropdown
            title="Select Biome"
            items={biome}
            onSelect={handleBiomeSelect}
            selectedValue={selectedBiome}
          ></Dropdown>
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
        <View style={[styles.tripBasicsContainer, { marginTop: 15 }]}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons
              name="earth"
              size={20}
              color="#328640"
              style={{ marginTop: 0 }}
            />
            <Text style={[styles.CategoryHeaderText, { marginLeft: 5 }]}>
              Geographic Constraints
            </Text>
          </View>
          <Text style={[styles.label, { marginTop: 10 }]}>
            Select Continents:
          </Text>
          {continents.map((continent) => {
            const selected = selectedContinents.some(
              (c) => c.value === continent.value
            );
            return (
              <TouchableOpacity
                key={continent.value}
                style={{
                  backgroundColor: selected ? "#328640" : "#ccc",
                  padding: 8,
                  borderRadius: 6,
                  marginVertical: 4,
                }}
                onPress={() => {
                  setSelectedContinents((prev) =>
                    selected
                      ? prev.filter((c) => c.value !== continent.value)
                      : [...prev, continent]
                  );
                }}
              >
                <Text style={{ color: "white" }}>{continent.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 20 }]}>
          Avoid Specific Destinations:
        </Text>
        <Text style={{ color: "#888", fontSize: 13 }}>
          Input any specific places you have already been or places you do not
          want to travel to
        </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginTop: 10,
            paddingLeft: 10,
            borderRadius: 8,
          }}
          placeholder="Ex: Paris, China, South Africa, Vancouver, etc."
          placeholderTextColor="#888"
          onChangeText={(text) => setAvoidDestinations(text)}
          value={avoidDestinations}
        />

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
