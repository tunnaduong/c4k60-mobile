import React from "react";
import { Text } from "react-native";
import axios from "axios";

const UserFullName = React.memo(function UserFullName({ username, style }) {
  const [name, setName] = React.useState("");

  const getName = async () => {
    try {
      const response = await axios.post("https://api.c4k60.com/v1.0/users/", {
        username: username,
      });
      setName(response.data.info.full_name);
    } catch (err) {}
  };

  getName();

  return <Text style={style}>{name}</Text>;
});

export default UserFullName;
