import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default class LoadingView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#FFD700" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
