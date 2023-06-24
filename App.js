import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
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
import WelcomeScreen from "./app/screens/WelcomeScreen";
import SearchScreen from "./app/screens/SearchScreen";
import { BlurView } from "expo-blur";
import { TailwindProvider } from "tailwindcss-react-native";
import IncomingBirthday from "./app/screens/IncomingBirthday";
import SameHeader from "./app/components/SameHeader";
import * as RootNavigation from "./app/utils/RootNavigation";

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
  const inputText = React.useRef(null);

  const TestingComponent = () => <Text>Tung Anh</Text>;

  const ChatComponent = React.memo(() => {
    const [usrname, setUsername] = React.useState("");

    const getData = async () => {
      const username = await AsyncStorage.getItem("username");
      if (username !== null) {
        setUsername(username);
      }
    };

    const [chatData, setChatData] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [currentInputText, setCurrentInputText] = React.useState("");

    const scrollViewRef = useRef();
    useEffect(() => {
      getData();
      getChatLogs();
    }, []);

    const getChatLogs = async () => {
      const response = await axios.get(
        "https://api.c4k60.com/v1.0/radio/chatlogs"
      );
      setChatData(response.data.items);
      // localStorage.setItem("chat-data", JSON.stringify(response.data.items));
      // console.log(
      //   "data: " + JSON.parse(localStorage.getItem("chat-data"))[0].msg
      // );
      return response.data;
    };

    const sendChat = async (created_by, msg_type, message, thumbnail) => {
      if (message == "") return;
      try {
        const response = await axios.post(
          "https://api.c4k60.com/v1.0/radio/chatlogs/",
          {
            by: created_by,
            msg_type: msg_type,
            message: message,
            thumbnail: thumbnail,
          }
        );
        return response.data.code;
      } catch (err) {
        // console.log(err);
      }
    };

    const submit = () => {
      sendChat(usrname, "chat", currentInputText, "user:" + usrname).then(
        (res) => {
          setCurrentInputText("");
          getChatLogs();
          if (res == 200) {
            console.log("200 OK sending refresh");
            sendRefresh();
          }
        }
      );
    };

    const sendRefresh = async () => {
      const response = await axios.get(
        "http://" + baseBackendServerURL + "/admin/api/client/refresh/"
      );
      return response.data;
    };

    const rend = () => {
      return chatData.map((item) => {
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
                  borderRadius: 30,
                  overflow: "hidden",
                  borderWidth: 0.5,
                  borderStyle: "solid",
                  borderColor: "gray",
                  flexDirection: "row",
                }}
              >
                {console.log(item.thumbnail.split("user:")[1])}
                <UserAvatar
                  username={{ uri: item.thumbnail.split("user:")[1] }}
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
                        color: "gray",
                        alignSelf: "flex-end",
                        paddingBottom: 4.5,
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
      });
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
            ref={scrollViewRef}
            style={{
              flex: 1,
              paddingTop: 10,
              // paddingBottom: 10,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                title="Tải thêm tin nhắn..."
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
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "flex-end",
              flexDirection: "column",
            }}
            onContentSizeChange={() => {
              scrollViewRef.current.scrollToEnd({ animated: false });
            }}
          >
            <View style={{ marginBottom: 15 }}>{rend()}</View>
          </ScrollView>
          <CommentChat
            username={usrname}
            placeholderText={"Nhập tin nhắn..."}
            ref={inputText}
            value={currentInputText}
            onChangeText={(text) => {
              setCurrentInputText(text);
            }}
            onSubmit={submit}
            onUpload={() => {
              return null;
            }}
            onKeyPress={(e) => {
              if (e.nativeEvent.key == "Enter") {
                submit();
              }
            }}
          />
        </KeyboardAvoidingView>
      </>
    );
  });

  const Music = (props) => {
    const [data, setData] = React.useState("");
    // const [torf, setTrueOrFalse] = React.useState(false);

    const ViewerComponent = () => {
      return Array.isArray(data.now_watching) ? (
        data.now_watching.map((row, index) => (
          <>
            <List.Item
              title={row}
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
                    {data.now_playing_video_info.voting.like_count > 0 && (
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
                          {data.now_playing_video_info.voting.like_count}
                        </Text>
                      </View>
                    )}
                    {data.now_playing_video_info.voting.vote_skip > 0 && (
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
                          {data.now_playing_video_info.voting.vote_skip}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          </>
        ))
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
          <Text style={{ marginTop: 15 }}>Đang tải...</Text>
        </View>
      );
    };

    const QueueComponent = React.memo(() => {
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
    });

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
                  component={ViewerComponent}
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

  const HomeScreenNew = ({ navigation }) => {
    const [currentScreen, setCurrentScreen] = React.useState("HomeScreen");
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
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={(e) => {
                if (route.params.currentScreen == currentScreen) {
                  return;
                } else {
                  navigation.navigate(route.name, {
                    previous_screen: currentScreen,
                  });
                  setCurrentScreen(route.params.currentScreen);
                }
              }}
            />
          ),
          tabBarStyle: {
            borderTopColor: "#B3B3B3",
            // backgroundColor: "transparent",
            // position: "absolute",
            position: "absolute",
          },
          tabBarLabelStyle: {
            fontWeight: "500",
          },
          tabBarBackground: () => (
            <BlurView tint="light" intensity={1000} style={{ flex: 1 }} />
          ),
        })}
        shifting={true}
        sceneAnimationEnabled={true}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{
            currentScreen: "HomeScreen",
          }}
          options={{
            title: "Trang chủ",
            // tab screen fade transition
            headerShown: true,
            headerBackButtonMenuEnabled: false,
            header: () => {
              return (
                <SameHeader
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                  havingIcon
                  havingBackground
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Newsfeed"
          component={NewsfeedScreen}
          initialParams={{
            currentScreen: "NewsfeedScreen",
          }}
          options={{
            title: "Bảng tin",
            headerShown: true,
            header: () => {
              return (
                <SameHeader
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                  havingBorder
                  havingIcon
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          initialParams={{
            currentScreen: "ChatScreen",
          }}
          options={{
            title: "Chat",
            headerShown: true,
            headerTitleAlign: "left",
            header: () => {
              return (
                <SameHeader
                  title="Chat"
                  icon="create-outline"
                  action={() => {
                    console.log("pressed");
                  }}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Notifications"
          initialParams={{
            currentScreen: "NotiScreen",
          }}
          component={NotificationScreen}
          options={{
            title: "Thông báo",
            headerShown: true,
            headerTitleAlign: "left",
            header: () => {
              return (
                <SameHeader
                  title="Thông báo"
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Menu"
          initialParams={{
            currentScreen: "MenuScreen",
          }}
          component={MenuScreen}
          options={{
            title: "Menu",
            headerShown: true,
            headerTitleAlign: "left",
            header: () => {
              return (
                <SameHeader
                  title="Menu"
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  };

  StatusBar.setBarStyle("dark-content", true);
  return (
    <NavigationContainer ref={RootNavigation.navigationRef}>
      <TailwindProvider>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              title: "Đang tải...",
              headerShown: false,
              animation: "fade",
            }}
            name="Loading"
            component={LoadingScreen}
          />
          <Stack.Screen
            options={{
              title: "Chào mừng đến với C4K60",
              headerShown: false,
              animation: "fade",
            }}
            name="Welcome"
            component={WelcomeScreen}
          />
          <Stack.Screen
            options={{
              title: "Đăng nhập vào C4K60",
              headerShown: false,
              presentation: "fullScreenModal",
            }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{
              title: "Đăng ký tài khoản C4K60",
              headerShown: false,
              presentation: "fullScreenModal",
            }}
            name="SignUp"
            component={SignupScreen}
          />
          <Stack.Screen
            options={{
              title: "Trang chính",
              headerShown: false,
              gestureEnabled: false,
              animation: "none",
            }}
            name="MainScreen"
            component={HomeScreenNew}
          />
          <Stack.Screen
            options={{
              title: "Thông báo lớp",
              header: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Thông báo lớp"
                  />
                );
              },
            }}
            name="NotiScreen"
            component={NotiScreen}
          />
          <Stack.Screen
            options={{
              title: "Nghe nhạc cùng nhau",
              header: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Nghe nhạc cùng nhau"
                  />
                );
              },
            }}
            name="MusicScreen"
            component={Music}
          />
          <Stack.Screen
            options={{
              title: "Testing 123",
              header: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Màn hình test, chưa có gì cả hihi"
                  />
                );
              },
            }}
            name="Testing"
            component={TestingComponent}
          />
          <Stack.Screen
            options={{
              title: "Tìm kiếm",
              headerShown: false,
              gestureEnabled: false,
              animation: "fade",
            }}
            name="SearchScreen"
            component={SearchScreen}
          />
          <Stack.Screen
            options={{
              title: "Sinh nhật sắp tới",
              header: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Sinh nhật sắp tới"
                  />
                );
              },
            }}
            name="IncomingBirthday"
            component={IncomingBirthday}
          />
        </Stack.Navigator>
      </TailwindProvider>
    </NavigationContainer>
  );
}

export default App;
