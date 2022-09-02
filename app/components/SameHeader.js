import React, { useEffect } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Animated,
  Easing,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getStatusBarHeight } from "react-native-status-bar-height";
import createAnimation from "../utils/createAnimation";
import * as RootNavigation from "../utils/RootNavigation";

const statusBarHeight =
  Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;

const SameHeader = ({
  title,
  icon,
  action,
  havingBorder,
  havingIcon,
  havingBackground,
  defaultStyle,
  havingBackButton,
  backAction,
}) => {
  const animatedOpacity = new Animated.Value(0.1);

  useEffect(() => {
    createAnimation(animatedOpacity, 200, Easing.inout, null, 1).start();
  });

  if (havingBackground) {
    return (
      <Animated.View style={{ opacity: animatedOpacity }}>
        <ImageBackground
          source={require("../assets/headerBg.png")}
          style={{
            width: "100%",
            paddingTop: 8,
            height: statusBarHeight + 55,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {havingIcon ? (
            <TouchableOpacity style={{ marginTop: statusBarHeight }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                  marginTop: 1.8,
                }}
              >
                <Image
                  style={{ width: 100, height: 35 }}
                  source={require("../assets/logo.png")}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "left",
                marginTop: statusBarHeight,
                marginLeft: 15,
              }}
            >
              {title}
            </Text>
          )}
          <TouchableOpacity
            onPress={action}
            style={{ marginTop: statusBarHeight }}
          >
            <View
              style={{
                marginRight: 13,
                backgroundColor: "rgba(255,255,255,0.25)",
                padding: 5,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 100,
                marginBottom: 5,
              }}
            >
              <Ionicons name={icon} size={23} color={"white"} />
            </View>
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>
    );
  } else if (defaultStyle) {
    return (
      <View className="bg-white">
        <SafeAreaView>
          <View
            className={`${
              havingBorder && "border-b-[1px] border-gray-300"
            } pb-3 pt-1.5 bg-white`}
          >
            <Text className="text-center font-medium text-lg mt-1">
              {title}
            </Text>
          </View>
          {havingBackButton && (
            <>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  left: 15,
                  top:
                    Platform.OS === "ios"
                      ? Dimensions.get("screen").height > 667
                        ? 54
                        : 30
                      : Platform.OS === "web"
                      ? 15
                      : 30,
                  zIndex: 99,
                }}
                onPress={
                  !backAction ? () => RootNavigation.goBack() : backAction
                }
              >
                <View>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                    style={{ top: 1, left: -7 }}
                  />
                </View>
              </TouchableOpacity>
            </>
          )}
        </SafeAreaView>
      </View>
    );
  } else {
    return (
      <View>
        <View
          style={
            havingBorder
              ? {
                  width: "100%",
                  paddingTop: 8,
                  height: statusBarHeight + 55,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  borderBottomWidth: 0.2,
                  borderColor: "rgba(0,0,0,0.2)",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 7,
                }
              : {
                  width: "100%",
                  paddingTop: 8,
                  height: statusBarHeight + 55,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                }
          }
        >
          {havingIcon ? (
            <TouchableOpacity style={{ marginTop: statusBarHeight }}>
              <Animated.View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                  marginTop: 1.8,
                  opacity: animatedOpacity,
                }}
              >
                <Image
                  style={{ width: 100, height: 35 }}
                  source={require("../assets/logo.png")}
                  resizeMode="contain"
                />
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <Animated.Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "left",
                marginTop: statusBarHeight,
                marginLeft: 15,
                opacity: animatedOpacity,
              }}
            >
              {title}
            </Animated.Text>
          )}
          <TouchableOpacity
            onPress={action}
            style={{ marginTop: statusBarHeight }}
          >
            <Animated.View
              style={{
                marginRight: 13,
                backgroundColor: "rgba(0,0,0,0.10)",
                padding: 5,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 100,
                marginBottom: 5,
                opacity: animatedOpacity,
              }}
            >
              <Ionicons name={icon} size={23} color={"black"} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

export default SameHeader;
