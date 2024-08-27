import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import axios from "axios";
import { storage } from "../global/storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserFullName } from "../utils/getUserFullName";

const LikeText = ({ like_id }) => {
  const [likeText, setLikeText] = useState("");
  const username = storage.getString("username");

  useEffect(() => {
    getLike(like_id);
  }, [like_id]);

  const getLike = async (like_id) => {
    try {
      const response = await axios.get(
        "https://c4k60.com/api/v1.0/feed/likes/?id=" + like_id
      );
      getLikeText(username, response.data.items); // Adjust this based on your actual API response structure
    } catch (error) {
      console.error(error);
    }
  };

  const getLikeText = async (currentUser, usersWhoLiked) => {
    const othersCount = usersWhoLiked.length;
    const currentUserLiked = usersWhoLiked.some(
      (user) => user.liked_username === currentUser
    );

    if (currentUserLiked && othersCount === 1) {
      setLikeText("Bạn thích điều này");
      return;
    }

    if (currentUserLiked && othersCount > 0) {
      setLikeText(`Bạn và ${othersCount - 1} người khác thích điều này`);
      return;
    }

    if (!currentUserLiked && othersCount === 1) {
      setLikeText(
        `${await getUserFullName(
          usersWhoLiked[0].liked_username,
          "last_name"
        )} thích điều này`
      );
      return;
    }

    if (!currentUserLiked && othersCount > 1) {
      setLikeText(
        `${await getUserFullName(
          usersWhoLiked[0].liked_username,
          "last_name"
        )} và ${othersCount - 1} người khác thích điều này`
      );
      return;
    }
  };

  return (
    likeText && (
      <View style={styles.container} key={new Date().getTime()}>
        <Ionicons
          name="heart"
          size={22}
          color={"#FC6D6C"}
          style={{ marginRight: 5 }}
        ></Ionicons>
        <Text style={styles.text}>{likeText}</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#8E9098",
  },
});

export default LikeText;
