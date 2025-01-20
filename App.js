import { storage } from "./app/global/storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
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
  ImageBackground,
  View,
  Button,
  Animated,
} from "react-native";
import { FAB, List, Modal, Portal, Provider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import CommentChat from "./app/components/CommentChat";
import UserAvatar from "./app/components/UserAvatar";
import UserFullName from "./app/components/UserFullName";
import config from "./app/configurations/config";
import ChatScreen from "./app/screens/Chat/ChatScreen";
import HomeScreen from "./app/screens/HomeScreen";
import LoadingScreen from "./app/screens/LoadingScreen";
import LoginScreen from "./app/screens/LoginScreen";
import MenuScreen from "./app/screens/MenuScreen";
import MusicScreen from "./app/screens/MusicScreen";
import NewsfeedScreen from "./app/screens/Newsfeed";
import NotificationScreen from "./app/screens/NotificationScreen";
import NotiScreen from "./app/screens/NotiScreen";
import SignupScreen from "./app/screens/SignupScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import SearchScreen from "./app/screens/SearchScreen";
import { BlurView } from "expo-blur";
import { TailwindProvider } from "tailwindcss-react-native";
import IncomingBirthday from "./app/screens/IncomingBirthday";
import SameHeader from "./app/components/SameHeader";
import GalleryScreen from "./app/screens/Gallery/GalleryScreen";
import PhotosScreen from "./app/screens/Gallery/PhotosScreen";
import StudentProfile from "./app/screens/Profile/StudentProfile";
import * as RootNavigation from "./app/utils/RootNavigation";
import VideoScreen from "./app/screens/Gallery/VideoScreen";
import ProfileDetail from "./app/screens/Profile/ProfileDetail";
import CalendarScreen from "./app/screens/Calendar/CalendarScreen";
import CalendarDetail from "./app/screens/Calendar/CalendarDetail";
import FriendNearby from "./app/screens/FriendNearby";
import ChatRoom from "./app/screens/Chat/ChatRoom";
import NewChat from "./app/screens/Chat/NewChat";
import Sponsors from "./app/screens/Sponsors";
import Changelogs from "./app/screens/Changelogs";
import CreatePost from "./app/screens/Newsfeed/CreatePost";
import AnimatedHeart from "./app/components/AnimatedHeart";
import * as Linking from "expo-linking";

const ws = new WebSocket("ws://103.81.85.224:6996");

const TextEncodingPolyfill = require("text-encoding");
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});

const Tab = createMaterialTopTabNavigator();
const baseBackendServerURL =
  config.baseBackendServerURL + ":" + config.backendServerPort;

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  "JSON Parse error: Unrecognized token '<'",
  "Possible Unhandled Promise Rejection",
  "Error evaluating injected",
  "Non-serializable values were found in the navigation state",
]);

LogBox.ignoreLogs([
  "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.%s a useEffect cleanup function",
]);

const Stack = createNativeStackNavigator();

