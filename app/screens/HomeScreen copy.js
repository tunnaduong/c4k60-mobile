import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  LogBox,
  ImageBackground,
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
            headerTitleAlign: "left",
            headerBackground: () => (
              <ImageBackground
                style={StyleSheet.absoluteFill}
                source={require("../assets/headerBg.png")}
              />
            ),
            headerShown: true,
            headerBackButtonMenuEnabled: false,
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
            ),
            headerBackVisible: false,
            headerTitle: (
              props // App Logo
            ) => <React.Fragment></React.Fragment>,
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
    };
    Toast.hide();
    this.responseList();
    this.getBirthday("show_recents");
  }

  responseList(input) {
    fetch("https://c4k60.tunnaduong.com/api/getNotification.php", {
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
    fetch("https://c4k60.tunnaduong.com/api/getBirthday.php", {
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

  footer = () => {
    if (this.state.otherNotifications !== 0) {
      if (!this.state.hideMore) {
        return (
          <>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <TouchableOpacity onPress={() => this.responseList("show_more")}>
                <Text style={{ fontSize: 16 }}>
                  Hiện {this.state.otherNotifications} thông báo khác...
                </Text>
              </TouchableOpacity>
            </View>
            {this.footerBelow()}
          </>
        );
      } else {
        return (
          <>
            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <TouchableOpacity onPress={() => this.responseList()}>
                <Text style={{ fontSize: 16 }}>Ẩn bớt thông báo</Text>
              </TouchableOpacity>
            </View>
            {this.footerBelow()}
          </>
        );
      }
    } else {
      return (
        <>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <TouchableOpacity>
              <Text style={{ fontSize: 18 }}>
                Không có thông báo nào... Có thể do ứng dụng đang lấy dữ liệu từ
                máy chủ hoặc kết nối mạng bị mất.
              </Text>
            </TouchableOpacity>
          </View>
          {this.footerBelow()}
        </>
      );
    }
  };

  footerBelow = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <FontAwesomeIcon
            icon={faBirthdayCake}
            size={28}
            style={{ left: 3 }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}>
            Sinh nhật sắp tới
          </Text>
        </View>
        <FlatList
          data={this.state.birthday}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 5, marginLeft: 10, marginRight: 10 }}>
              {this.sinhNhat(item.daysleft, item.name, item.gender)}
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
      </>
    );
  };

  sinhNhat = (daysleft, name, gender) => {
    if (daysleft > 0) {
      return (
        <Text style={{ fontSize: 16 }}>
          {daysleft} ngày nữa là sinh nhật {name}
        </Text>
      );
    } else {
      if (gender === "female") {
        return (
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            🎉 Hôm nay là sinh nhật của {name}. Hãy gửi lời chúc mừng sinh nhật
            đến cô ấy! 💕🙆‍♀️
          </Text>
        );
      } else {
        return (
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            🎉 Hôm nay là sinh nhật của {name}. Hãy gửi lời chúc mừng sinh nhật
            đến anh ấy! 💕🙆‍♂️
          </Text>
        );
      }
    }
  };

  render() {
    return (
      <>
        <FlatList
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
          ListHeaderComponent={
            <>
              <View
                style={{
                  backgroundColor: "#F2F2F2",
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                }}
              >
                <HomeScreenCarousel />
                <View style={styles.wrapper}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      style={{ left: -3 }}
                      name={"help-circle"}
                      size={35}
                      color={"black"}
                    />
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                      Đây là gì?
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16 }}>
                    Ứng dụng điện thoại di động này là công cụ để tra cứu thông
                    tin và giữ liên lạc với các thành viên của lớp chuyên Nga
                    khóa 60 THPT Chuyên Hà Nam
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 15,
                      marginBottom: 5,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBullhorn}
                      size={28}
                      style={{ left: 3 }}
                    />
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        marginLeft: 10,
                      }}
                    >
                      Thông báo lớp
                    </Text>
                  </View>
                </View>
              </View>
            </>
          }
          data={this.state.notifications}
          renderItem={({ item }) => (
            <View style={styles.flatlistwrapper}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("NotiScreen", {
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
                  style={{ color: "#007AFF", fontSize: 18, fontWeight: "bold" }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={this.footer}
        />
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
