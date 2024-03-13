import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  SafeAreaView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as RootNavigation from "../utils/RootNavigation";
import Constants from "expo-constants";

const statusBarHeight = Constants.statusBarHeight;

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
  // const animatedOpacity = new Animated.Value(0.1);

  // useEffect(() => {
  //   createAnimation(animatedOpacity, 200, Easing.inout, null, 1).start();
  // });

  if (havingBackground) {
    // Homepage
    return (
      <View>
        <ImageBackground
          source={require("../assets/headerBg.png")}
          style={{
            width: "100%",
            paddingTop: statusBarHeight,
            height:
              Platform.OS == "android"
                ? statusBarHeight * 3
                : statusBarHeight * 2,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {havingIcon ? (
            <SafeAreaView>
              <TouchableOpacity>
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
            </SafeAreaView>
          ) : (
            <SafeAreaView>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  textAlign: "left",
                  marginLeft: 15,
                }}
              >
                {title}
              </Text>
            </SafeAreaView>
          )}
          <SafeAreaView>
            <TouchableOpacity
              onPress={action}
              // style={{ marginTop: statusBarHeight }}
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
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  } else if (defaultStyle) {
    // Default bar
    return (
      <View
        className="bg-white"
        style={Platform.OS === "android" && { marginTop: statusBarHeight }}
      >
        <SafeAreaView>
          <View
            className={`${
              havingBorder && "border-b-[1px] border-gray-300"
            } pb-3 pt-1.5 bg-white flex flex-row`}
          >
            {havingBackButton && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    width: 40,
                    height: 40,
                    borderRadius: 35,
                    marginLeft: 10,
                    marginTop: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    zIndex: 999,
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
            <Text className="text-center font-medium text-lg mt-1 flex-1">
              {title}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  } else {
    // Feed
    return (
      <View>
        <View
          style={
            havingBorder
              ? {
                  width: "100%",
                  paddingTop: statusBarHeight,
                  height:
                    Platform.OS == "android"
                      ? statusBarHeight * 3
                      : statusBarHeight * 2,
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
                  paddingTop: statusBarHeight,
                  height:
                    Platform.OS == "android"
                      ? statusBarHeight * 3
                      : statusBarHeight * 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                }
          }
        >
          {havingIcon ? (
            <SafeAreaView>
              <TouchableOpacity
              //  style={{ marginTop: statusBarHeight }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                    marginTop: 1.8,
                    // opacity: animatedOpacity,
                  }}
                >
                  <Image
                    style={{ width: 100, height: 35 }}
                    source={require("../assets/logo.png")}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </SafeAreaView>
          ) : (
            <Text
              style={[
                {
                  fontSize: 25,
                  fontWeight: "bold",
                  textAlign: "left",
                  marginLeft: 15,
                  // opacity: animatedOpacity,
                },
                Platform.OS === "ios" && { marginTop: statusBarHeight },
              ]}
            >
              {title}
            </Text>
          )}
          <SafeAreaView>
            <TouchableOpacity
              onPress={action}
              // style={{ marginTop: statusBarHeight }}
            >
              <View
                style={{
                  marginRight: 13,
                  backgroundColor: "rgba(0,0,0,0.10)",
                  padding: 5,
                  paddingLeft: 6,
                  paddingRight: 6,
                  borderRadius: 100,
                  marginBottom: 5,
                  // opacity: animatedOpacity,
                }}
              >
                <Ionicons name={icon} size={23} color={"black"} />
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    );
  }
};

export default SameHeader;
