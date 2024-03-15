import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
const Scaledrone = require("scaledrone-react-native");
const screen = Dimensions.get("window");

const SCALEDRONE_CHANNEL_ID = "BZEpEFS58OXSTFxg";

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function FriendNearby() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: 20.5337217,
          longitude: 105.9445885,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
