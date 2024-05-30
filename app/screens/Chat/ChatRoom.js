import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { storage } from "../../global/storage";
import UserAvatar from "../../components/UserAvatar";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import LoadingView from "../../components/LoadingView";
import { getUserFullName } from "../../utils/getUserFullName";

export default function ChatRoom({ route, navigation }) {
  const ws = route.params.ws;
  const expoPushToken = route.params.token;
  const [messages, setMessages] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState({});
  const scrollViewRef = React.useRef();

  React.useEffect(() => {
    getMessages();
    connectWebsocket();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={"black"} />
          </TouchableOpacity>
          {route.params.type == "group" ? (
            <Image
              source={require("../../assets/chat-nbb.jpeg")}
              style={{ height: 30, width: 30, borderRadius: 15 }}
            />
          ) : (
            <UserAvatar
              username={route.params.username}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
          )}

          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {route.params.name}
          </Text>
        </View>
      ),
    });
  });

  const connectWebsocket = () => {
    ws.onopen = () => {
      console.log("connected");
    };
    ws.onerror = (e) => {
      console.log(e.message);
    };
  };

  const getMessages = async () => {
    try {
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        // if (message.type != "message" && message.type != "image") return;
        setMessages((prev) => [...prev, message.data]);
      };
      const user_to =
        route.params.type == "group" ? "class_group" : route.params.username;
      const user_from = route.params.user_from;
      const response = await axios.get(
        "https://c4k60.com/api/v1.0/chat/messages/?user_to=" +
          user_to +
          "&user_from=" +
          user_from
      );
      setMessages(response.data);
    } catch (error) {
      console.log("getmsg", error);
    }
  };

  function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 1000 + Math.random() * 1000;
    const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
    return `${prefix}${id}${
      random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
    }`;
  }

  const sendMessage = async (messageType, image) => {
    try {
      if (messageType == "image") {
        const uri = image;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const imageName = `${uniqid(
          route.params.user_from + "_to_" + route.params.username,
          true
        )}.${fileType}`;

        const formData = new FormData();
        formData.append("user_from", route.params.user_from);
        formData.append(
          "user_to",
          route.params.type == "group" ? "class_group" : route.params.username
        );
        formData.append("type", route.params.type);
        formData.append("image", {
          uri,
          name: imageName,
          type: `image/${fileType}`,
        });

        setImageLoading((prev) => ({ ...prev, [imageName]: true }));

        const response = await axios.post(
          "https://c4k60.com/api/v1.0/chat/image/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Unset loading status for this image
        setImageLoading((prev) => {
          const newLoading = { ...prev };
          delete newLoading[imageName];
          return newLoading;
        });

        // Check if the Axios request was successful
        ws.send(
          JSON.stringify({
            type: "image",
            data: {
              user_from: route.params.user_from,
              user_to:
                route.params.type == "group"
                  ? "class_group"
                  : route.params.username,
              type: route.params.type,
              message: "",
              image_url: imageName, // send the image URL
            },
          })
        );

        console.log("image", response.data);
        return;
      }
      ws.send(
        JSON.stringify({
          type: "message",
          data: {
            user_from: route.params.user_from,
            message: message,
            user_to:
              route.params.type == "group"
                ? "class_group"
                : route.params.username,
            type: route.params.type,
          },
        })
      );
      const response = await axios.post(
        "https://c4k60.com/api/v1.0/chat/conversations/",
        {
          user_from: route.params.user_from,
          message: message,
          user_to:
            route.params.type == "group"
              ? "class_group"
              : route.params.username,
          type: route.params.type,
        }
      );
      console.log("conv", response.data);
      const fullName = await getUserFullName(route.params.user_from);
      console.log(fullName);
      const response2 = await axios.get(
        `https://c4k60.com/api/v1.0/notification/send/?to=${route.params.username}&title=${fullName}&body=${message}`
      );
      console.log("noti", response2.data);
    } catch (error) {
      console.log("converr", error);
    }
  };

  const formatTime = (time) => {
    return moment(time).format("hh:mm A");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      sendMessage("image", result.uri);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : -200}
      >
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: false })
          }
          contentContainerStyle={{
            marginTop: 10,
          }}
        >
          {messages == null ? (
            <>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 400,
                  width: "100%",
                }}
              >
                <ActivityIndicator size={"large"} color="#636568" />
                <Text style={{ marginTop: 15 }}>Đang tải tin nhắn...</Text>
              </View>
            </>
          ) : (
            messages.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection:
                      item.user_from == route.params.user_from
                        ? "row-reverse"
                        : "row",
                    alignItems: "center",
                    marginBottom: 10,
                    gap: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  {item.user_from != route.params.user_from && (
                    <UserAvatar
                      username={item.user_from}
                      style={{ height: 35, width: 35, borderRadius: 20 }}
                    />
                  )}
                  <View
                    style={{
                      alignSelf:
                        item.user_from == route.params.user_from
                          ? "flex-end"
                          : "flex-start",
                      backgroundColor: item.image_url
                        ? "white"
                        : item.user_from == route.params.user_from
                        ? "#2761FF"
                        : "#EBEBEB",
                      borderRadius: 10,
                      padding: 3,
                      maxWidth: "70%",
                    }}
                  >
                    {item.image_url ? (
                      <>
                        <Image
                          source={{
                            uri:
                              "https://c4k60.com/assets/images/chats/" +
                              item.image_url,
                          }}
                          style={{
                            aspectRatio: 3 / 4,
                            width: 150,
                            resizeMode: "cover",
                            borderRadius: 10,
                            margin: 5,
                          }}
                          onLoadStart={() =>
                            setImageLoading((prev) => ({
                              ...prev,
                              [item.image_url]: true,
                            }))
                          }
                          onLoadEnd={() =>
                            setImageLoading((prev) => {
                              const newLoading = { ...prev };
                              delete newLoading[item.image_url];
                              return newLoading;
                            })
                          }
                        />
                        {imageLoading[item.image_url] && <LoadingView />}
                      </>
                    ) : (
                      <Text
                        style={{
                          color:
                            item.user_from == route.params.user_from
                              ? "white"
                              : "black",
                          padding: 7,
                          fontSize: 13,
                        }}
                      >
                        {item.message}
                      </Text>
                    )}

                    <Text
                      style={{
                        textAlign:
                          item.user_from == route.params.user_from
                            ? "right"
                            : "left",
                        fontSize: 9,
                        color: item.image_url
                          ? "#aaa"
                          : item.user_from == route.params.user_from
                          ? "#EBEBEB"
                          : "gray",
                        marginLeft: 7,
                        marginRight: 7,
                        marginBottom: 3,
                      }}
                    >
                      {formatTime(item.time)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
        <View
          style={{
            backgroundColor: "#EBEBEB",
            height: 45,
            margin: 10,
            borderRadius: 25,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: "white",
              height: 35,
              width: 35,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              marginRight: 9,
            }}
          >
            <Ionicons name="camera" size={20} color="black" />
          </TouchableOpacity>
          <TextInput
            placeholder="Nhắn tin..."
            style={{ height: 45, flex: 1, fontSize: 16 }}
            value={message}
            onChangeText={setMessage}
            onFocus={() => {
              setTimeout(
                () => scrollViewRef.current?.scrollToEnd({ animated: true }),
                100
              );
            }}
            onSubmitEditing={() => {
              setMessage("");
              sendMessage();
            }}
          ></TextInput>
          <TouchableOpacity
            style={[
              {
                backgroundColor: "#2761FF",
                height: 35,
                width: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 5,
              },
              !message && { opacity: 0.4 },
            ]}
            disabled={!message}
            onPress={() => {
              // setMessages([...messages, message]);
              setMessage("");
              sendMessage();
            }}
          >
            <Ionicons name="paper-plane" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
