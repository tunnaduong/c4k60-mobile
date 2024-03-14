import React from "react";
import { View, Text } from "react-native";
import UserAvatar from "./UserAvatar";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableRipple } from "react-native-paper";
import moment from "moment";

export default function FeedPost({
  name,
  username,
  image,
  caption,
  time,
  likes,
  comments,
}) {
  return (
    <View
      style={{
        borderBottomWidth: 8,
        borderBottomColor: "#E6E6E6",
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
          username={username}
          style={{ width: 40, height: 40, borderRadius: 25 }}
        ></UserAvatar>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{name}</Text>
          <Text style={{ fontSize: 14, color: "#A9A9A9" }}>
            {moment(time, "YYYY-MM-DD h:m:s").fromNow()}
          </Text>
        </View>
      </View>
      <Text style={{ marginHorizontal: 12, marginBottom: 12, fontSize: 17 }}>
        {caption}
      </Text>
      {image == null ? null : (
        <Image source={image} style={{ width: "100%", height: 300 }}></Image>
      )}
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
          backgroundColor: "white",
          padding: 4,
          gap: 4,
        }}
      >
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .2)"
          onPress={() => {}}
          style={{
            padding: 5,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
          }}
        >
          <>
            <Ionicons
              name="heart-outline"
              size={22}
              color={"#8B8D95"}
              style={{ marginRight: 7 }}
            ></Ionicons>
            <Text style={{ color: "#8B8D95" }}>Thích</Text>
          </>
        </TouchableRipple>
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .2)"
          onPress={() => {}}
          style={{
            padding: 5,
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 6,
          }}
        >
          <>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={22}
              color={"#8B8D95"}
              style={{ marginRight: 7 }}
            ></Ionicons>
            <Text style={{ color: "#8B8D95" }}>Bình luận</Text>
          </>
        </TouchableRipple>
      </View>
    </View>
  );
}