function App() {
  const expoPushToken = storage.getString("expoPushToken") ?? "";
  const inputText = React.useRef(null);

  const TestingComponent = () => <Text>Tung Anh</Text>;

  const linking = {
    prefixes: ["exp+c4k60://", "c4k60://", "https://c4k60.com"], // Define your URI scheme
    config: {
      screens: {
        NotiScreen: "notification/:id",
        ChatRoom: "chat/:username/:user_from/:name/:type", // Route with a dynamic parameter
      },
    },
  };

  const ChatComponent = React.memo(() => {
    const usrname = storage.getString("username");

    const [chatData, setChatData] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [currentInputText, setCurrentInputText] = React.useState("");
    const [userFullname, setUserFullname] = React.useState("");

    const scrollViewRef = useRef();

    const UserFullname = async () => {
      try {
        console.log("---->", usrname);
        const response = await axios.post("https://api.c4k60.com/v2.0/users", {
          username: usrname,
        });
        setUserFullname(response.data.info.full_name);
        return response.data.info.full_name;
      } catch (err) {
        console.log("errhhihih", err);
      }
    };

    const insertJoining = async () => {
      const response = await axios.post(
        "https://api.c4k60.com/v2.0/radio/chatlogs",
        {
          by: "System",
          msg_type: "user_join",
          message: userFullname,
          thumbnail: "user:" + usrname,
        }
      );
      return response.data;
    };

    useEffect(() => {
      getChatLogs();
      UserFullname();
    }, [usrname, userFullname]);

    useEffect(() => {
      insertJoining();
    }, [usrname, userFullname]);

    const getChatLogs = async () => {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/radio/chatlogs"
      );
      setChatData(response.data.items.reverse());
      // localStorage.setItem("chat-data", JSON.stringify(response.data.items));
      // console.log(new Error().stack,
      //   "data: " + JSON.parse(localStorage.getItem("chat-data"))[0].msg
      // );
      return response.data;
    };

    const sendChat = async (created_by, msg_type, message, thumbnail) => {
      if (message == "") return;
      try {
        const response = await axios.post(
          "https://api.c4k60.com/v2.0/radio/chatlogs",
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
        "http://" + baseBackendServerURL + "/admin/api/client/refresh"
      );
      return response.data;
    };

    const rend = () => {
      return chatData.map((item) => {
        if (item.msg_type == "user_join") {
          return (
            <>
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
                  <UserAvatar
                    username={item.thumbnail.split("user:")[1]}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 15,
                    }}
                    containerStyle={{ marginRight: 5 }}
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
            </>
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
                    alignItems: "flex-start",
                  }}
                  containerStyle={{ marginRight: 10 }}
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

  async function getSuggestQueries(query) {
    const response = await axios.request({
      method: "GET",
      url: `http://suggestqueries.google.com/complete/search?q=${query}&client=firefox`,
      responseType: "arraybuffer",
      responseEncoding: "binary",
    });
    const decoder = new TextDecoder("ISO-8859-1");
    let html = decoder.decode(response.data);
    return html;
  }

  async function getSearchResults(query) {
    try {
      const key = "AIzaSyAKLubflIVrPOTU6KOIpkWqGXdWTp7dEEI";
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15&key=${key}&q=${query}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  function getUniqueID() {
    return Math.floor(Math.random() * Date.now()).toString();
  }

  const SearchComponent = () => {
    const [search, setSearch] = React.useState("");
    const [sugg, setSuggest] = React.useState([]);
    const [res, setResult] = React.useState([]);

    const suggest = () => {
      getSuggestQueries(search).then((data) => {
        setSuggest(JSON.parse(data)[1]);
      });
    };

    const result = () => {
      getSearchResults(search).then((data) => {
        // console.log("dataasdasd", data);
        setResult(data.items);
        // data.items.map((vid) => {});
      });
    };

    useEffect(() => {
      suggest();
    }, [search]);

    return (
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          setSuggest([]);
        }}
      >
        <KeyboardAvoidingView style={{ height: "100%" }}>
          <ScrollView style={{ height: "100%" }}>
            <View style={{ flex: 1, padding: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                    borderColor: "rgba(0,0,0,0.2)",
                    backgroundColor: "white",
                    padding: 10,
                    flex: 1,
                  }}
                >
                  <TextInput
                    style={{ fontSize: 16 }}
                    onChangeText={(text) => setSearch(text)}
                    value={search}
                    placeholder="Gõ một từ để xem gợi ý..."
                  ></TextInput>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "blue",
                    width: 100,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    result();
                    setSuggest([]);
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: 16,
                    }}
                  >
                    Tìm kiếm
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                {sugg.map((val, id) => (
                  <TouchableOpacity
                    key={id}
                    style={{
                      backgroundColor: "white",
                      padding: 5,
                      paddingLeft: 10,
                    }}
                    onPress={() => setSearch(val)}
                  >
                    <Text style={{ fontSize: 16 }}>{val}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {res.map((vid) => {
              // console.log(vid.snippet.thumbnails.default.url);
              return (
                <>
                  <List.Item
                    title={vid.snippet.title}
                    description={vid.snippet.channelTitle}
                    key={vid.snippet.title}
                    onPress={() => {}}
                    left={() => {
                      return (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 10,
                          }}
                        >
                          <Image
                            source={{
                              uri: vid.snippet.thumbnails.default.url,
                            }}
                            style={{ width: 70, height: 40 }}
                          ></Image>
                        </View>
                      );
                    }}
                  />
                </>
              );
            })}
          </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    );
  };

  const Music = (props) => {
    const [data, setData] = React.useState("");
    const [hearts, setHearts] = React.useState([]);

    const countAnimatedValue = useRef(new Animated.Value(0)).current;
    const timeout = useRef();

    const connectWebsocket = () => {
      ws.onopen = () => {
        console.log("connected");
      };
      ws.onerror = (e) => {
        console.log(e.message);
      };
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data).data;

        // console.log("message", message);
        if (
          message.type == "love_reaction" &&
          message.username !== storage.getString("username")
        ) {
          handleLovePress();
        }
      };
    };

    useEffect(() => {
      connectWebsocket();
    }, []);

    // Function to handle love button press
    const handleLovePress = () => {
      // Clear any existing animation timeout
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      // Add heart locally
      setHearts((oldHearts) => [...oldHearts, { id: getUniqueID() }]);

      // Animate count
      timeout.current = setTimeout(() => {
        Animated.spring(countAnimatedValue, {
          toValue: 0,
          speed: 48,
          useNativeDriver: true,
        }).start();
      }, 500);

      Animated.spring(countAnimatedValue, {
        toValue: -64,
        speed: 48,
        useNativeDriver: true,
      }).start();
    };

    const handleCompleteAnimation = useCallback((id) => {
      setHearts((oldHearts) => {
        return oldHearts.filter((heart) => heart.id !== id);
      });
    }, []);

    const ViewerComponent = () => {
      return (
        <KeyboardAvoidingView style={{ height: "100%" }}>
          <ScrollView style={{ height: "100%" }}>
            {Array.isArray(data.now_watching) ? (
              data.now_watching.map((row, index) => (
                <>
                  <List.Item
                    title={<UserFullName username={row} />}
                    description={"Đang xem"}
                    key={index}
                    onPress={() => {}}
                    left={() => {
                      return (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            marginLeft: 10,
                          }}
                        >
                          <UserAvatar
                            username={row}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 100,
                            }}
                            containerStyle={{ marginRight: 10 }}
                          />
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
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
                          key={row.video_title}
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
                          key={row.video_title}
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
                  component={SearchComponent}
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
                  zIndex: 1,
                }}
                icon="heart"
                onPress={() => {
                  handleLovePress();
                  // Emit love reaction to other users
                  ws.send(
                    JSON.stringify({
                      data: {
                        type: "love_reaction",
                        username: storage.getString("username"),
                      },
                    })
                  );
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 150,
                  right: 25,
                  zIndex: 0,
                }}
              >
                {hearts.map(({ id }) => (
                  <AnimatedHeart
                    key={id}
                    id={id}
                    onCompleteAnimation={handleCompleteAnimation}
                  />
                ))}
              </View>
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
                if (
                  (route.name === "Newsfeed" &&
                    storage.getString("username") == "test") ||
                  (route.name === "Chat" &&
                    storage.getString("username") == "test")
                ) {
                  return Alert.alert(
                    "Chức năng này không khả dụng trong chế độ xem trước."
                  );
                }
                if (
                  route.name === "Home" ||
                  route.params.currentScreen !== currentScreen
                ) {
                  navigation.navigate(route.name);
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
            <>
              {Platform.OS === "ios" ? (
                <BlurView tint="light" intensity={1000} style={{ flex: 1 }} />
              ) : (
                <View style={{ flex: 1, backgroundColor: "white" }}></View>
              )}
            </>
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
            headerTitle: () => {
              return (
                <SameHeader
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                  havingIcon
                  havingBackground
                />
              );
            },
            headerBackground: () => (
              <ImageBackground
                source={require("./app/assets/headerBg.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              ></ImageBackground>
            ),
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
            headerTitle: () => {
              return (
                <SameHeader
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                  // havingBorder
                  havingIcon
                />
              );
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          initialParams={{
            ws: ws,
          }}
          options={{
            title: "Chat",
            headerShown: true,
            headerTitleAlign: "left",
            headerTitle: () => {
              return (
                <SameHeader
                  title="Chat"
                  icon="create-outline"
                  action={() => {
                    navigation.navigate("NewChat", { ws: ws });
                  }}
                />
              );
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
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
            headerTitle: () => {
              return (
                <SameHeader
                  title="Thông báo"
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                />
              );
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
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
            headerTitle: () => {
              return (
                <SameHeader
                  title="Menu"
                  icon="search"
                  action={() => navigation.navigate("SearchScreen")}
                />
              );
            },
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
          }}
        />
      </Tab.Navigator>
    );
  };

  StatusBar.setBarStyle("dark-content", true);

  const createPostRef = useRef(null);
  const [isPostContentEmpty, setIsPostContentEmpty] = React.useState(true);

  // Function to update postContent status
  const handlePostContentChange = (content) => {
    setIsPostContentEmpty(!content); // Update button disable state based on content
  };

  return (
    <NavigationContainer linking={linking} ref={RootNavigation.navigationRef}>
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
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Thông báo lớp"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="NotiScreen"
            component={NotiScreen}
          />
          <Stack.Screen
            options={{
              title: "Nghe nhạc cùng nhau",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Nghe nhạc cùng nhau"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="MusicScreen"
            component={Music}
          />
          <Stack.Screen
            options={({ route }) => ({
              title: route.params.title,
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={route.params.title}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="Testing"
            component={TestingComponent}
          />
          <Stack.Screen
            options={{
              title: "Thư viện ảnh",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Thư viện ảnh"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="GalleryScreen"
            component={GalleryScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              title: route.params.name,
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={route.params.name}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="PhotosScreen"
            component={PhotosScreen}
          />
          <Stack.Screen
            options={({ route }) => ({
              title: route.params.name,
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={route.params.name}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="VideoScreen"
            component={VideoScreen}
          />
          <Stack.Screen
            options={() => ({
              title: "Hồ sơ thành viên",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={"Hồ sơ thành viên lớp"}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="StudentProfile"
            component={StudentProfile}
          />
          <Stack.Screen
            options={({ route }) => ({
              title: route.params.name,
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={route.params.name}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="ProfileDetail"
            component={ProfileDetail}
          />
          <Stack.Screen
            options={() => ({
              title: "Lịch",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={"Lịch & Sự kiện"}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="CalendarScreen"
            component={CalendarScreen}
          />
          <Stack.Screen
            options={() => ({
              title: "Lịch",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={"Lịch & Sự kiện"}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="CalendarDetail"
            component={CalendarDetail}
          />
          <Stack.Screen
            options={() => ({
              title: "Bạn bè gần đây",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title={"Bạn bè gần đây"}
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            })}
            name="FriendNearby"
            component={FriendNearby}
          />
          <Stack.Screen
            initialParams={{ ws: ws, token: expoPushToken }}
            options={({ route }) => ({
              title: route.params.name,
              // headerTitle: () => {
              //   return (
              //     <SameHeader
              //       defaultStyle
              //       havingBorder
              //       havingBackButton
              //       title={route.params.name}
              //     />
              //   );
              // },
            })}
            name="ChatRoom"
            component={ChatRoom}
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
              title: "Đoạn chat mới",
              gestureEnabled: false,
              animation: "slide_from_bottom",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Đoạn chat mới"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="NewChat"
            component={NewChat}
          />
          <Stack.Screen
            options={{
              title: "Sinh nhật sắp tới",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Sinh nhật sắp tới"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="IncomingBirthday"
            component={IncomingBirthday}
          />
          <Stack.Screen
            options={{
              title: "Nhà tài trợ",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Nhà tài trợ"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="Sponsors"
            component={Sponsors}
          />
          <Stack.Screen
            options={{
              title: "Những thay đổi",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Những thay đổi"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    color="black"
                    size={30}
                  />
                </TouchableOpacity>
              ),
              headerBackVisible: false,
            }}
            name="Changelogs"
            component={Changelogs}
          />
          <Stack.Screen
            options={{
              title: "Tạo bài viết",
              presentation: "fullScreenModal",
              headerTitle: () => {
                return (
                  <SameHeader
                    defaultStyle
                    havingBorder
                    havingBackButton
                    title="Tạo bài viết"
                  />
                );
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => RootNavigation.goBack()}>
                  <Ionicons name="close-outline" color="black" size={30} />
                </TouchableOpacity>
              ),
              headerRight: () => (
                <Button
                  title="Đăng"
                  onPress={() => {
                    if (createPostRef.current) {
                      createPostRef.current.handlePost();
                    }
                  }}
                  disabled={isPostContentEmpty}
                ></Button>
              ),
              headerBackVisible: false,
            }}
            name="CreatePost"
          >
            {(props) => (
              <CreatePost
                {...props}
                ref={createPostRef}
                onPostContentChange={handlePostContentChange}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </TailwindProvider>
    </NavigationContainer>
  );
}

export default App;
