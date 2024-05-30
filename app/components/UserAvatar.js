import axios from "axios";
import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";

const UserAvatar = ({ username, style }) => {
  const [url, setUrl] = React.useState(null);
  const [showDefault, setDefault] = React.useState(true);

  const getAvatar = async () => {
    try {
      const response = await axios.post(
        "https://c4k60.com/api/v1.0/users/avatar/",
        {
          username: username,
        }
      );
      setUrl(response.data.avatar);
      setDefault(false);
      // console.log("asdkasd", response.data.avatar);
    } catch (err) {
      // console.log("errrrr", err);
    }
  };
  getAvatar();

  return (
    <>
      <View>
        <Image
          source={
            showDefault
              ? require("../assets/gray_load.png")
              : url == "default_avatar"
              ? require("../assets/userdefault.jpeg")
              : url
          }
          style={style}
        ></Image>
      </View>
    </>
  );
};

export default UserAvatar;
