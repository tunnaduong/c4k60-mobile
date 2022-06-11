import React, { useEffect } from "react";
import {
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Image,
  RefreshControl,
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

const Tab = createMaterialTopTabNavigator();
const baseBackendServerURL =
  config.baseBackendServerURL + ":" + config.backendServerPort;

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
]);

const Stack = createNativeStackNavigator();

function App() {
  const TestingComponent = (props) => <Test />;

  const QueueComponent = () => {
    const [currentLiveData, setCurrentLiveData] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
      getData();
    }, []);

    const getData = async () => {
      const response = await axios
        .get("http://" + baseBackendServerURL + "/live")
        .catch((error) => {
          console.log(error.message);
        });
      setCurrentLiveData(response.data);
      // console.log(currentLiveData);
      return response.data;
    };

    return (
      <>
        <KeyboardAvoidingView style={{ height: "100%" }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getData();
                  setTimeout(() => {
                    setRefreshing(false);
                  }, 800);
                }}
              />
            }
            style={{ height: "100%" }}
          >
            {Array.isArray(currentLiveData.video_in_queue) ? (
              currentLiveData.video_in_queue.map((row) => {
                return (
                  <List.Item
                    title={row.video_title}
                    description={row.uploaded_by}
                    key={row.position}
                    onPress={() => {
                      console.log("clicked");
                    }}
                    left={() => (
                      <Image
                        source={{ uri: row.video_thumbnail }}
                        style={{ width: 90, height: 50 }}
                      />
                    )}
                  />
                );
              })
            ) : (
              <Text>Loading...</Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  };

  const Music = (props) => (
    <MusicScreen
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
                  <Ionicons name={"chatbox-ellipses"} color={color} size={22} />
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
