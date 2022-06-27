import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  LogBox,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB, List, Modal, Portal, Provider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import CommentChat from "./app/components/CommentChat";
import UserAvatar from "./app/components/UserAvatar";
import UserFullName from "./app/components/UserFullName";
import config from "./app/configurations/config";
import ChatScreen from "./app/screens/ChatScreen";
import HomeScreen from "./app/screens/HomeScreen";
import LoadingScreen from "./app/screens/LoadingScreen";
import LoginScreen from "./app/screens/LoginScreen";
import MenuScreen from "./app/screens/MenuScreen";
import MusicScreen from "./app/screens/MusicScreen";
import NewsfeedScreen from "./app/screens/NewsfeedScreen";
import NotificationScreen from "./app/screens/NotificationScreen";
import NotiScreen from "./app/screens/NotiScreen";
import SignupScreen from "./app/screens/SignupScreen";
import Test from "./app/screens/Test";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import Logger from "./app/utils/logger";

const Tab = createMaterialTopTabNavigator();
const baseBackendServerURL =
  config.baseBackendServerURL + ":" + config.backendServerPort;

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  "JSON Parse error: Unrecognized token '<'",
]);

LogBox.ignoreLogs([
  "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.%s a useEffect cleanup function",
]);

const Stack = createNativeStackNavigator();

