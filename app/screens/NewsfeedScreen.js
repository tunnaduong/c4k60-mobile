import React from "react";
import { View, ScrollView, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAvatar from "../components/UserAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NewsfeedScreen({ navigation, route }) {
  // get username from asyncstorage
  const [username, setUsername] = React.useState(null);
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
      <ScrollView>
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
      </ScrollView>
    </>
  );
}
