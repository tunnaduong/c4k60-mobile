import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import UserAvatar from "./UserAvatar";
import { storage } from "../global/storage";

const PostItem = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes.length);
  const username = storage.getString("username");

  useEffect(() => {
    const checkIfLiked = () => {
      const userLiked = item.likes.some(
        (like) => like.liked_username === username
      );
      setLiked(userLiked);
    };

    checkIfLiked();
  }, [item.likes, username]);

  const handleLike = async () => {
    // Update the liked state immediately
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(newLiked ? likeCount + 1 : likeCount - 1);

    try {
      const response = await fetch(
        `https://api.c4k60.com/v2.0/feed/likes/add`,
        {
          method: liked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            liked_post_id: item.id,
            liked_username: username,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Error:", result.message);
        // Revert the liked state if API call fails
        setLiked(liked);
        setLikeCount(likeCount);
      }
    } catch (error) {
      console.error("Network Error:", error);
      // Revert the liked state if there's a network error
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  return (
    <View
      style={{
        borderBottomWidth: 8,
        borderBottomColor: "#E6E6E6",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <UserAvatar
          username={item.author.username}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: "#333",
            }}
          >
            {item.author.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#A9A9A9" }}>
            {moment(item.timeofpost, "YYYY-MM-DD h:m:s").fromNow()}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 17, marginHorizontal: 10, marginBottom: 10 }}>
        {item.content}
      </Text>
      {item.image == "" || item.image == null ? null : (
        <Image
          source={{ uri: "https://api.c4k60.com/storage/feed/" + item.image }}
          style={{ width: "100%", height: 300 }}
        ></Image>
      )}
      {likeCount > 0 && (
        <View
          style={{
            marginHorizontal: 12,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#E6E6E6",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="heart"
            size={22}
            color={"#FC6D6C"}
            style={{ marginRight: 5 }}
          ></Ionicons>
          <Text
            style={{
              fontSize: 14,
              color: "#8E9098",
            }}
          >
            {likeCount}
          </Text>
        </View>
      )}
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
          onPress={handleLike}
          //   disabled={loading}
          style={{
            padding: 5,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            backgroundColor: "white",
          }}
        >
          <>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={22}
              color={liked ? "#FC6D6C" : "#8B8D95"}
              style={{ marginRight: 7 }}
            ></Ionicons>
            <Text style={{ color: liked ? "#FC6D6C" : "#8B8D95" }}>Thích</Text>
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
};

export default PostItem;
