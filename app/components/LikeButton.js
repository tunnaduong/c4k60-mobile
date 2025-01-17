import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { TouchableRipple } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

const LikeButton = ({ postId, userId, onLikeToggle }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial like state from the API
  useEffect(() => {
    fetchLikeStatus();
  }, []);

  const fetchLikeStatus = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `https://api.c4k60.com/v2.0/feed/likes/?id=${postId}&username=${userId}`
      );
      setLiked(response.data.items.length != 0);
    } catch (error) {
      console.error(new Error().stack, ("Error fetching like status:", error));
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.c4k60.com/v2.0/feed/likes/add/`,
        {
          method: liked ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            liked_post_id: postId,
            liked_username: userId,
          }),
        }
      );

      if (response.ok) {
        setLiked(!liked);
        // Call the reset function from the parent
        onLikeToggle();
      } else {
        console.error(new Error().stack, "Error toggling like status");
      }
    } catch (error) {
      console.error(new Error().stack, ("Error toggling like status:", error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .2)"
        onPress={toggleLike}
        disabled={loading}
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
            color={liked ? "#FB6C6B" : "#8B8D95"}
            style={{ marginRight: 7 }}
          ></Ionicons>
          <Text style={{ color: liked ? "#FB6C6B" : "#8B8D95" }}>Thích</Text>
        </>
      </TouchableRipple>
    </>
  );
};

export default LikeButton;
