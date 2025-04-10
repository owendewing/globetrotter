import * as React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { TabView, SceneMap, TabBar, TabBarProps } from "react-native-tab-view";
import ReusableButton from "./buttons";
import { Ionicons } from "@expo/vector-icons";

const wishlistRoute = () => {
  const [wishlistInputs, setWishlistInputs] = useState([{ itinerary: "" }]);

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

  const createItineraryWithWishlist = () => {};

  return (
    <ScrollView
      style={{
        backgroundColor: "#fff",
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
                placeholder="London, Egypt, Asia, etc"
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
                  onPress={createItineraryWithWishlist}
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
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const savedTripsRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#fff" }]}>
    <Text>Second Tab</Text>
  </View>
);
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
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
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
