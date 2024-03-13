import React from "react";
import { View, ScrollView, Text, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAvatar from "../components/UserAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";

export default function NewsfeedScreen({ navigation, route }) {
  // get username from asyncstorage
  const [username, setUsername] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        setUsername(username);
      } catch (error) {
        console.error(error);
      }
    };
    getUsername();
  }, []);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 800);
            }}
          />
        }
        contentContainerStyle={{ backgroundColor: "white" }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            backgroundColor: "white",
          }}
        >
          <UserAvatar
            username={username}
            style={{ width: 40, height: 40, borderRadius: 25 }}
          ></UserAvatar>
          <Text style={{ fontSize: 16, marginLeft: 10, flex: 1 }}>
            Bạn đang nghĩ gì?
          </Text>
          <Ionicons
            name="images"
            size={22}
            color={"#36BF2D"}
            style={{ marginRight: 7 }}
          ></Ionicons>
        </View>
        <View
          style={{
            borderTopWidth: 8,
            borderTopColor: "#E6E6E6",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              backgroundColor: "white",
            }}
          >
            <UserAvatar
              username="tunganh"
              style={{ width: 40, height: 40, borderRadius: 25 }}
            ></UserAvatar>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Tùng Anh</Text>
              <Text style={{ fontSize: 14, color: "#A9A9A9" }}>
                2 giờ trước
              </Text>
            </View>
          </View>
          <Image
            source={"https://picsum.photos/200/300"}
            style={{ width: "100%", height: 300 }}
          ></Image>
          <View
            style={{
              marginHorizontal: 12,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#E6E6E6",
            }}
          >
            <Text>1 like</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              padding: 10,
              backgroundColor: "white",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="heart-outline"
                size={22}
                color={"#8B8D95"}
                style={{ marginRight: 7 }}
              ></Ionicons>
              <Text style={{ color: "#8B8D95" }}>Thích</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={22}
                color={"#8B8D95"}
                style={{ marginRight: 7 }}
              ></Ionicons>
              <Text style={{ color: "#8B8D95" }}>Bình luận</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