function App() {
  const [usrname, setUsername] = React.useState("");

  const getData = async () => {
    const username = await AsyncStorage.getItem("username");
    if (username !== null) {
      setUsername(username);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const inputText = React.createRef();

  const TestingComponent = () => <Text>Tung Anh</Text>;

  const Music = (props) => {
    const [data, setData] = React.useState("");
    // const [torf, setTrueOrFalse] = React.useState(false);

    const ChatComponent = () => {
      const [chatData, setChatData] = React.useState([]);
      const [refreshing, setRefreshing] = React.useState(false);

      useEffect(() => {
        getChatLogs();
      }, []);

      const getChatLogs = async () => {
        const response = await axios.get(
          "https://api.c4k60.com/v1.0/radio/chatlogs"
        );
        setChatData(response.data.items);
        return response.data;
      };

      return (
        <>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={
              Platform.OS === "ios"
                ? Dimensions.get("screen").height > 667
                  ? 402
                  : 382
                : 0
            }
          >
            <ScrollView
              style={{ flex: 1, paddingTop: 10, paddingBottom: 10 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    getChatLogs().then(() => {
                      setTimeout(() => {
                        setRefreshing(false);
                      }, 750);
                    });
                  }}
                />
              }
            >
              {chatData.map((item) => {
                if (item.msg_type == "user_join") {
                  return (
                    <View
                      style={{
                        alignItems: "center",
                        marginTop: 10,
                        marginBottom: 10,
                      }}
                      key={item.id}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          padding: 6.5,
                          borderRadius: "50%",
                          overflow: "hidden",
                          borderWidth: 0.5,
                          borderStyle: "solid",
                          borderColor: "gray",
                          flexDirection: "row",
                        }}
                      >
                        <UserAvatar
                          username={item.thumbnail.split("user:")[1]}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            marginRight: 5,
                          }}
                        />
                        <Text
                          style={{
                            fontWeight: "500",
                            fontSize: 12,
                            alignSelf: "center",
                          }}
                        >
                          {item.msg}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "300",
                            fontSize: 12,
                            alignSelf: "center",
                          }}
                        >
                          {" "}
                          đã tham gia!
                        </Text>
                      </View>
                    </View>
                  );
                } else if (item.msg_type == "chat") {
                  return (
                    <TouchableHighlight
                      underlayColor="rgba(0, 0, 0, .15)"
                      key={item.id}
                      onPress={() => null}
                    >
                      <View
                        style={{
                          margin: 10,
                          flexDirection: "row",
                        }}
                      >
                        <UserAvatar
                          username={item.thumbnail.split("user:")[1]}
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 25,
                            marginRight: 10,
                            alignItems: "flex-start",
                          }}
                        />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row" }}>
                            <UserFullName
                              style={{
                                fontWeight: "700",
                                marginBottom: 3,
                              }}
                              username={item.created_by}
                            />

                            <Text
                              style={{
                                fontSize: 10,
                                lineHeight: 19,
                                color: "gray",
                              }}
                            >
                              {"  "}
                              {moment(item.time).calendar()}
                            </Text>
                          </View>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={{
                                flexWrap: "wrap",
                              }}
                            >
                              {item.msg}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                  );
                }
              })}
            </ScrollView>
            <CommentChat
              username={usrname}
              placeholderText={"Nhập tin nhắn..."}
              ref={inputText}
            />
          </KeyboardAvoidingView>
        </>
      );
    };

    const QueueComponent = () => {
      const [visible, setVisible] = React.useState(false);
      const [activeVideo, setActiveVideo] = React.useState(1);

      const showModal = (pos) => {
        setVisible(true);
        setActiveVideo(pos);
      };
      const hideModal = () => setVisible(false);

      return (
        <Provider>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={{
                backgroundColor: "white",
                padding: 20,
                marginRight: 30,
                marginLeft: 30,
                borderRadius: 10,
                alignSelf: "center",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#EDEDED",
                    padding: 8,
                    borderRadius: 30,
                    marginRight: 15,
                  }}
                >
                  <Ionicons
                    name="thumbs-up-outline"
                    size={30}
                    color={"#434343"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#EDEDED",
                    padding: 8,
                    borderRadius: 30,
                    marginRight: 15,
                  }}
                >
                  <Ionicons
                    name="thumbs-down-outline"
                    size={30}
                    color={"#434343"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#EDEDED",
                    padding: 8,
                    borderRadius: 30,
                  }}
                >
                  <Ionicons
                    name={
                      data.now_playing_position == activeVideo
                        ? "play-skip-forward-outline"
                        : "trash-outline"
                    }
                    size={30}
                    color={
                      data.now_playing_position == activeVideo
                        ? "#434343"
                        : "#F03232"
                    }
                  />
                </TouchableOpacity>
              </View>
            </Modal>
          </Portal>
          <KeyboardAvoidingView style={{ height: "100%" }}>
            <ScrollView style={{ height: "100%" }}>
              {Array.isArray(data.video_in_queue) ? (
                data.video_in_queue
                  .filter((ele) => ele.position >= data.now_playing_position)
                  .map((row, index) => {
                    if (index != 0) {
                      return (
                        <List.Item
                          title={row.video_title}
                          description={"Bởi: " + row.requested_by}
                          key={row.position}
                          onPress={() => showModal(row.position)}
                          left={() => {
                            return (
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "center",
                                    minWidth: 35,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#4E4E4E",
                                      marginRight: 10,
                                      textAlign: "right",
                                    }}
                                  >
                                    #{index}
                                  </Text>
                                </View>
                                <Image
                                  source={{ uri: row.video_thumbnail }}
                                  style={{ width: 70, height: 40 }}
                                />
                              </View>
                            );
                          }}
                          right={() => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                  marginRight: 10,
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                {data.now_playing_video_info.voting.like_count >
                                  0 && (
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Ionicons
                                      name="thumbs-up"
                                      size={18}
                                      color={"#434343"}
                                    />
                                    <Text style={{ marginLeft: 5 }}>
                                      {
                                        data.now_playing_video_info.voting
                                          .like_count
                                      }
                                    </Text>
                                  </View>
                                )}
                                {data.now_playing_video_info.voting.vote_skip >
                                  0 && (
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Ionicons
                                      name="play-skip-forward"
                                      size={18}
                                      color={"#434343"}
                                    />
                                    <Text style={{ marginLeft: 5 }}>
                                      {
                                        data.now_playing_video_info.voting
                                          .vote_skip
                                      }
                                    </Text>
                                  </View>
                                )}
                              </View>
                            );
                          }}
                        />
                      );
                    } else {
                      return (
                        <List.Item
                          title={row.video_title}
                          description={"Bởi: " + row.requested_by}
                          key={row.position}
                          onPress={() => showModal(row.position)}
                          left={() => {
                            return (
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    paddingRight: 8,
                                    minWidth: 35,
                                  }}
                                >
                                  <Ionicons
                                    name={"play"}
                                    size={18}
                                    color={"#4E4E4E"}
                                  />
                                </View>
                                <Image
                                  source={{ uri: row.video_thumbnail }}
                                  style={{ width: 70, height: 40 }}
                                />
                              </View>
                            );
                          }}
                          right={() => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                  marginRight: 10,
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                {data.now_playing_video_info.voting.like_count >
                                  0 && (
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Ionicons
                                      name="thumbs-up"
                                      size={18}
                                      color={"#434343"}
                                    />
                                    <Text style={{ marginLeft: 5 }}>
                                      {
                                        data.now_playing_video_info.voting
                                          .like_count
                                      }
                                    </Text>
                                  </View>
                                )}
                                {data.now_playing_video_info.voting.vote_skip >
                                  0 && (
                                  <View
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <Ionicons
                                      name="play-skip-forward"
                                      size={18}
                                      color={"#434343"}
                                    />
                                    <Text style={{ marginLeft: 5 }}>
                                      {
                                        data.now_playing_video_info.voting
                                          .vote_skip
                                      }
                                    </Text>
                                  </View>
                                )}
                              </View>
                            );
                          }}
                          style={{ backgroundColor: "#D8D8D8" }}
                        />
                      );
                    }
                  })
              ) : (
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 200,
                  }}
                >
                  <ActivityIndicator size={"large"} color="#636568" />
                  <Text style={{ marginTop: 15 }}>
                    Đang tải danh sách phát...
                  </Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </Provider>
      );
    };

    const childToParent = (childdata) => {
      setData(childdata);
    };

    return (
      <>
        <MusicScreen
          childToParent={childToParent}
          // keyboardSummon={torf}
          tab={
            <>
              <Tab.Navigator
                screenOptions={{
                  tabBarLabelStyle: { fontSize: 12 },
                  tabBarItemStyle: { minHeight: 10, maxHeight: 75 },
                  tabBarStyle: { minHeight: 10, maxHeight: 75 },
                  tabBarShowLabel: false,
                  tabBarIndicatorStyle: { backgroundColor: "#007AFF" },
                }}
                style={{ height: "100%" }}
              >
                <Tab.Screen
                  name="Tiếp theo"
                  component={QueueComponent}
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Ionicons name={"list"} color={color} size={22} />
                    ),
                  }}
                  style={{ height: "100%" }}
                />
                <Tab.Screen
                  name="Chat"
                  component={ChatComponent}
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Ionicons
                        name={"chatbox-ellipses"}
                        color={color}
                        size={22}
                      />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Bạn bè đang xem"
                  component={TestingComponent}
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Ionicons name={"people"} color={color} size={22} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Tìm bài hát"
                  component={TestingComponent}
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Ionicons name={"search"} color={color} size={22} />
                    ),
                  }}
                />
                <Tab.Screen
                  name="Lời bài hát"
                  component={TestingComponent}
                  options={{
                    tabBarIcon: ({ color }) => (
                      <Ionicons name={"text"} color={color} size={22} />
                    ),
                  }}
                />
              </Tab.Navigator>
              <FAB
                style={{
                  position: "absolute",
                  margin: 16,
                  right: 0,
                  bottom: 75,
                  backgroundColor: "#FF5674",
                }}
                icon="heart"
                onPress={() => console.log("Pressed")}
              />
            </>
          }
          {...props}
        />
      </>
    );
  };

  const HomeScreenNew = () => {
    const Tab = createBottomTabNavigator();
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
            headerTitle: () => {
              return null;
            },
            tabBarLabel: () => {
              return null;
            },
            headerShown: true,
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
                    source={require("./app/assets/logo.png")}
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
  };

  StatusBar.setBarStyle("dark-content", true);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            title: "Đang tải...",
            headerShown: false,
          }}
          name="Loading"
          component={LoadingScreen}
        />
        <Stack.Screen
          options={{
            title: "Chào mừng đến với C4K60",
            headerShown: false,
          }}
          name="Welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          options={{ title: "Đăng nhập vào C4K60", headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            title: "Đăng ký tài khoản C4K60",
            headerBackTitle: "Quay lại",
          }}
          name="SignUp"
          component={SignupScreen}
        />
        <Stack.Screen
          options={{
            title: "Trang chính",
            headerShown: false,
            gestureEnabled: false,
          }}
          name="MainScreen"
          component={HomeScreenNew}
        />
        <Stack.Screen
          options={{
            headerBackTitle: "",
            title: "Thông báo lớp",
            headerShown: true,
          }}
          name="NotiScreen"
          component={NotiScreen}
        />
        <Stack.Screen
          options={{
            headerBackTitle: "",
            title: "Nghe nhạc cùng nhau",
            headerShown: true,
          }}
          name="MusicScreen"
          component={Music}
        />
        <Stack.Screen
          options={{
            headerBackTitle: "",
            title: "Testing 123",
            headerShown: true,
          }}
          name="Testing"
          component={TestingComponent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
