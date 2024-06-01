import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import axios from "axios";
import UserAvatar from "../../components/UserAvatar";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ProfileDetail({ route }) {
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.com/api/v1.0/users/list/?username=" +
          route.params.username
      );
      setProfile(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {profile == null ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 400,
          }}
        >
          <ActivityIndicator size={"large"} color="#636568" />
          <Text style={{ marginTop: 15 }}>Đang tải hồ sơ...</Text>
        </View>
      ) : (
        <>
          <View style={{ margin: 10 }}>
            <Image
              source={require("../../assets/gray_load.png")}
              style={{ height: 200, width: "100%", borderRadius: 15 }}
            ></Image>
          </View>
          <View>
            <UserAvatar
              username={route.params.username}
              style={{
                height: 150,
                width: 150,
                borderRadius: 75,
                borderWidth: 5,
                borderColor: "#F2F2F2",
                alignSelf: "center",
                position: "absolute",
                top: -120,
              }}
            ></UserAvatar>
          </View>
          <View style={{ padding: 15, marginTop: 20 }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {route.params.name}{" "}
              </Text>
              {profile?.verified == "1" ? (
                <Ionicons
                  name="checkmark-circle"
                  size={23}
                  color={"#166CFF"}
                ></Ionicons>
              ) : null}
            </View>
            <Text style={{ fontSize: 18, textAlign: "center" }}>
              {profile?.short_name}
            </Text>
            <Text
              style={{ fontSize: 16, color: "#636568", textAlign: "center" }}
            >
              @{route.params.username}
            </Text>
          </View>
          <View
            style={{
              padding: 15,
              borderTopWidth: 8,
              borderTopColor: "#C0C0C0",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Thông tin chi tiết
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Ionicons name="location" size={23} color={"#434343"} />
              <Text style={{ marginLeft: 6, fontSize: 17 }}>
                Đến từ{" "}
                <Text style={{ fontWeight: "700" }}>{profile?.address}</Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Ionicons name="gift" size={23} color={"#434343"} />
              <Text style={{ marginLeft: 6, fontSize: 17 }}>
                Sinh ngày{" "}
                <Text style={{ fontWeight: "700" }}>
                  {profile?.dayofbirth +
                    "/" +
                    profile?.monthofbirth +
                    "/" +
                    profile?.yearofbirth}
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("tel:" + profile.phone_number);
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <Ionicons name="call" size={23} color={"#434343"} />
              <Text style={{ marginLeft: 6, fontSize: 17 }}>
                <Text style={{ fontWeight: "700" }}>
                  {profile?.phone_number}
                </Text>
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {profile?.fb_link == "" ? null : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#DBDBDB",
                    padding: 10,
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                  onPress={() => {
                    Linking.openURL(profile.fb_link);
                  }}
                >
                  <Ionicons name="logo-facebook" size={20}></Ionicons>
                  <Text style={{ fontSize: 18, marginLeft: 5 }}>Facebook</Text>
                </TouchableOpacity>
              )}
              {profile?.ig_link == "" ? null : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#DBDBDB",
                    padding: 10,
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                  onPress={() => {
                    Linking.openURL(profile.ig_link);
                  }}
                >
                  <Ionicons name="logo-instagram" size={20}></Ionicons>
                  <Text style={{ fontSize: 18, marginLeft: 5 }}>Instagram</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              padding: 15,
              borderTopWidth: 8,
              borderTopColor: "#C0C0C0",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
              Tính cách
            </Text>
            <Text style={{ fontSize: 17 }}>{profile?.additional_info}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
