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
  FlatList,
  SafeAreaView,
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
import axios from "axios";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const statusBarHeight =
  Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;
export default function HomeScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadText, setLoadText] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [notificationData, setNotificationData] = React.useState([]);
  const [birthdayData, setBirthdayData] = React.useState([]);

  const animatedValue1 = new Animated.Value(0);
  const animatedValue2 = new Animated.Value(0.1);
  const animatedValue3 = new Animated.Value(30);

  const isFocused = useIsFocused();
  const prevScreen = route.params.previous_screen;

  React.useLayoutEffect(() => {
    animatedValue1.setValue(0);
    animatedValue2.setValue(1);
    animatedValue3.setValue(30);
    Toast.hide();
  }, [animatedValue3]);

  useEffect(() => {
    refreshHandler();
  }, []);

  useEffect(() => {
    clearInterval(inter);

    const inter = setInterval(() => {
      refreshHandler();
      console.log("ref" + Math.random());
    }, 200);

    if (name == "" || username == "") {
      inter;
      console.log("exec ted if");
      setTimeout(() => {
        clearInterval(inter);
      }, 600);
    } else {
      clearInterval(inter);
      console.log("exec ted else");
    }
  }, [navigation, name, username]);

  useEffect(() => {
    isFocused &&
      prevScreen != "HomeScreen" &&
      prevScreen != undefined &&
      animate();
  }, [route]);

  const refreshHandler = () => {
    getGreetingTime();
    getData();
    getNotification();
    getBirthday();
  };

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
    try {
      animatedValue1.setValue(-150);
      animatedValue2.setValue(0.1);
      animatedValue3.setValue(0);
    } finally {
      Animated.parallel([
        createAnimation(animatedValue1, 150, Easing.inout, null, 0),
        createAnimation(animatedValue2, 200, Easing.inout, null, 1),
        createAnimation(animatedValue3, 150, Easing.inout, null, 30),
      ]).start();
    }
  };

  const getNotification = async (input) => {
    const response = await axios.get(
      "https://api.c4k60.com/v1.0/notification/list?show=" + input
    );
    setNotificationData(response.data);
  };

  const getBirthday = async () => {
    const response = await axios.get(
      "https://api.c4k60.com/v1.0/users/birthday"
    );
    setBirthdayData(response.data);
  };

  return (
    <>
      <View
        style={{
          position: "relative",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            width: "100%",
            height: 100,
            opacity: animatedValue2,
          }}
        >
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
        </Animated.View>
        <Animated.ScrollView
          contentContainerStyle={{ paddingBottom: 95 }}
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
                refreshHandler();
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
            className="shadow-sm"
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
            className="shadow-sm"
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
          <View className="mt-4 bg-white flex-1 p-5  shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Text className="font-medium text-xl">Thông báo lớp</Text>
                <View className="bg-red-400 h-5 p-1 rounded-full ml-2 justify-center items-center">
                  <Text className="text-[10px] text-white font-bold">
                    1 mới
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Notifications", {
                    previous_screen: "HomeScreen",
                    currentScreen: "NotiScreen",
                  });
                }}
              >
                <View className="flex-row items-center">
                  <Text className="text-gray-500">Xem tất cả</Text>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={18}
                    color={"gray"}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* render notifications */}
            {notificationData.results?.map((item, index) => (
              <View key={index}>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 w-[75px]">
                    {moment(item.date).format("L")}
                  </Text>
                  <TouchableOpacity className="py-[3px]">
                    <Text className="text-blue-500 text-[16px] ml-1">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <View className="mt-4 bg-white flex-1 p-5 shadow-sm">
            <View className="flex-row items-center mb-2 justify-between">
              <Text className="font-medium text-xl">Sinh nhật sắp tới</Text>
              <TouchableOpacity>
                <View className="flex-row items-center">
                  <Text className="text-gray-500">Xem tất cả</Text>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={18}
                    color={"gray"}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* render birthdays */}
            {birthdayData?.map((item, index) =>
              item.daysleft == 0 ? (
                <View key={index}>
                  <Text className="font-bold text-[14.3px] text-justify leading-5">
                    🎉 Hôm nay là sinh nhật của {item.name}. Đừng quên gửi lời
                    chúc mừng sinh nhật tới{" "}
                    {item.gender == "male" ? "anh ấy!" : "cô ấy!"}
                  </Text>
                </View>
              ) : (
                <View key={index} className="mt-1">
                  <Text
                    className={`text-[14px]`}
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                  >
                    {item.daysleft} ngày nữa sinh nhật {item.name} (
                    {/* splice /2003 from str */}
                    {item.birthday.slice(0, -5)})
                  </Text>
                </View>
              )
            )}
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
