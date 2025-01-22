import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
  Image,
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeScreenCarousel from "../components/HomeScreenCarousel";
import { storage } from "../global/storage";
import UserAvatar from "../components/UserAvatar";
import moment from "moment";
import menuData from "../global/quickMenuData";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableRipple } from "react-native-paper";
import { useEffect } from "react";
import axios from "axios";
import updateLastActivity from "../utils/updateLastActivity";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const screenWidth = Dimensions.get("window").width;
// const screenHeight = Dimensions.get("window").height;

// const statusBarHeight =
//   Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;
export default function HomeScreen({ navigation, route }) {
  const ws = route.params.ws;
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadText, setLoadText] = React.useState("");
  const [notificationData, setNotificationData] = React.useState([]);
  const [birthdayData, setBirthdayData] = React.useState([]);
  const [loiChucData, setLoiChucData] = React.useState("");
  const [sponsors, setSponsors] = React.useState(null);
  const [changelog, setChangelog] = React.useState(null);
  const isFirstTimeUse = storage.getBoolean("isFirstTimeUse");

  useEffect(() => {
    if (!isFirstTimeUse && username != "test") {
      navigation.navigate("AvatarEditScreen");
      navigation.navigate("ChangePassword");
    }

    loiChuc();
    console.log("Registering for push notifications...");
    if (Device.isDevice) {
      registerForPushNotificationsAsync()
        .then((token) => {
          console.log("token: ", token);
          if (token == undefined) {
            return;
          }
          // set expo push token to storage mmkv
          storage.set("expoPushToken", token);
          updatePushNotificationToken(token);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { username, user_from, name } =
          response.notification.request.content.data;

        // Navigate to a specific screen using the username
        navigation.navigate("ChatRoom", {
          ws: ws,
          user_from: user_from,
          username: username,
          name: name,
          type: "private",
        });
      }
    );

    return () => subscription.remove();
  }, []);

  async function updatePushNotificationToken(token) {
    try {
      const usrname = storage.getString("username");
      const response = await axios.post(
        "https://api.c4k60.com/v2.0/notification/token",
        {
          username: usrname,
          token: token,
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(("Error in updatePushNotificationToken: ", error));
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        // alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "9b22d593-3b19-4bb5-b393-a3a92e28aa21",
        })
      ).data;
      console.log(token);
    } else {
      // alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const name = storage.getString("name");
  const username = storage.getString("username");

  useEffect(() => {
    refreshHandler();
    updateLastActivity(username);
  }, []);

  const refreshHandler = () => {
    getGreetingTime();
    getNotification();
    getBirthday();
    updateLastActivity(username);
    getSponsors();
    getChangelog();
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

  const loiChuc = () => {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if ((hours >= 5 && hours < 10) || (hours === 10 && minutes < 30)) {
      setLoiChucData("Chúc bạn có một ngày mới năng động và hiệu quả.");
    } else if ((hours >= 11 && hours < 13) || (hours == 10 && minutes >= 30)) {
      setLoiChucData(
        "Chúc bạn có một buổi trưa thật vui vẻ, ngập tràn năng lượng."
      );
    } else if ((hours >= 13 && hours < 18) || (hours === 18 && minutes < 30)) {
      setLoiChucData("Chúc bạn có một buổi chiều vui vẻ và cả ngày hạnh phúc!");
    } else if ((hours >= 18 && hours < 22) || (hours === 22 && minutes < 30)) {
      setLoiChucData(
        "Chúc cậu có một buổi tối an lành, vui vẻ nhé. Good night!"
      );
    } else {
      setLoiChucData(
        "Nằm xuống giường đi và mơ những giấc mơ ngọt ngào nhất bạn nhé!"
      );
    }
  };

  const getNotification = async (input) => {
    const response = await axios.get(
      "https://api.c4k60.com/v2.0/notification/list?show=" + input
    );
    setNotificationData(response.data);
  };

  const getBirthday = async () => {
    const response = await axios.get(
      "https://api.c4k60.com/v2.0/users/birthday"
    );
    setBirthdayData(response.data);
  };

  const getSponsors = async () => {
    try {
      const response = await axios.get("https://api.c4k60.com/v2.0/sponsors");
      setSponsors(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const getChangelog = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/changelogs/latest"
      );
      setChangelog(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
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
                if (storage.getString("username") == "test") {
                  return navigation.navigate("Login");
                }
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
                  {storage.getString("username") == "test" ? (
                    <Image
                      source={require("../assets/user.png")}
                      style={{ height: 50, width: 50, borderRadius: 100 }}
                    ></Image>
                  ) : (
                    <UserAvatar
                      username={username}
                      style={{ height: 50, width: 50, borderRadius: 100 }}
                    />
                  )}
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
                    {storage.getString("username") == "test"
                      ? "Bạn chưa đăng nhập"
                      : "Chào " + getGreetingTime(moment()) + ", " + name}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      width: screenWidth - 115,
                    }}
                  >
                    {storage.getString("username") == "test"
                      ? "Hãy đăng nhập để trải nghiệm đầy đủ các tính năng tuyệt vời của ứng dụng."
                      : loiChucData}
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
                    if (item.guestEnabled == false) {
                      if (storage.getString("username") == "test") {
                        return Alert.alert(
                          "Chức năng này không khả dụng trong chế độ xem trước."
                        );
                      }
                    }
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
                          if (storage.getString("username") == "test") {
                            return Alert.alert(
                              "Chức năng này không khả dụng trong chế độ xem trước."
                            );
                          }
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
              <TouchableOpacity onPress={() => navigation.navigate("Sponsors")}>
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
              {sponsors == null ? (
                <>
                  <Image
                    source={require("../assets/loading.gif")}
                    className="h-5 w-16 scale-75 -ml-1.5"
                  />
                </>
              ) : (
                sponsors.map((item, index) => (
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
                          disabled={!item.social_link}
                          onPress={() => {
                            Linking.openURL(item.social_link);
                          }}
                        >
                          <Text
                            className={`text-sm ${
                              item.social_link && "text-blue-500"
                            }`}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                        <Text className="text-sm"> - {item.amount}</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
          <View className="mt-4 bg-white flex-1 p-5 shadow-sm">
            <View className="flex-row items-center mb-2 justify-between">
              <Text className="font-medium text-xl">Những thay đổi</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Changelogs")}
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
            <View className="mr-3">
              {/* render changes */}
              {changelog == null ? (
                <>
                  <Image
                    source={require("../assets/loading.gif")}
                    className="h-5 w-16 scale-75 -ml-1.5"
                  />
                </>
              ) : (
                <>
                  <Text className="text-[16px]">
                    Phiên bản {changelog.version}
                  </Text>
                  <Text className="font-light text-[14px] mt-1">
                    Ngày phát hành:{" "}
                    {moment(changelog.release_date).format("DD/MM/YYYY")}
                  </Text>
                  {changelog.changelogs.split("\n").map((line, index) => (
                    <View className="mt-2.5" key={index}>
                      <View className="pl-2 text-base flex-row">
                        <Text className="text-[30px] leading-6">· </Text>
                        <Text className="items-center">{line}</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
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
