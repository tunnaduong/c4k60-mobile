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
} from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatRoom({ route, navigation }) {
  const ws = new WebSocket("ws://103.81.85.224:6996");
  const [messages, setMessages] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    getData();
    getMessages();
    connectWebsocket();
    return () => {
      console.log("unmount");
      ws.close();
    };
  }, []);

  const connectWebsocket = () => {
    ws.onopen = () => {
      console.log("connected");
      //   ws.send(
      //     JSON.stringify({
      //       type: "online",
      //       data: {
      //         username: username,
      //       },
      //     })
      //   );
    };
    // ws.onmessage = (e) => {
    //   const message = JSON.parse(e.data);
    //   console.log(message);
    // };
    ws.onerror = (e) => {
      console.log(e.message);
    };
    ws.onclose = (e) => {
      console.log("connection closed");
    };
  };

  const getMessages = async () => {
    try {
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);
        setMessages((prev) => [...prev, message.data]);
      };
      const user_to =
        route.params.type == "group" ? "class_group" : route.params.username;
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/chat/messages/?user_to=" +
          user_to
      );
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const username = await AsyncStorage.getItem("username");
    if (username !== null) {
      setUsername(username);
    }
  };

  const sendMessage = async () => {
    try {
      ws.send(
        JSON.stringify({
          type: "message",
          data: {
            user_from: username,
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
        "https://c4k60.tunnaduong.com/api/v1.0/chat/messages/",
        {
          user_from: username,
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
        keyboardVerticalOffset={100}
      >
        <ScrollView>
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
                    flexDirection: "row",
                    width: "60%",
                    alignSelf:
                      item.user_from == username ? "flex-end" : "flex-start",
                    backgroundColor:
                      item.user_from == username ? "#2761FF" : "#EBEBEB",
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: item.user_from == username ? "white" : "black",
                      padding: 7,
                      fontSize: 16,
                    }}
                  >
                    {item.message}
                  </Text>
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
