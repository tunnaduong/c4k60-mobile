import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  ImageBackground,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-tiny-toast";
import HomeScreenCarousel from "../components/HomeScreenCarousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-status-bar-height";
import UserAvatar from "../components/UserAvatar";
import moment from "moment";
import menuData from "../global/quickMenuData";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableRipple } from "react-native-paper";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import createAnimation from "../utils/createAnimation";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const statusBarHeight =
  Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;
export default function HomeScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadText, setLoadText] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");

  const animatedValue1 = new Animated.Value(0);
  const animatedValue2 = new Animated.Value(0.1);
  const animatedValue3 = new Animated.Value(30);

  const isFocused = useIsFocused();

  useEffect(() => {
    Toast.hide();
    getData();
    animatedValue1.setValue(0);
    animatedValue2.setValue(1);
    animatedValue3.setValue(30);
  }, []);

  useEffect(() => {
    isFocused &&
      route.params.previous_screen != "HomeScreen" &&
      route.params.previous_screen != undefined &&
      animate();
  }, [route]);

  // const responseList = (input) => {
  //   fetch("https://c4k60.com/api/getNotification.php", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ input: input }),
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.setState({
  //         notifications: responseJson.results,
  //         notiCount: responseJson.total,
  //         otherNotifications: responseJson.otherNotifications,
  //         hideMore: responseJson.hideMore,
  //       });
  //       this.setData();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // getBirthday(input) {
  //   fetch("https://c4k60.com/api/getBirthday.php", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ input: input }),
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.setState({
  //         birthday: responseJson,
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  const getData = async () => {
    const name = await AsyncStorage.getItem("name");
    const username = await AsyncStorage.getItem("username");
    if (name !== null && username !== null) {
      setName(name);
      setUsername(username);
    }
  };

  const getGreetingTime = (m) => {
    var g = null; //return g

    if (!m || !m.isValid()) {
      return;
    } //if we can't find a valid or filled moment, we return.

    var split_afternoon = 12; //24hr time to split the afternoon
    var split_evening = 17; //24hr time to split the evening
    var currentHour = parseFloat(m.format("HH"));

    if (currentHour >= split_afternoon && currentHour <= split_evening) {
      g = "buổi chiều";
    } else if (currentHour >= split_evening) {
      g = "buổi tối";
    } else {
      g = "buổi sáng";
    }

    return g;
  };

  const animate = () => {
    animatedValue1.setValue(-150);
    animatedValue2.setValue(0.1);
    animatedValue3.setValue(0);

    Animated.parallel([
      createAnimation(animatedValue1, 150, Easing.inout, null, 0),
      createAnimation(animatedValue2, 200, Easing.inout, null, 1),
      createAnimation(animatedValue3, 150, Easing.inout, null, 30),
    ]).start();
  };

  return (
    <>
      <View
        style={{
          position: "relative",
        }}
      >
        <View style={{ position: "absolute", width: "100%", height: 100 }}>
          <ImageBackground
            source={require("../assets/headerBg.png")}
            style={{
              width: "100%",
              height: 45,
              zIndex: -1,
            }}
          >
            <Animated.View
              style={{
                backgroundColor: "#F2F2F2",
                height: 50,
                borderTopLeftRadius: animatedValue3,
                borderTopRightRadius: animatedValue3,
              }}
            ></Animated.View>
          </ImageBackground>
        </View>
        <Animated.ScrollView
          style={{
            zIndex: 1,
            height: "100%",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            transform: [{ translateX: animatedValue1 }],
            opacity: animatedValue2,
          }}
          refreshControl={
            <RefreshControl
              title={loadText}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                setLoadText("Đang tải...");
                setTimeout(() => {
                  setRefreshing(false);
                  setLoadText("Kéo để tải lại...");
                }, 800);
              }}
            />
          }
        >
          <View>
            <HomeScreenCarousel />
          </View>
          <View
            style={{
              backgroundColor: "white",
            }}
          >
            <TouchableRipple
              rippleColor="rgba(0, 0, 0, .2)"
              onPress={() => {
                null;
              }}
            >
              <View
                style={{
                  height: 100,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 14,
                }}
              >
                <View>
                  <UserAvatar
                    username={username}
                    style={{ height: 50, width: 50, borderRadius: 100 }}
                  />
                </View>
                <View style={{ marginLeft: 17 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: "700",
                      width: screenWidth - 115,
                      marginBottom: 3,
                    }}
                  >
                    Chào {getGreetingTime(moment())}, {name}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      width: screenWidth - 115,
                    }}
                  >
                    Mỗi ngày mới là một cơ hội để thay đổi bản thân bạn.
                  </Text>
                </View>
                <View
                  style={{
                    // align item right
                    flex: 1,
                    alignItems: "flex-end",
                    marginRight: -10,
                  }}
                >
                  <Ionicons name="chevron-forward-outline" size={30} />
                </View>
              </View>
            </TouchableRipple>
          </View>
          <View
            style={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            {menuData.map((item, index) => {
              return (
                <TouchableRipple
                  key={index}
                  rippleColor="rgba(0, 0, 0, .2)"
                  onPress={() => {
                    // this.props.navigation.navigate(item.route);
                    navigation.navigate(item.route);
                  }}
                  style={{
                    width: screenWidth / 3,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: 14,
                      width: "100%",
                      paddingTop: index < 3 ? 25 : 15,
                      paddingBottom: index > 2 ? 25 : 15,
                    }}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      colors={item.bgColor}
                      style={styles.linearGradient}
                    >
                      <Ionicons
                        name={item.iconName}
                        size={30}
                        color={"white"}
                        style={
                          item.iconName == "gift"
                            ? { transform: [{ translateX: 1 }] }
                            : null
                        }
                      />
                    </LinearGradient>
                    <Text
                      style={{
                        fontSize: 12,
                        width: 130,
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                </TouchableRipple>
              );
            })}
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 18,
    padding: 10,
    width: 50,
    height: 53,
  },
});
