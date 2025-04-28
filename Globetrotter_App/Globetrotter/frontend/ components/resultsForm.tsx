import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ReusableButton from "./buttons";

interface resultsFormProps {
  onSubmit: () => void;
  itinerary: Itinerary;
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

export const ResultsForm = ({
  onSubmit,
  itinerary,
}: resultsFormProps): JSX.Element => {
  return (
    <ScrollView style={styles.resultsContainer}>
      <View style={styles.resultsMain}>
        <Text style={styles.resultsHeader}>Travel Itinerary</Text>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>
          Destination: {itinerary.destination}
        </Text>
        {itinerary.days.map((dayPlan) => (
          <View key={dayPlan.day} style={{ marginBottom: 8, marginTop: 8 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, color: "#328640" }}
            >
              Day {dayPlan.day}: {dayPlan.location}
            </Text>
            <Text style={{ lineHeight: 18 }}>
              Accommodation: {dayPlan.accommodation}
            </Text>
            <Text style={{ lineHeight: 18 }}>Activities:</Text>
            {dayPlan.activities.map((activity, idx) => (
              <Text style={{ lineHeight: 19 }} key={idx}>
                - {activity}
              </Text>
            ))}
          </View>
        ))}
        <ReusableButton
          title="Save Itinerary to Profile"
          onPress={onSubmit}
          style={{ backgroundColor: "#328640", width: 300 }}
          textStyle={{ color: "white", fontWeight: 700, fontSize: 18 }}
        ></ReusableButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 30,
    fontWeight: 700,
  },
  resultsMain: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
