import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React from "react";
import axios from "axios";
import { List } from "react-native-paper";
import UserAvatar from "../components/UserAvatar";

const IncomingBirthday = () => {
  const [birthday, setBirthday] = React.useState(null);

  React.useEffect(() => {
    getBirthday();
  }, [birthday]);

  const getBirthday = async () => {
    // Get the birthday of the user
    // axios get request
    // return the birthday
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/users/birthday?show=all"
      );
      setBirthday(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {birthday == null ? (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 400,
          }}
        >
          <ActivityIndicator size={"large"} color="#636568" />
          <Text style={{ marginTop: 15 }}>Đang tải danh sách sinh nhật...</Text>
        </View>
      ) : (
        birthday.map((item, index) =>
          item.daysleft == 0 ? (
            <View style={{ padding: 15, position: "relative" }}>
              <Image
                source={require("../assets/balloons.jpeg")}
                style={{
                  width: "100%",
                  height: 250,
                  borderRadius: 15,
                  zIndex: 0,
                }}
              ></Image>
              <View
                style={{
                  position: "absolute",
                  top: 60,
                  left: 0,
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <UserAvatar
                  username={item.username}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                  }}
                ></UserAvatar>
              </View>
              <Text
                style={{
                  position: "absolute",
                  top: 150,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: "800",
                  paddingHorizontal: 40,
                  color: "white",
                }}
              >
                Hôm nay là sinh nhật của {item.name} 🥳!
              </Text>
            </View>
          ) : (
            <List.Item
              title={item.name}
              description={item.birthday}
              key={index}
              onPress={() => {}}
              left={() => (
                <UserAvatar
                  username={item.username}
                  style={{ height: 50, width: 50, borderRadius: 30 }}
                />
              )}
              right={() => {
                return (
                  <View
                    style={{
                      width: 80,
                      backgroundColor: "#DFE4E2",
                      padding: 5,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        color: "#FF406F",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {item.daysleft}
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      ngày nữa
                    </Text>
                  </View>
                );
              }}
            />
          )
        )
      )}
    </ScrollView>
  );
};

export default IncomingBirthday;
