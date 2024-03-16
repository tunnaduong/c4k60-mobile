import React from "react";
import { View, ScrollView, Text, RefreshControl } from "react-native";
import { Image } from "expo-image";
import { TouchableRipple } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import updateLastActivity from "../../utils/updateLastActivity";
import UserAvatar from "../../components/UserAvatar";
import UserFullName from "../../components/UserFullName";

export default function ChatScreen({ navigation, route }) {
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const getOnlineUsers = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/chat/online/"
      );
      setOnlineUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const ws = new WebSocket("ws://103.81.85.224:6996");

  React.useEffect(() => {
    getData();
    getOnlineUsers();
    return () => {
      console.log("unmount");
      ws.close();
    };
  }, []);

  const getData = async () => {
    const username = await AsyncStorage.getItem("username");
    if (username !== null) {
      connectWebsocket(username);
      setUsername(username);
      updateLastActivity(username);
    }
  };

  const connectWebsocket = (username) => {
    ws.onopen = () => {
      console.log("connected");
      ws.send(
        JSON.stringify({
          type: "online",
          data: {
            username: username,
          },
        })
      );
    };
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      getOnlineUsers();
      console.log(message);
    };
    ws.onerror = (e) => {
      console.log(e.message);
    };
    ws.onclose = (e) => {
      console.log("connection closed");
    };
  };

  return (
    <>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: "white",
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                getOnlineUsers();
                updateLastActivity(username);
                setRefreshing(false);
              }, 800);
            }}
          />
        }
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 15,
            marginVertical: 10,
            flexDirection: "row",
            gap: 20,
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {onlineUsers
            .filter((user) => {
              var date = new Date();
              var check = 10 * 60 * 1000;
              return date - new Date(user.last_activity) < check;
            })
            .map((user, index) => {
              return (
                <View
                  key={index}
                  style={{ alignItems: "center", gap: 5, width: 65 }}
                >
                  <UserAvatar
                    username={user.username}
                    style={{ width: 68, height: 68, borderRadius: 35 }}
                  />
                  <View
                    style={{
                      backgroundColor: "#00BF00",
                      height: 18,
                      width: 18,
                      borderRadius: 10,
                      borderColor: "white",
                      borderWidth: 3,
                      position: "absolute",
                      bottom: 23,
                      right: 0,
                    }}
                  ></View>
                  <UserFullName
                    username={user.username}
                    numberOfLines={1}
                    type="last_name"
                  />
                </View>
              );
            })}
        </ScrollView>
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .2)"
          onPress={() => {}}
          style={{
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <>
            <Image
              source={require("../../assets/chat-nbb.jpeg")}
              style={{ height: 60, width: 60, borderRadius: 30 }}
            ></Image>
            <View style={{ marginLeft: 13 }}>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>
                Ngưng Bích Buildings :))))))
              </Text>
              <Text style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}>
                Bạn: Duma · 2 giờ
              </Text>
            </View>
          </>
        </TouchableRipple>
      </ScrollView>
    </>
  );
}
