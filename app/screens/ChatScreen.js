import React from "react";
import { View, ScrollView, Animated, Image, Easing, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import createAnimation from "../utils/createAnimation";

export default function ChatScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const translateX = new Animated.Value(0);
  const opacity = new Animated.Value(0);
  const prevScreen = route.params.previous_screen;

  const fadeIn = (from) => {
    translateX.setValue(from == "right" ? 150 : -150);
    opacity.setValue(0.1);

    Animated.parallel([
      createAnimation(translateX, 150, Easing.inout, null, 0),
      createAnimation(opacity, 200, Easing.inout, null, 1),
    ]).start();
  };

  React.useEffect(() => {
    if (isFocused && prevScreen != "ChatScreen") {
      if (prevScreen == "HomeScreen" || prevScreen == "NewsfeedScreen") {
        fadeIn("right");
      } else {
        fadeIn("left");
      }
    }
  }, [route]);
  return (
    <>
      {/* <Animated.ScrollView
        style={{
          height: "100%",
          transform: [{ translateX: translateX }],
          opacity: opacity,
          backgroundColor: "#F2F2F2",
          flex: 1,
        }}
      >
        <Text style={{ fontSize: 40 }}>Tung Anh</Text>
        <Image source={require("../assets/1.jpeg")}></Image>
      </Animated.ScrollView> */}
    </>
  );
}
