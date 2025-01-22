import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import UserAvatar from "../../components/UserAvatar";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import CommentChat from "../../components/CommentChat";
import { storage } from "../../global/storage";
import { TouchableRipple } from "react-native-paper";
import { useHeaderHeight } from "@react-navigation/elements";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const Comment = ({ route, navigation }) => {
  const [item, setItem] = useState(route.params.item);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes.length);
  const [image, setImage] = useState(null);
  const username = storage.getString("username");
  const commentInputRef = useRef(null);
  const height = useHeaderHeight();
  const userFullname = storage.getString("name");

  useEffect(() => {
    const checkIfLiked = () => {
      const userLiked = item.likes.some(
        (like) => like.liked_username === username
      );
      setLiked(userLiked);
      setLikeCount(item.likes.length);
    };

    checkIfLiked();
  }, [item.likes, username]);

  const focusCommentInput = () => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShadowVisible: false,
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" color="black" size={30} />
          </TouchableOpacity>

          <UserAvatar
            username={route.params.username}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              resizeMode: "cover",
            }}
          />

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {route.params.name}
            </Text>
            <Text style={{ fontSize: 12, color: "#A9A9A9" }}>
              {moment(route.params.timeofpost, "YYYY-MM-DD h:m:s").fromNow()}
            </Text>
          </View>
        </View>
      ),
    });
  });

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

  function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${
      random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
    }`;
  }

  const onSubmit = () => {
    // console.log("Submitted", commentText);
    if (!commentText && !image) {
      return;
    }
    setCommentText("");
    setImage(null);

    let formData = new FormData();
    formData.append("content", commentText);
    formData.append("post_id", item.id);
    formData.append("username", username);

    console.log("Image:", image);

    let img = null;

    if (image) {
      const uri = image;
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageName = `feed_comment_${image.split("/").pop()}`;
      console.log("uriParts:", uriParts);
      console.log("fileType:", fileType);
      console.log("imageName:", imageName);
      formData.append("image", {
        uri: image,
        name: imageName,
        type: `image/${fileType}`,
      });
      img = imageName;
    }

    // console.log("Form Data:", formData);

    console.log("img name:", img);

    fetch("https://api.c4k60.com/v2.0/feed/comments/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setItem((prevItem) => {
          return {
            ...prevItem,
            comments: [
              {
                id: uniqid(),
                username,
                content: commentText == "" ? null : commentText,
                image: image ? img : null,
                created_at: new Date(
                  new Date().getTime() + 7 * 60 * 60 * 1000
                ).toISOString(),
                user: {
                  name: userFullname,
                },
              },
              ...prevItem.comments,
            ],
          };
        });
      })
      .catch((error) => {
        console.error("Error2:", error);
      });

    // axios
    //   .post("https://api.c4k60.com/v2.0/feed/comments/add", formData)
    //   .then((response) => {
    //     console.log(response.data);
    //     setItem((prevItem) => {
    //       return {
    //         ...prevItem,
    //         comments: [
    //           {
    //             username,
    //             content: commentText,
    //             image: image ? "feed_comment_" + image.split("/").pop() : null,
    //             created_at: new Date(
    //               new Date().getTime() + 7 * 60 * 60 * 1000
    //             ).toISOString(),
    //             user: {
    //               name: userFullname,
    //             },
    //           },
    //           ...prevItem.comments,
    //         ],
    //       };
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  };

  const onUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      focusCommentInput();
    }
  };

  return (
    <>
      <ScrollView>
        <Text style={{ fontSize: 17, margin: 10 }}>{item.content}</Text>
        {item.image == "" || item.image == null ? null : (
          <Image
            source={{ uri: "https://api.c4k60.com/storage/feed/" + item.image }}
            style={{ width: "100%", height: 300 }}
          ></Image>
        )}
        {(likeCount > 0 || item.comments.length > 0) && (
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
            {likeCount > 0 && (
              <>
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
              </>
            )}
            <View style={{ flex: 1 }}></View>
            {item.comments.length == 0 ? null : (
              <View
                style={{
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#8E9098",
                  }}
                >
                  {item.comments.length} bình luận
                </Text>
              </View>
            )}
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
              <Text style={{ color: liked ? "#FC6D6C" : "#8B8D95" }}>
                Thích
              </Text>
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="rgba(0, 0, 0, .2)"
            onPress={focusCommentInput}
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
        <View>
          {/* Comments section */}
          {item.comments.map((comment, index) => (
            <View
              key={`key-${comment.id}`}
              style={{
                flexDirection: "row",
                padding: 10,
              }}
            >
              <UserAvatar
                username={comment.username}
                containerStyle={{ height: 40 }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              ></UserAvatar>
              <View>
                <View
                  style={{
                    marginLeft: 10,
                    borderRadius: 15,
                    backgroundColor: "#F6F6F6",
                    padding: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    {comment.user.name}
                  </Text>
                  {comment.content !== null && (
                    <Text style={{ fontSize: 16 }}>{comment.content}</Text>
                  )}
                  {comment.image !== null && (
                    <Image
                      source={{
                        uri:
                          "https://api.c4k60.com/storage/comments/" +
                          comment.image,
                      }}
                      style={{
                        width: 200,
                        height: 150,
                        borderRadius: 5,
                        marginTop: 10,
                      }}
                    ></Image>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#A9A9A9",
                    marginLeft: 20,
                    marginTop: 5,
                  }}
                >
                  {moment(comment.created_at, "YYYY-MM-DD h:m:s")
                    .fromNow()
                    .replace(" trước", "")
                    .replace("một", "1")}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      {image && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 15,
            borderTopColor: "#ccc",
            borderTopWidth: 0.7,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Image
            source={{ uri: image }}
            style={{ width: 80, height: 80, borderRadius: 5 }}
          ></Image>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
            }}
            style={{ position: "absolute", zIndex: 9, right: 5, top: 5 }}
          >
            <Ionicons name="close-outline" size={23}></Ionicons>
          </TouchableOpacity>
        </View>
      )}
      <CommentChat
        ref={commentInputRef}
        username={username}
        placeholderText={"Nhập bình luận..."}
        onSubmit={onSubmit}
        value={commentText}
        onChangeText={setCommentText}
        onUpload={onUpload}
        disabled={!commentText && !image}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={height - 15}
        behavior="padding"
      />
    </>
  );
};

export default Comment;
