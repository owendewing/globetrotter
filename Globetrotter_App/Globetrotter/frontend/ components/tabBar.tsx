import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { TabView, SceneMap, TabBar, TabBarProps } from "react-native-tab-view";
import ReusableButton from "./buttons";
import { Ionicons } from "@expo/vector-icons";
import { ReusableModal } from "./modal";
import { useRouter } from "expo-router";
import { ShortenedForm } from "./shortenedForm";

export function ShortForm({ onSubmit, destination }) {
  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/generate-wishlist-itinerary",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ destination }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate itinerary");
      }

      const data = await response.json();
      console.log("Generated wishlist itinerary:", data.itinerary);

      onSubmit(data.itinerary.itineraries); // <-- Call parent's onSubmit with itineraries
    } catch (error) {
      console.error(error);
      alert("Failed to generate wishlist itinerary");
    }
  };

  return (
    <View>
      {/* Your inputs/buttons */}
      <ReusableButton title="Generate" onPress={handleSubmit} />
    </View>
  );
}
const wishlistRoute = () => {
  const [wishlistInputs, setWishlistInputs] = useState([{ itinerary: "" }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null);

  const addWishlistItem = () => {
    setWishlistInputs([...wishlistInputs, { itinerary: "" }]);
  };

  const deleteWishlistItem = (index: number) => {
    const list = [...wishlistInputs];
    list.splice(index, 1);
    setWishlistInputs(list);
  };

  const handleItineraryChange = (text: string, index: number) => {
    const list = [...wishlistInputs];
    list[index] = { itinerary: text };
    setWishlistInputs(list);
  };
  const router = useRouter();

  const createItineraryWithWishlist = (wishlistInputs) => {
    if (wishlistInputs.length === 0) {
      alert("Please enter at least one destination.");
      return;
    }
    setModalVisible(true);
  };

  export function ShortenedForm({ onSubmit, destination }) {
    const handleSubmit = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/generate-wishlist-itinerary",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ destination }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate itinerary");
        }

        const data = await response.json();
        console.log("Generated wishlist itinerary:", data.itinerary);

        onSubmit(data.itinerary.itineraries); // <-- Call parent's onSubmit with itineraries
      } catch (error) {
        console.error(error);
        alert("Failed to generate wishlist itinerary");
      }
    };

    return (
      <View>
        {/* Your inputs/buttons */}
        <ReusableButton title="Generate" onPress={handleSubmit} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        backgroundColor: "#F2F2F2",
        flex: 1,
        height: "100%",
        paddingHorizontal: 20,
      }}
    >
      <View style={{ marginTop: 15, marginBottom: 30 }}>
        <Text style={{ fontWeight: 600, fontSize: 22 }}>Your Wishlist</Text>
        <Text style={{ fontSize: 14, color: "#444", marginTop: 5 }}>
          Enter up to 5 destinations you want to visit.
        </Text>
        <Text style={{ fontSize: 14, color: "#444", marginTop: 2 }}>
          Press "Create" to generate a trip itinerary.
        </Text>

        {wishlistInputs.map((itinerary, index) => (
          <View
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
              marginBottom: 6,
            }}
          >
            <View style={styles.inputRow}>
              <Ionicons
                name="location"
                size={20}
                color="#444"
                style={{ marginLeft: 5 }}
              />
              <TextInput
                placeholder="Enter a destination"
                placeholderTextColor={"#444"}
                onChangeText={(e) => {
                  handleItineraryChange(e, index);
                }}
                value={itinerary.itinerary}
                style={styles.input}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  marginLeft: 10,
                  borderRadius: 12,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#328640",
                }}
              >
                <ReusableButton
                  title="Create"
                  onPress={() => {
                    if (wishlistInputs[index].itinerary.trim() === "") {
                      alert(
                        "Please enter a destination before creating an itinerary."
                      );
                      return;
                    }
                    setSelectedWishlist(wishlistInputs[index].itinerary);
                    createItineraryWithWishlist(wishlistInputs);
                  }}
                  style={{ width: 55 }}
                  textStyle={{
                    textAlign: "center",
                    marginTop: -20,
                    color: "#fff",
                  }}
                ></ReusableButton>
              </View>
              {wishlistInputs.length > 1 && (
                <ReusableButton
                  title=""
                  onPress={() => deleteWishlistItem(index)}
                  style={{
                    width: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#888",
                    marginTop: 0,
                    marginLeft: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="trash" size={20} color="#444" />
                </ReusableButton>
              )}
            </View>
          </View>
        ))}

        {wishlistInputs.length < 5 && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <ReusableButton
              title=""
              onPress={addWishlistItem}
              textStyle={styles.addButtonText}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                backgroundColor: "#4C809C",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="add" size={30} color="white" />
            </ReusableButton>
            <ReusableModal
              visible={modalVisible}
              onClose={() => {
                setModalVisible(false);
                setSelectedWishlist(null);
              }}
            >
              <ShortenedForm
                onSubmit={() => console.log("hi")}
                destination={selectedWishlist || ""}
              ></ShortenedForm>
            </ReusableModal>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const savedTripsRoute = () => {
  const [itineraries, setSavedItineraries] = useState<Itinerary[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedItineraryIndex, setSelectedItineraryIndex] =
    useState<Itinerary | null>(null);
  const closeModal = () => setSelectedItineraryIndex(null);
  useEffect(() => {
    fetchSavedItineraries();
  }, []);

  const onRefresh = () => {
    setRefresh(true);
    fetchSavedItineraries();
    setRefresh(false);
  };

  const fetchSavedItineraries = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/get-saved-itineraries"
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData.message);
        return;
      }
      const data = await response.json();
      console.log("Saved itineraries:", data);
      setSavedItineraries(data.itineraries);
    } catch (error) {
      console.error("Error fetching saved itineraries:", error);
    }
  };

  const deleteItinerary = () => {
    console.log("hi");
  };

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

  return (
    <ScrollView
      style={[styles.scene, { backgroundColor: "#F2F2F2" }]}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <Text
        style={{
          paddingHorizontal: 20,
          fontSize: 22,
          fontWeight: 600,
          marginTop: 15,
        }}
      >
        Your Saved Trips
      </Text>
      <Text
        style={{
          paddingHorizontal: 20,
          fontSize: 14,
          color: "#444",
          marginTop: 5,
        }}
      >
        Click on a trip to view more details.
      </Text>
      <View>
        {itineraries.length === 0 && (
          <Text
            style={{
              fontSize: 18,
              color: "#000",
              marginTop: 20,
              paddingHorizontal: 20,
            }}
          >
            No saved itineraries yet.
          </Text>
        )}
        {itineraries.map((itinerary, index) => (
          <View key={index} style={{ flexDirection: "row", marginLeft: 10 }}>
            <ReusableButton
              style={{
                backgroundColor: "white",
                width: 320,
                height: 70,
                paddingHorizontal: 10,
                alignSelf: "center",
                marginRight: 30,
              }}
              onPress={() => setSelectedItineraryIndex(index)}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {itinerary.title}
              </Text>

              <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
                Destination: {itinerary.destination}
              </Text>
            </ReusableButton>
            <ReusableModal
              visible={selectedItineraryIndex === index}
              onClose={closeModal}
            >
              <ScrollView>
                <View
                  key={index}
                  style={{
                    justifyContent: "center",
                    alignItems: "flex-start",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ fontSize: 30, fontWeight: 700 }}>
                    Travel Itinerary
                  </Text>
                  <Text style={{ fontSize: 20, marginBottom: 10 }}>
                    Destination: {itinerary.destination}
                  </Text>

                  {itinerary.days.map((dayPlan, index) => (
                    <View key={index} style={{ marginBottom: 8, marginTop: 8 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          color: "#328640",
                        }}
                      >
                        Day {index + 1}: {dayPlan.location}
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
                </View>
              </ScrollView>
            </ReusableModal>
            <ReusableButton onPress={deleteItinerary}>
              <Ionicons
                name="trash"
                size={20}
                color="#444"
                style={{ marginTop: 10, marginLeft: -5 }}
              />
            </ReusableButton>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "travelWishlist", title: "Travel Wishlist" },
    { key: "savedTrips", title: "My Saved Trips" },
  ]);
  const renderScene = SceneMap({
    travelWishlist: wishlistRoute,
    savedTrips: savedTripsRoute,
  });
  const renderTabBar = (props: TabBarProps) => (
    <TabBar
      {...props}
      activeColor={"#328640"}
      inactiveColor={"#aaa"}
      indicatorStyle={{
        backgroundColor: "#328640",
        height: 2.5,
        borderRadius: 2,
      }}
      style={{
        marginTop: 25,
        backgroundColor: "#fff",
        shadowColor: "transparent",
      }}
    />
  );
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get("window").width }}
      style={{ flex: 1, width: "100%" }}
    />
  );
}
const styles = StyleSheet.create({
  scene: {
    flex: 1,
    // color: "#fff",
  },
  wishlistHeader: {
    textAlign: "center",
  },
  addButton: {},
  addButtonText: {
    fontSize: 30,
    marginTop: 0,
  },
  input: {
    width: 220,
    height: 50,
    paddingLeft: 5,
  },
  inputRow: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#888",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
