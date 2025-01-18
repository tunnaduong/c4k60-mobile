import axios from "axios";
import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";

const UserAvatar = ({ username, style, containerStyle }) => {
  return (
    <>
      <View
        style={[{ backgroundColor: "gray", borderRadius: 100 }, containerStyle]}
      >
        <Image
          source={{
            uri: "https://api.c4k60.com/v2.0/users/avatar/" + username,
          }}
          style={style}
        ></Image>
      </View>
    </>
  );
};

export default UserAvatar;
