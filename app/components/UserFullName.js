import React from "react";
import { Text } from "react-native";
import axios from "axios";

const UserFullName = React.memo(function UserFullName({
  username,
  style,
  type = "full_name",
  numberOfLines,
}) {
  const [name, setName] = React.useState("");

  const getName = async () => {
    try {
      if (type == "full_name") {
        const response = await axios.post("https://c4k60.com/api/v1.0/users/", {
          username: username,
        });
        setName(response.data.info.full_name);
      } else {
        const response = await axios.post("https://c4k60.com/api/v1.0/users/", {
          username: username,
        });
        setName(response.data.info.last_name);
      }
    } catch (err) {}
  };

  getName();

  return (
    <Text numberOfLines={numberOfLines} style={style}>
      {name}
    </Text>
  );
});

export default UserFullName;
