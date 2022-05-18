import React from "react";
import { StatusBar } from "react-native";
import LoadingScreen from "./app/screens/LoadingScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignupScreen from "./app/screens/SignupScreen";
import HomeScreen from "./app/screens/HomeScreen";
import NotiScreen from "./app/screens/NotiScreen";
import MusicScreen from "./app/screens/MusicScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function App() {
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
          component={MusicScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
