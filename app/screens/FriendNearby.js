import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
const screen = Dimensions.get("window");
import * as Location from "expo-location";

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.2;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function FriendNearby() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền truy cập vị trí đã bị từ chối!");
        return;
      }

      let location = await Location.getLastKnownPositionAsync();
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude || 20.5337217, // Use latitude state variable if it's not null, otherwise use a default value
          longitude: longitude || 105.9445885, // Use longitude state variable if it's not null, otherwise use a default value
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {latitude && longitude ? ( // Only render Marker if latitude and longitude are not null
          <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
        ) : null}
      </MapView>
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
