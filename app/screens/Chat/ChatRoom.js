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
} from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { storage } from "../../global/storage";
import UserAvatar from "../../components/UserAvatar";

export default function ChatRoom({ route, navigation }) {
  const ws = route.params.ws;
  const [messages, setMessages] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const scrollViewRef = React.useRef();

  React.useEffect(() => {
    getMessages();
    connectWebsocket();
  }, []);

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
        if (message.type != "message") return;
        setMessages((prev) => [...prev, message.data]);
      };
      const user_to =
        route.params.type == "group" ? "class_group" : route.params.username;
      const user_from = route.params.user_from;
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/chat/messages/?user_to=" +
          user_to +
          "&user_from=" +
          user_from
      );
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
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
        "https://c4k60.tunnaduong.com/api/v1.0/chat/conversations/",
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
      console.log(response.data);
    } catch (error) {
      console.log(error);
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
            scrollViewRef.current.scrollToEnd({ animated: true })
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
                      flexDirection: "row",
                      alignSelf:
                        item.user_from == route.params.user_from
                          ? "flex-end"
                          : "flex-start",
                      backgroundColor:
                        item.user_from == route.params.user_from
                          ? "#2761FF"
                          : "#EBEBEB",
                      borderRadius: 20,
                      padding: 3,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          item.user_from == route.params.user_from
                            ? "white"
                            : "black",
                        padding: 7,
                        fontSize: 16,
                      }}
                    >
                      {item.message}
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
