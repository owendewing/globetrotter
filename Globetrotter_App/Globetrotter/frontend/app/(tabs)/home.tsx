import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import ReusableButton from "@/ components/buttons";
import { TravelModal } from "@/ components/travelModal";
import { MyForm } from "@/ components/travelForm";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [darkenBackground, setDarkenBackground] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null
  );
  const [itineraryModalVisible, setItineraryModalVisible] = useState(false);

  interface FormData {
    avoidDestinations?: string;
    departureDate?: Date | string;
    [key: string]: any;
  }

  interface DayPlan {
    day: number;
    location: string;
    activities: string[];
    accommodation: string;
  }

  interface Itinerary {
    title: string;
    description: string;
    destination: string;
    days: DayPlan[];
  }

  interface ItineraryResponse {
    itineraries: Itinerary[];
  }

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const processedData = { ...formData };

      if (processedData.avoidDestinations) {
        processedData.avoidDestinations =
          processedData.avoidDestinations.toString();
      }

      if (processedData.departureDate) {
        if (processedData.departureDate instanceof Date) {
          processedData.departureDate = processedData.departureDate
            .toISOString()
            .split("T")[0];
        }
      }

      console.log("Submitting form data:", processedData);

      const response = await fetch("http://localhost:5000/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!response) {
        throw new Error("No response from server");
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(
            `HTTP error! status: ${response.status} ${response.statusText}`
          );
        }
        throw new Error(errorData.message || "Unknown server error");
      }

      const data = await response.json();

      setModalVisible(false);
      alert("Itinerary generated successfully!");
      setItineraries(data.itinerary.itineraries);
      console.log("Success:", data.itinerary);
    } catch (error) {
      console.error("Full error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to generate itinerary: ${errorMessage}`);
    }
  };

  const modalPress = () => {
    setModalVisible(true);
    setDarkenBackground(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Globetrotter</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.formText}>
          Fill out this form to generate an itinerary for your next trip!
        </Text>
        <ReusableButton
          title="Create an Itinerary"
          onPress={modalPress}
          style={{
            backgroundColor: "white",
            marginTop: 140,
            marginRight: 200,
            width: 180,
            height: 45,
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.3)",
          }}
          textStyle={{ color: "#328640", fontSize: 18, fontWeight: "600" }}
        />
      </View>

      {itineraries.length > 0 && (
        <View style={styles.itineraryContainer}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: 600 }}>
            Generated Itineraries
          </Text>
          {itineraries.map((item, index) => (
            <ReusableButton
              key={index}
              title={`Itinerary ${index + 1}: ${item.destination}`}
              onPress={() => {
                setSelectedItinerary(item);
                setItineraryModalVisible(true);
              }}
              style={{
                backgroundColor: "white",
                marginVertical: 8,
                width: 250,
                alignSelf: "center",
              }}
              textStyle={{
                color: "#328640",
                fontSize: 18,
                fontWeight: "600",
              }}
            />
          ))}
        </View>
      )}

      <TravelModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <MyForm onSubmit={handleFormSubmit}></MyForm>
      </TravelModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    height: 200,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 40,
    color: "#328640",
    marginTop: 150,
    marginLeft: 10,
  },
  formContainer: {
    height: 300,
    backgroundColor: "#4C809C",
    alignItems: "center",
  },
  formText: {
    color: "white",
    fontSize: 20,
    marginTop: 50,
    fontWeight: "600",
    width: 380,
    marginRight: 10,
  },
  itineraryContainer: {
    backgroundColor: "#4C809C",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
  itineraryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  itineraryText: {
    fontSize: 16,
    color: "white",
    lineHeight: 24,
    textAlign: "left",
    marginBottom: 10,
  },
  itineraryItem: {
    marginBottom: 10,
  },
});
