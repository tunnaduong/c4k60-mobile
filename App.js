import React, { useEffect } from "react";
import {
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingScreen from "./app/screens/LoadingScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignupScreen from "./app/screens/SignupScreen";
import HomeScreen from "./app/screens/HomeScreen";
import NotiScreen from "./app/screens/NotiScreen";
import MusicScreen from "./app/screens/MusicScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Test from "./app/screens/Test";
import Logger from "./app/utils/logger";
import { LogBox } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import config from "./app/configurations/config";
import { List } from "react-native-paper";
import { FAB } from "react-native-paper";
import { Modal, Portal, Provider } from "react-native-paper";

const Tab = createMaterialTopTabNavigator();
const baseBackendServerURL =
  config.baseBackendServerURL + ":" + config.backendServerPort;

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  "JSON Parse error: Unrecognized token '<'",
]);

const Stack = createNativeStackNavigator();

function App() {
  const TestingComponent = () => <Test />;

  const Music = (props) => {
    const [data, setData] = React.useState("");

    const QueueComponent = () => {
      const [visible, setVisible] = React.useState(false);
      const [activeVideo, setActiveVideo] = React.useState(1);

      const showModal = (pos) => {
        setVisible(true);
        setActiveVideo(pos);
      };
      const hideModal = () => setVisible(false);
      // useEffect(() => {
      //   setCurrentLiveData(data);
      // }, [data]);

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
                <Text>Loading...</Text>
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
      <MusicScreen
        childToParent={childToParent}
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
                component={TestingComponent}
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
                bottom: 30,
                backgroundColor: "#FF5674",
              }}
              icon="heart"
              onPress={() => console.log("Pressed")}
            />
          </>
        }
        {...props}
      />
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
          component={HomeScreen}
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
