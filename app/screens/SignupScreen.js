import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faFacebook } from "@fortawesome/free-brands-svg-icons";
import Ionicons from "react-native-vector-icons/Ionicons";

library.add(fab, faFacebook);

function SignupScreen({ navigation }) {
  return (
    <SafeAreaView>
      <View>
        <Text className="text-center font-medium text-lg mt-1">
          Đăng ký tài khoản C4K60
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#828180",
          width: 40,
          height: 40,
          borderRadius: 35,
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
        activeOpacity={Platform.OS === "ios" ? 0.5 : null}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <View>
          <Ionicons
            name="chevron-back-outline"
            color="white"
            size={35}
            style={{ top: 1, left: 2 }}
          />
        </View>
      </TouchableOpacity>
      <View>
        <Text style={{ margin: 15, fontSize: 20 }}>
          Thông tin đăng nhập của cả lớp và GVCN đã được gửi trong nhóm kín
          C4K60 - CBH. Nếu bạn không thấy thông tin đăng nhập của mình hoặc
          không thể đăng nhập được vui lòng liên hệ với Dương Tùng Anh để tạo
          mới tài khoản.
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
              Linking.openURL("https://facebook.com/groups/c4k60");
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
              Linking.openURL("https://m.me/tunnaduong");
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
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SignupScreen;
