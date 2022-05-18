import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faFacebook } from "@fortawesome/free-brands-svg-icons";

library.add(fab, faFacebook);

function SignupScreen({ navigation }) {
  return (
    <SafeAreaView>
      <Text style={{ margin: 15, fontSize: 20 }}>
        Thông tin đăng nhập của cả lớp và GVCN đã được gửi trong nhóm kín C4K60
        - CBH. Nếu bạn không thấy thông tin đăng nhập của mình hoặc không thể
        đăng nhập được vui lòng liên hệ với Dương Tùng Anh để tạo mới tài khoản.
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
    </SafeAreaView>
  );
}

export default SignupScreen;
