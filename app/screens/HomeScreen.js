import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
  Image,
  StatusBar,
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeScreenCarousel from "../components/HomeScreenCarousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-status-bar-height";
import UserAvatar from "../components/UserAvatar";
import moment from "moment";
import menuData from "../global/quickMenuData";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableRipple } from "react-native-paper";
import { useEffect } from "react";
import axios from "axios";
import sponsorsData from "../global/sponsorsData";

const screenWidth = Dimensions.get("window").width;
// const screenHeight = Dimensions.get("window").height;

// const statusBarHeight =
//   Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;
export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadText, setLoadText] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [notificationData, setNotificationData] = React.useState([]);
  const [birthdayData, setBirthdayData] = React.useState([]);

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

    return () => {
      clearInterval(inter);
    };
  }, [navigation, name, username]);

  const refreshHandler = () => {
    getGreetingTime();
    getData();
    getNotification();
    getBirthday();
  };

  const getData = async () => {
    const name = await AsyncStorage.getItem("name");
    const username = await AsyncStorage.getItem("username");
    console.log("okayyy", name, username);
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

  // const animate = () => {
  //   try {
  //     animatedValue1.setValue(-150);
  //     // animatedValue2.setValue(0.1);
  //     animatedValue3.setValue(0);
  //   } finally {
  //     parallel([
  //       createAnimation(animatedValue1, 150, Easing.inout, null, 0),
  //       // createAnimation(animatedValue2, 200, Easing.inout, null, 1),
  //       createAnimation(animatedValue3, 150, Easing.inout, null, 30),
  //     ]).start();
  //   }
  // };

  const getNotification = async (input) => {
    const response = await axios.get(
      "https://c4k60.tunnaduong.com/api/v1.0/notification/list?show=" + input
    );
    setNotificationData(response.data);
  };

  const getBirthday = async () => {
    const response = await axios.get(
      "https://c4k60.tunnaduong.com/api/v1.0/users/birthday"
    );
    setBirthdayData(response.data);
  };

  return (
    <SafeAreaView>
      <View
        style={{
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: 100,
            // opacity: animatedValue2,
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
            <View
              style={{
                backgroundColor: "#F2F2F2",
                height: 50,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                elevation: 10,
                zIndex: 99,
              }}
            ></View>
          </ImageBackground>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 95 }}
          style={{
            zIndex: 1,
            height: "100%",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // transform: [{ translateX: animatedValue1 }],
            // opacity: animatedValue2,
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
                navigation.navigate("ProfileDetail", {
                  name: name,
                  username: username,
                  editable: true,
                });
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
                  navigation.navigate("Notifications");
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
            {notificationData == "" && (
              <>
                <Image
                  source={require("../assets/loading.gif")}
                  className="h-5 w-16 scale-75 -ml-1.5"
                />
              </>
            )}
            <View className="flex-row">
              <View className="w-0.5 bg-gray-200 h-[3px] absolute left-0 -bottom-4 rounded-sm"></View>
              <View className="w-0.5 bg-gray-300 h-1.5 absolute left-0 -bottom-2 rounded-sm"></View>
              <View className="w-0.5 bg-gray-400 mr-2.5 mt-2.5 mb-0.5 rounded-sm"></View>
              <View>
                {notificationData.results?.map((item, index) => (
                  <View key={index} className="flex-row">
                    <View className="w-1.5 h-1.5 bg-gray-400 rounded-full absolute my-2.5 -mx-3.5"></View>
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 w-[72px] text-xs">
                        {moment(item.date).format("L")}
                      </Text>
                      <TouchableOpacity
                        className="py-[3px]"
                        onPress={() => {
                          navigation.navigate("NotiScreen", {
                            id: item.id,
                            title: item.title,
                            content: item.content,
                            date: item.date,
                            by: item.createdBy,
                            image: item.image,
                          });
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          lineBreakMode={"tail"}
                          className="text-blue-500 relative text-[16px] truncate ml-1"
                          style={{ width: screenWidth - 120 }}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View className="mt-4 bg-white flex-1 p-5 shadow-sm">
            <View className="flex-row items-center mb-2 justify-between">
              <Text className="font-medium text-xl">Sinh nhật sắp tới</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("IncomingBirthday")}
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
            {/* render birthdays */}
            {birthdayData == "" && (
              <>
                <Image
                  source={require("../assets/loading.gif")}
                  className="h-5 w-16 scale-75 -ml-1.5"
                />
              </>
            )}
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
          <View className="mt-4 bg-white flex-1 p-5 shadow-sm">
            <View className="flex-row items-center mb-2 justify-between">
              <Text className="font-medium text-xl">Nhà tài trợ</Text>
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
            <View>
              {/* render sponsors */}
              <Text className="mb-3">
                C4K60 Web và C4K60 Mobile có thể đã không được tồn tại mà không
                có sự hỗ trợ từ các mạnh thường quân sau:
              </Text>
              {sponsorsData == "" && (
                <>
                  <Image
                    source={require("../assets/loading.gif")}
                    className="h-5 w-16 scale-75 -ml-1.5"
                  />
                </>
              )}
              {sponsorsData?.sponsors.map((item, index) => (
                <View key={index}>
                  <View className="pl-2 text-base flex-row items-center">
                    <Text
                      className="text-[30px] leading-6"
                      style={{ transform: [{ translateY: 2 }] }}
                    >
                      ·
                    </Text>
                    <View className="flex-row">
                      <Text className="text-base"> </Text>
                      <TouchableOpacity
                        disabled={!item.link}
                        onPress={() => {
                          Linking.openURL(item.link);
                        }}
                      >
                        <Text
                          className={`text-sm ${item.link && "text-blue-500"}`}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-sm"> - {item.donated}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className="mt-4 bg-white flex-1 p-5 shadow-sm">
            <View className="flex-row items-center mb-2 justify-between">
              <Text className="font-medium text-xl">Những thay đổi</Text>
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
            <View>
              {/* render changes */}
              <Text className="text-[16px]">Phiên bản 4.0</Text>
              <Text className="font-light text-[14px] mt-1">
                Ngày phát hành: 03/09/2022
              </Text>
              <View className="mt-2.5">
                <View className="pl-2 text-base flex-row">
                  <Text className="text-[30px] leading-6">· </Text>
                  <Text className="items-center">
                    Ra mắt phiên bản di động của C4K60.
                  </Text>
                </View>
                <View className="pl-2 text-base flex-row">
                  <Text className="text-[30px] leading-6">· </Text>
                  <Text className="items-center">
                    Ra mắt phiên bản web hoàn toàn mới của C4K60.
                  </Text>
                </View>
                <View className="pl-2 text-base flex-row">
                  <Text className="text-[30px] leading-6">· </Text>
                  <Text className="items-center">
                    Cải thiện hiệu suất ứng dụng...
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
