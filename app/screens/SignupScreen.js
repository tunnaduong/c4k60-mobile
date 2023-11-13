import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faFacebook } from "@fortawesome/free-brands-svg-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fas, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

library.add(fab, faFacebook);
library.add(fas, faUserSecret);

function SignupScreen({ navigation }) {
  const openURL = async (link) => {
    return await WebBrowser.openBrowserAsync(link);
  };

  const guestMode = async () => {
    await AsyncStorage.setItem("name", "Khách truy cập");
    await AsyncStorage.setItem("username", "guest");
    await AsyncStorage.setItem("avatar", "default");
    await AsyncStorage.setItem("token", "abc123");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "MainScreen" }],
      })
    );
  };

  return (
    <SafeAreaView className="bg-white">
      <View className="border-b-[1px] border-gray-300 pb-3 bg-white">
        <Text className="text-center font-medium text-lg mt-1">
          Đăng ký tài khoản C4K60
        </Text>
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          left: 15,
          top:
            Platform.OS === "ios"
              ? Dimensions.get("screen").height > 667
                ? 45
                : 30
              : Platform.OS === "web"
              ? 15
              : 30,
          zIndex: 99,
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <View>
          <Ionicons
            name="chevron-back-outline"
            color="black"
            size={35}
            style={{ top: 1, left: -7 }}
          />
        </View>
      </TouchableOpacity>
      <View className="bg-gray-100">
        <Text className="m-4 text-base text-justify">
          Thông tin đăng nhập của cả lớp và GVCN{" "}
          <Text className="font-bold">
            đã được gửi trong nhóm kín C4K60 - CBH
          </Text>
          . Nếu bạn không thấy thông tin đăng nhập của mình hoặc không thể đăng
          nhập được vui lòng{" "}
          <Text className="font-bold">
            liên hệ với Dương Tùng Anh để tạo mới tài khoản.
          </Text>
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#006FFF",
              width: "90%",
              borderRadius: 50,
              height: 55,
              justifyContent: "center",
            }}
            activeOpacity="0.5"
            onPress={() => {
              openURL("https://facebook.com/groups/c4k60");
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={["fab", "facebook"]}
                size={30}
                color={"white"}
                style={{ margin: 15 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  flex: 0.85,
                }}
              >
                Truy cập C4K60 - CBH
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#0389FF",
              width: "90%",
              borderRadius: 50,
              height: 55,
              justifyContent: "center",
              marginTop: 15,
            }}
            activeOpacity="0.5"
            onPress={() => {
              openURL("https://m.me/tunna.duong");
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={["fab", "facebook-messenger"]}
                size={30}
                color={"white"}
                style={{ margin: 15 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  flex: 0.85,
                }}
              >
                Chat với Dương Tùng Anh
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#7667D6",
              width: "90%",
              borderRadius: 50,
              height: 55,
              justifyContent: "center",
              marginTop: 15,
            }}
            activeOpacity="0.5"
            onPress={guestMode}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon
                icon={["fas", "user-secret"]}
                size={30}
                color={"white"}
                style={{ margin: 15 }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  flex: 0.85,
                }}
              >
                Đăng nhập với tư cách khách
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SignupScreen;
