import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function SettingScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            marginBottom: 12,
          }}
          onPress={() => navigation.navigate("AvatarEditScreen")}
        >
          <Text style={{ fontSize: 16 }}>Sửa ảnh đại diện</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            marginBottom: 12,
          }}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text style={{ fontSize: 16 }}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16 }}>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16 }}>Quyền riêng tư</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ padding: 16, backgroundColor: "#f0f0f0", borderRadius: 8 }}
        >
          <Text style={{ fontSize: 16 }}>Trợ giúp</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
