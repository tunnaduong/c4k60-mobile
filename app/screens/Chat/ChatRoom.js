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
  StyleSheet,
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
import {
  GiftedChat,
  InputToolbar,
  Send,
  Composer,
} from "react-native-gifted-chat";
import vi from "dayjs/locale/vi";

export default function ChatRoom({ route, navigation }) {
  const ws = route.params.ws;
  const expoPushToken = route.params.token;
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState({});
  const scrollViewRef = React.useRef();
  const [onlineUsers, setOnlineUsers] = React.useState([]);

  React.useEffect(() => {
    getMessages();
    connectWebsocket();
    getOnlineUsers();
  }, []);

  const getOnlineUsers = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/chat/online"
      );
      setOnlineUsers(response.data);
      console.log(
        "online us",
        onlineUsers.filter((user) => user.username == route.params.username)
      );
    } catch (error) {
      console.log(error);
    }
  };

  function getActivityStatus(lastActivityTime) {
    const currentTime = new Date();
    const lastActivity = new Date(lastActivityTime);
    const diffInMinutes = (currentTime - lastActivity) / (1000 * 60);

    if (lastActivityTime == null) {
      return "Đang hoạt động";
    }

    if (diffInMinutes < 10) {
      return "Đang hoạt động";
    } else {
      return "Hoạt động " + moment(lastActivityTime).fromNow();
    }
  }

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

          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {route.params.name}
            </Text>
            <Text style={{ fontSize: 12, color: "gray" }}>
              {getActivityStatus(
                onlineUsers?.filter(
                  (user) => user.username == route.params.username
                )[0]?.last_activity
              )}
            </Text>
          </View>
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
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data).data;

      // console.log("message", message);
      // Check if the message is intended for the current user
      if (
        message.user_to !== route.params.user_from &&
        message.user_from !== route.params.user_from &&
        message.user_to !== route.params.username &&
        message.user_from !== route.params.username
      ) {
        return; // Ignore messages not intended for or from the current user
      }
      setMessages((previousMessages) => [message, ...previousMessages]);
    };
  };

  const getMessages = async () => {
    try {
      const user_to =
        route.params.type == "group" ? "class_group" : route.params.username;
      const user_from = route.params.user_from;
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/chat/messages?user_to=" +
          user_to +
          "&user_from=" +
          user_from
      );
      setMessages(response.data);
      console.log(messages);
      console.log("getmsg2", messages);
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

  const sendMessage = async (messageType = "text", image) => {
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

        console.log("user_from", route.params.user_from);
        console.log(
          "user_to",
          route.params.type == "group" ? "class_group" : route.params.username
        );
        console.log("type", route.params.type);
        console.log("image", {
          uri,
          name: imageName,
          type: `image/${fileType}`,
        });

        setImageLoading((prev) => ({ ...prev, [imageName]: true }));

        const response = await axios.post(
          "https://api.c4k60.com/v2.0/chat/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("image", response.data);

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
              id: makeid(10),
              time: new Date(),
              user_from: route.params.user_from,
              user_to:
                route.params.type == "group"
                  ? "class_group"
                  : route.params.username,
              type: route.params.type,
              message: "",
              image_url: imageName, // send the image URL
              sent: 1,
            },
          })
        );

        console.log("image", response.data);
        return;
      }
    } catch (error) {
      if (error.config.url.includes("chat/image/")) {
        console.log("Error in image upload request:", error);
      } else if (error.config.url.includes("chat/conversations/")) {
        console.log("Error in chat conversations request:", error);
      } else if (error.config.url.includes("notification/send/")) {
        console.log("Error in notification send request:", error);
      } else {
        console.log("Unknown error:", error);
      }
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

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const _sendMessage = async (message) => {
    ws.send(
      JSON.stringify({
        type: "message",
        data: {
          id: makeid(10),
          user_from: route.params.user_from,
          time: new Date(),
          message: message[0].text,
          user_to:
            route.params.type == "group"
              ? "class_group"
              : route.params.username,
          type: route.params.type,
          sent: 1,
        },
      })
    );
    console.log(message);
    const response = await axios.post(
      "https://api.c4k60.com/v2.0/chat/conversations",
      {
        user_from: route.params.user_from,
        message: message[0].text,
        user_to:
          route.params.type == "group" ? "class_group" : route.params.username,
        type: route.params.type,
      }
    );

    console.log("conv", response.data);

    const fullName = await getUserFullName(route.params.user_from);
    console.log(fullName);
    const response2 = await axios.get(
      `https://api.c4k60.com/v2.0/notification/send?to=${route.params.username}&title=${fullName}&body=${message[0].text}`
    );
    console.log("noti", response2.data);
  };

  // Custom Composer for single-line text input
  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={styles.singleLineComposer}
        multiline={false} // Disable multiline to enforce single-line input
        placeholder="Nhắn tin..."
      />
    );
  };

  // Custom Input Toolbar
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={{ alignItems: "center" }}
      />
    );
  };

  // Custom Send Button
  const renderSend = (props) => {
    return (
      <Send {...props} disabled={!message}>
        <View
          style={[
            {
              backgroundColor: "#2761FF",
              height: 35,
              width: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              marginRight: -3,
            },
            !message && { opacity: 0.4 },
          ]}
        >
          <Ionicons name="paper-plane" size={20} color="white" />
        </View>
      </Send>
    );
  };

  // Custom Actions (e.g., attach image button)
  const renderActions = (props) => (
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
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <GiftedChat
        messages={messages?.map((message) => ({
          _id: message.id,
          createdAt: message.time,
          text: message.message,
          image:
            message.image_url != null
              ? "https://api.c4k60.com" + message.image_url
              : null,
          user: {
            _id: message.user_from,
            name: message.user_from,
            avatar: `https://api.c4k60.com/v2.0/users/avatar/${message.user_from}`,
          },
          sent: message.sent == 1,
          received: message.received == 1,
        }))}
        onSend={(newMessages) => {
          // setMessages((previousMessages) => [
          //   ...newMessages.map((message) => ({
          //     id: message._id,
          //     message: message.text,
          //     time: new Date(),
          //     user_from: route.params.user_from,
          //     user_to:
          //       route.params.type == "group"
          //         ? "class_group"
          //         : route.params.username,
          //     type: route.params.type,
          //     sent: 1,
          //   })),
          //   ...previousMessages,
          // ]);
          _sendMessage(newMessages);
        }}
        user={{
          _id: route.params.user_from,
        }}
        locale={vi}
        renderInputToolbar={renderInputToolbar} // Custom Input Toolbar
        renderSend={renderSend} // Custom Send Button
        renderActions={renderActions} // Custom Actions
        alwaysShowSend={true}
        onInputTextChanged={(text) => setMessage(text)}
        text={message}
        renderComposer={renderComposer}
      />
      {/* {Platform.OS === "android" && <KeyboardAvoidingView behavior="padding" />} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: "#EBEBEB",
    height: 45,
    margin: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  attachButton: {
    marginLeft: 10,
    marginBottom: 5,
    padding: 8,
  },
  singleLineComposer: {
    flex: 1,
    marginTop: 2,
    marginLeft: 0,
    maxHeight: 40, // Ensures it remains a single line
  },
});
