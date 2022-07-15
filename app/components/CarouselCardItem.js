import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";

export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH - 15 * 2);

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={index}>
      <Image source={item.imgUrl} style={styles.image} />
      <Image
        source={require("../assets/black-fade.png")}
        style={styles.blackFade}
      />
      <View style={styles.outer}>
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 15,
    width: ITEM_WIDTH,
    overflow: "hidden",
    flex: 1,
    justifyContent: "flex-end",
  },
  image: {
    width: ITEM_WIDTH,
    height: 180,
  },
  header: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  body: {
    color: "white",
    fontSize: 15,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  outer: {
    position: "absolute",
    padding: 15,
  },
  blackFade: {
    position: "absolute",
    width: Dimensions.get("screen").width,
  },
});

export default CarouselCardItem;
