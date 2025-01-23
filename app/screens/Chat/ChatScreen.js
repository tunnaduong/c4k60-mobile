import React from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { TouchableRipple } from "react-native-paper";
import { storage } from "../../global/storage";
import axios from "axios";
import updateLastActivity from "../../utils/updateLastActivity";
import UserAvatar from "../../components/UserAvatar";
import UserFullName from "../../components/UserFullName";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

export default function ChatScreen({ navigation, route }) {
  const ws = route.params.ws;
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [conversation, setConversation] = React.useState([]);
  const [lastGroupChat, setLastGroupChat] = React.useState([]);
  const username = storage.getString("username");
  // React.useEffect(() => {
  //   console.log(">> in useEffect ", Math.random());
  //   getConversation();
  // });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("focus");
      getOnlineUsers();
    });

    // Call getOnlineUsers() when the component mounts
    getOnlineUsers();
    console.log("mount");

    // Clean up: remove the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    getOnlineUsers();
    getConversation();
    getLastGroupChat();
    updateLastActivity(username);
    const unsubscribe = navigation.addListener("focus", () => {
      getConversation();
      getLastGroupChat();
      //Put your Data loading function here instead of my loadData()
    });
    getLastGroupChat();
    getConversation();

    return unsubscribe;
  }, [navigation]);

  const getConversation = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/chat/home?username=" + username
      );
      setConversation(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLastGroupChat = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/chat/last-chat?type=group"
      );
      setLastGroupChat(response.data);
      // console.log("hehe", lastChat);
    } catch (err) {
      console.log("hihi", err);
    }
  };

  const getOnlineUsers = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/chat/online"
      );
      setOnlineUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getOnlineUsers();
    connectWebsocket();
    // return () => {
    //   console.log("unmount");
    //   ws.close();
    // };
  }, []);

  const connectWebsocket = () => {
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
      getConversation();
      console.log(message);
    };
    ws.onerror = (e) => {
      console.log(e.message);
    };
    ws.onclose = (e) => {
      console.log("connection closed");
    };
  };

  const checkTime = (time) => {
    var date = new Date();
    var check = 10 * 60 * 1000;
    return date - new Date(time) < check;
  };

  const truncate = (input) =>
    input?.length > 20 ? `${input?.substring(0, 20)}...` : input;

  return (
    <>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: "white",
          flex: 1,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={() => {
        //       getOnlineUsers();
        //       updateLastActivity(username);
        //     }}
        //   />
        // }
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
          <View style={{ alignItems: "center", gap: 5, width: 65 }}>
            <UserAvatar
              username={username}
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
              username={username}
              numberOfLines={1}
              type="last_name"
            />
          </View>
          {onlineUsers
            .filter((user) => {
              var date = new Date();
              var check = 10 * 60 * 1000;
              return date - new Date(user.last_activity) < check;
            })
            .map((user, index) => {
              if (user.username === username) return;

              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (user.username === username) return;
                    navigation.navigate("ChatRoom", {
                      ws: ws,
                      user_from: username,
                      username: user.username,
                      name: user.name,
                      type: "private",
                    });
                  }}
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
                  <Text>{user.lastname}</Text>
                </Pressable>
              );
            })}
        </ScrollView>
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .2)"
          onPress={() => {
            navigation.navigate("ChatRoom", {
              ws: ws,
              user_from: username,
              // username: "class_group",
              type: "group",
              name: "Ngưng Bích Buildings :)))))",
            });
          }}
          style={{
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
            backgroundColor: "#F4F4F4",
          }}
        >
          <>
            <View>
              <Image
                source={require("../../assets/chat-nbb.jpeg")}
                style={{ height: 60, width: 60, borderRadius: 30 }}
              ></Image>
              <View
                style={{
                  backgroundColor: "#00BF00",
                  height: 18,
                  width: 18,
                  borderRadius: 10,
                  borderColor: "#F4F4F4",
                  borderWidth: 3,
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              ></View>
            </View>

            <View style={{ marginLeft: 13, flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: "500" }}>
                Ngưng Bích Buildings :))))))
              </Text>
              <View style={{ flexDirection: "row" }}>
                {username == lastGroupChat[0]?.user_from && (
                  <Text
                    style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}
                  >
                    Bạn:{" "}
                  </Text>
                )}

                <Text
                  numberOfLines={1}
                  style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}
                >
                  {!lastGroupChat[0]?.image_url
                    ? truncate(lastGroupChat[0]?.message)
                    : "[Ảnh]"}{" "}
                  ·{" "}
                  {moment(lastGroupChat[0]?.time)
                    .fromNow()
                    .replace("một", "1")
                    .replace("trước", "")}
                </Text>
              </View>
            </View>
            <AntDesign
              name="pushpin"
              size={16}
              color="#929293"
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </>
        </TouchableRipple>
        {conversation.map((item, index) => {
          return (
            <TouchableRipple
              key={index}
              rippleColor="rgba(0, 0, 0, .2)"
              onPress={() => {
                navigation.navigate("ChatRoom", {
                  ws: ws,
                  user_from: username,
                  username: item.username,
                  name: item.name,
                  type: "private",
                });
              }}
              style={{
                padding: 15,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <>
                <View>
                  <Image
                    source={item?.avatar}
                    style={{ height: 60, width: 60, borderRadius: 30 }}
                  ></Image>
                  {checkTime(item?.last_activity) && (
                    <View
                      style={{
                        backgroundColor: "#00BF00",
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        borderColor: "white",
                        borderWidth: 3,
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                    ></View>
                  )}
                </View>

                <View style={{ marginLeft: 13 }}>
                  <Text style={{ fontSize: 17, fontWeight: "500" }}>
                    {item?.name}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    {item.username == item.last_chat.user_to && (
                      <Text
                        style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}
                      >
                        Bạn:{" "}
                      </Text>
                    )}

                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 16, marginTop: 5, color: "#8F8F90" }}
                    >
                      {!item.last_chat.image_url
                        ? truncate(item.last_chat.message)
                        : "[Ảnh]"}{" "}
                      ·{" "}
                      {moment(item.last_chat.time)
                        .fromNow()
                        .replace("một", "1")
                        .replace("trước", "")}
                    </Text>
                  </View>
                </View>
              </>
            </TouchableRipple>
          );
        })}
      </ScrollView>
    </>
  );
}
