import axios from "axios";
import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";

const UserAvatar = ({ username, style }) => {
  const [url, setUrl] = React.useState(null);
  const [showDefault, setDefault] = React.useState(true);

  const getAvatar = async () => {
    setUrl("https://api.c4k60.com/v2.0/users/avatar/" + username);
    setDefault(false);
  };

  React.useEffect(() => {
    getAvatar();
  }, [username]);

  return (
    <>
      <View style={{ backgroundColor: "gray", borderRadius: 100 }}>
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
