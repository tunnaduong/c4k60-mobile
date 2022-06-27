import axios from "axios";
import React from "react";
import { Image, View } from "react-native";

const UserAvatar = React.memo(function UserAvatar({ username, style }) {
  const [url, setUrl] = React.useState(null);
  const [showDefault, setDefault] = React.useState(true);

  const getAvatar = async () => {
    try {
      const response = await axios.post(
        "https://api.c4k60.com/v1.0/users/avatar/",
        {
          username: username,
        }
      );
      setUrl(response.data.avatar);
      setDefault(false);
    } catch (err) {}
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
              : { uri: url }
          }
          style={style}
        ></Image>
      </View>
    </>
  );
});

export default UserAvatar;
