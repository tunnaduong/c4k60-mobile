import React from "react";
import { View, Text } from "react-native";
import axios from "axios";
import moment from "moment";

export default function LastChat({ user_from, user_to, type }) {
  const [lastChat, setLastChat] = React.useState([]);

  React.useEffect(() => {
    getLastChat();
  }, [user_from, user_to, type]);

  const getLastChat = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/chat/last-chat/?user_from=" +
          user_from +
          "&user_to=" +
          user_to +
          "&type=" +
          type
      );
      setLastChat(response.data);
      // console.log(new Error().stack, lastChat);
    } catch (err) {
      console.log(new Error().stack, err);
    }
  };

  const truncate = (input) =>
    input?.length > 20 ? `${input?.substring(0, 20)}...` : input;

  return (
    <View style={{ flexDirection: "row" }}>
      {user_from == lastChat[0]?.user_from && (
        <Text style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}>
          Bạn:{" "}
        </Text>
      )}

      <Text
        numberOfLines={1}
        style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}
      >
        {!lastChat[0]?.image_url ? truncate(lastChat[0]?.message) : "[Ảnh]"} ·{" "}
        {moment(lastChat[0]?.time)
          .fromNow()
          .replace("một", "1")
          .replace("trước", "")}
      </Text>
    </View>
  );
}
