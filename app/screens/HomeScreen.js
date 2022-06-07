import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  LogBox,
  ImageBackground,
  SafeAreaView,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsfeedScreen from "./NewsfeedScreen";
import MenuScreen from "./MenuScreen";
import ChatScreen from "./ChatScreen";
import NotificationScreen from "./NotificationScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-tiny-toast";
import HomeScreenCarousel from "./HomeScreenCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBirthdayCake, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-status-bar-height";
import UserAvatar from "./UserAvatar";
import moment from "moment";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const statusBarHeight =
  Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;

const Tab = createBottomTabNavigator();

export default class MyTabs extends Component {
  constructor() {
    super();
    this.state = {
      noticount: 0,
    };
  }
  getData = async () => {
    try {
      const count = await AsyncStorage.getItem("noticount");
      if (count !== null) {
        // value previously stored
        this.setState({ noticount: count });
      }
    } catch (e) {
      // error reading value
    }
  };
  render() {
    this.getData();
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Newsfeed") {
              iconName = focused ? "newspaper" : "newspaper-outline";
            } else if (route.name === "Chat") {
              iconName = focused ? "chatbubble" : "chatbubble-outline";
            } else if (route.name === "Notifications") {
              iconName = focused ? "notifications" : "notifications-outline";
            } else if (route.name === "Menu") {
              iconName = focused ? "menu" : "menu-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: () => {
              return null;
            },
            headerShown: false,
            headerBackButtonMenuEnabled: false,
          }}
        />
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedScreen}
          options={{
            headerLeft: () => (
              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 10,
                  }}
                >
                  <Image
                    style={{ width: 100, height: 35 }}
                    source={require("../assets/logo.png")}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity>
                <View
                  style={{
                    marginRight: 13,
                    backgroundColor: "rgba(0,0,0,0.10)",
                    padding: 5,
                    paddingLeft: 6,
                    paddingRight: 6,
                    borderRadius: 100,
                    marginBottom: 5,
                  }}
                >
                  <Ionicons name="search" size={23} color={"black"} />
                </View>
              </TouchableOpacity>
            ),
            title: () => {
              return null;
            },
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: () => {
              return null;
            },
            headerShown: true,
            headerTitleAlign: "left",
            headerRight: () => (
              <TouchableOpacity>
                <View
                  style={{
                    marginRight: 13,
                    backgroundColor: "rgba(0,0,0,0.10)",
                    padding: 5,
                    paddingLeft: 6,
                    paddingRight: 6,
                    borderRadius: 100,
                    marginBottom: 5,
                  }}
                >
                  <Ionicons name="create-outline" size={23} color={"black"} />
                </View>
              </TouchableOpacity>
            ),
            headerStyle: {
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTitle: (
              props // App Logo
            ) => (
              <React.Fragment>
                <View style={{ justifyContent: "flex-start" }}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Chat
                  </Text>
                </View>
              </React.Fragment>
            ),
            tabBarBadge: 1,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{
            title: () => {
              return null;
            },
            headerShown: true,
            headerTitleAlign: "left",
            headerRight: () => (
              <TouchableOpacity>
                <View
                  style={{
                    marginRight: 13,
                    backgroundColor: "rgba(0,0,0,0.10)",
                    padding: 5,
                    paddingLeft: 6,
                    paddingRight: 6,
                    borderRadius: 100,
                    marginBottom: 5,
                  }}
                >
                  <Ionicons name="search" size={23} color={"black"} />
                </View>
              </TouchableOpacity>
            ),
            headerStyle: {
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTitle: (
              props // App Logo
            ) => (
              <React.Fragment>
                <View style={{ justifyContent: "flex-start" }}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Thông báo
                  </Text>
                </View>
              </React.Fragment>
            ),
            tabBarBadge: this.state.noticount,
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            title: () => {
              return null;
            },
            headerShown: true,
            headerTitleAlign: "left",
            headerRight: () => (
              <TouchableOpacity>
                <View
                  style={{
                    marginRight: 13,
                    backgroundColor: "rgba(0,0,0,0.10)",
                    padding: 5,
                    paddingLeft: 6,
                    paddingRight: 6,
                    borderRadius: 100,
                    marginBottom: 5,
                  }}
                >
                  <Ionicons name="search" size={23} color={"black"} />
                </View>
              </TouchableOpacity>
            ),
            headerStyle: {
              shadowColor: "transparent",
              borderBottomWidth: 0,
            },
            headerTitle: (
              props // App Logo
            ) => (
              <React.Fragment>
                <View style={{ justifyContent: "flex-start" }}>
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    Menu
                  </Text>
                </View>
              </React.Fragment>
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

LogBox.ignoreLogs([
  "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.",
]);

LogBox.ignoreLogs([
  "Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.",
]);

export class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      notifications: "",
      refreshing: false,
      notiCount: 0,
      otherNotifications: 0,
      loadText: "Kéo để tải lại...",
      hideMore: false,
      birthday: "",
      name: "",
      username: "",
    };
    Toast.hide();
    this.responseList();
    this.getBirthday("show_recents");
    this.getData();
  }

  responseList(input) {
    fetch("https://c4k60.com/api/getNotification.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          notifications: responseJson.results,
          notiCount: responseJson.total,
          otherNotifications: responseJson.otherNotifications,
          hideMore: responseJson.hideMore,
        });
        this.setData();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getBirthday(input) {
    fetch("https://c4k60.com/api/getBirthday.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          birthday: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setData = async () => {
    await AsyncStorage.setItem("noticount", this.state.notiCount);
  };

  getData = async () => {
    const name = await AsyncStorage.getItem("name");
    const username = await AsyncStorage.getItem("username");
    if (name !== null && username !== null) {
      this.setState({ name: name, username: username });
    }
  };

  getGreetingTime = (m) => {
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

  render() {
    return (
      <>
        <View style={{ position: "relative" }}>
          <View style={{ position: "absolute", width: "100%", height: 100 }}>
            <ImageBackground
              source={require("../assets/headerBg.png")}
              style={{ width: "100%", height: statusBarHeight + 45 }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: statusBarHeight + 3,
                }}
              >
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <Image
                      style={{ width: 100, height: 35 }}
                      source={require("../assets/logo.png")}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View
                    style={{
                      marginRight: 13,
                      backgroundColor: "rgba(255,255,255,0.20)",
                      padding: 5,
                      paddingLeft: 6,
                      paddingRight: 6,
                      borderRadius: 100,
                      marginBottom: 5,
                    }}
                  >
                    <Ionicons name="search" size={23} color={"white"} />
                  </View>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <ImageBackground
              source={require("../assets/headerBg.png")}
              style={{ width: "100%", height: 50, zIndex: -1 }}
            >
              <View
                style={{
                  backgroundColor: "#F2F2F2",
                  height: 50,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                }}
              ></View>
            </ImageBackground>
          </View>
          <ScrollView
            style={{
              position: "relative",
              zIndex: 1,
              top: statusBarHeight + 45,
              height: "90%",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
            refreshControl={
              <RefreshControl
                title={this.state.loadText}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true, loadText: "Đang tải..." });
                  setTimeout(() => {
                    this.responseList();
                    this.getBirthday("show_recents");
                    this.setState({
                      refreshing: false,
                      loadText: "Kéo để tải lại...",
                    });
                  }, 800);
                }}
              />
            }
          >
            <View>
              <HomeScreenCarousel style={{ position: "relative" }} />
            </View>
            <View
              style={{
                backgroundColor: "white",
                height: 100,
                marginTop: 25,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: 14,
              }}
            >
              <View>
                <UserAvatar
                  username={this.state.username}
                  style={{ height: 50, width: 50, borderRadius: 100 }}
                />
              </View>
              <View style={{ marginLeft: 17 }}>
                <Text style={{ fontWeight: "600" }}>
                  Chào {this.getGreetingTime(moment())}, {this.state.name}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  wrapper: {
    marginTop: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  flatlistwrapper: {
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 5,
  },
});
