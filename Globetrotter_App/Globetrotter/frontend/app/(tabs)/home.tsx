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
import { ReusableModal } from "@/ components/modal";
import { MyForm } from "@/ components/travelForm";
import { ResultsForm } from "@/ components/resultsForm";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [darkenBackground, setDarkenBackground] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null
  );
  const [itineraryModalVisible, setItineraryModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
        credentials: "include",
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
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = async () => {
    try {
      const response = await fetch("http://localhost:5000/save-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itinerary: selectedItinerary }),
      });

      if (!response) {
        throw new Error("No response from server");
      }

      alert("Itinerary saved successfully!");
    } catch (error) {
      console.log("Error:", error);
      alert(`Failed to save itinerary: ${error}`);
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

        <Text style={styles.formText}>
          Fill out this form to generate an itinerary for your next trip!
        </Text>
        <View style={{ alignItems: "center" }}>
          <ReusableButton
            title="Create an Itinerary"
            onPress={modalPress}
            style={{
              backgroundColor: "#328640",
              marginTop: 50,
              width: 350,
              height: 52,
            }}
            textStyle={{ color: "white", fontSize: 20, fontWeight: "700" }}
          />
        </View>

        {itineraries.length > 0 && (
          <View style={styles.itineraryContainer}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: 500 }}>
              Generated Itineraries
            </Text>
            {itineraries.map((item, index) => (
              <ReusableButton
                key={index}
                // title={`Itinerary ${index + 1}: ${item.destination}`}
                onPress={() => {
                  setSelectedItinerary(item);
                  setItineraryModalVisible(true);
                  console.log(item.days);
                }}
                style={{
                  backgroundColor: "white",
                  marginVertical: 0,
                  width: 350,
                  height: 70,
                  alignSelf: "center",
                }}
                textStyle={{
                  color: "#328640",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        marginTop: -5,
                        paddingHorizontal: 10,
                        fontSize: 15,
                      }}
                    >
                      Itinerary {index + 1}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 600,
                        fontSize: 22,
                        marginHorizontal: 10,
                        marginTop: 0,
                      }}
                    >
                      {item.destination}
                    </Text>
                  </View>
                  <Ionicons
                    style={{ marginTop: 10, paddingHorizontal: 10 }}
                    name="arrow-forward"
                    size={20}
                    color="black"
                  />
                </View>
              </ReusableButton>
            ))}
          </View>
        )}

        <ReusableModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          {loading ? (
            <View style={styles.modalSpinnerContainer}>
              <ActivityIndicator size="large" color="#328640" />
            </View>
          ) : (
            <MyForm onSubmit={handleFormSubmit} />
          )}
        </ReusableModal>

        <ReusableModal
          visible={itineraryModalVisible}
          onClose={() => setItineraryModalVisible(false)}
        >
          {selectedItinerary && (
            <ResultsForm
              itinerary={selectedItinerary}
              onSubmit={handleSaveItinerary}
            ></ResultsForm>
          )}
        </ReusableModal>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#328640" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: "100%",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 60,
    color: "#328640",
    marginTop: 200,
    marginLeft: 10,
    textAlign: "center",
  },
  formText: {
    color: "black",
    fontSize: 20,
    marginTop: 30,
    fontWeight: "400",
    width: 380,
    marginLeft: 22,
    paddingHorizontal: 20,
    lineHeight: 25,
  },
  itineraryContainer: {
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
  loadingOverlay: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1000,
  },
  modalSpinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
