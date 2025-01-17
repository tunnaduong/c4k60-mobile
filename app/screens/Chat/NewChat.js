import React from "react";
import {
  View,
  ScrollView,
  Text,
  RefreshControl,
  Pressable,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { List } from "react-native-paper";
import axios from "axios";
import UserAvatar from "../../components/UserAvatar";
import { storage } from "../../global/storage";

export default function NewChat({ navigation, route }) {
  const [memberList, setMemberList] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const username = storage.getString("username");

  React.useEffect(() => {
    getMemberList();
  }, []);

  const getMemberList = async () => {
    try {
      const response = await axios.get("https://api.c4k60.com/v2.0/users/list");
      setMemberList(response.data);
      return response.data;
    } catch (err) {
      console.log(new Error().stack, err);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          backgroundColor: "#f2f2f2",
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 5,
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ color: "gray" }}>Đến:</Text>
        <TextInput
          style={{ padding: 10, fontSize: 16, flex: 1 }}
          autoFocus={true}
          autoCapitalize="words"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {memberList == null ? (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
            }}
          >
            <ActivityIndicator size={"large"} color="#636568" />
            <Text style={{ marginTop: 15 }}>
              Đang tải danh sách thành viên lớp...
            </Text>
          </View>
        ) : (
          memberList
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item, index) => (
              <List.Item
                key={index}
                title={item.name}
                onPress={() => {
                  navigation.replace("ChatRoom", {
                    ws: route.params.ws,
                    user_from: username,
                    username: item.username,
                    name: item.name,
                    type: "private",
                  });
                }}
                titleStyle={{ fontSize: 16, fontWeight: "600" }}
                left={() => (
                  <UserAvatar
                    username={item.username}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                      marginRight: 5,
                    }}
                  />
                )}
              />
            ))
        )}
      </ScrollView>
    </View>
  );
}
