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
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-tiny-toast";
import HomeScreenCarousel from "../components/HomeScreenCarousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-status-bar-height";
import UserAvatar from "../components/UserAvatar";
import moment from "moment";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const statusBarHeight =
  Platform.OS == "ios" ? getStatusBarHeight() : StatusBar.currentHeight || 0;
export default class HomeScreen extends Component {
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
      shit: 0,
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
              <HomeScreenCarousel style={{ marginTop: 15 }} />
            </View>
            <TouchableHighlight
              underlayColor="rgba(0, 0, 0, .6)"
              onPress={() => null}
            >
              <View
                style={{
                  backgroundColor: "white",
                  height: 100,
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
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight: "600",
                      width: screenWidth - 115,
                      marginBottom: 3,
                    }}
                  >
                    Chào {this.getGreetingTime(moment())}, {this.state.name}
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
            </TouchableHighlight>
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
