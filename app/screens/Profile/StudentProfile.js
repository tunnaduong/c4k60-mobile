import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { List } from "react-native-paper";
import axios from "axios";
import UserAvatar from "../../components/UserAvatar";

export default function StudentProfile({ navigation }) {
  const [memberList, setMemberList] = React.useState(null);

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
        memberList.map((item, index) => (
          <List.Item
            key={index}
            title={item.name}
            onPress={() => {
              navigation.navigate("ProfileDetail", {
                name: item.name,
                username: item.username,
              });
            }}
            description={item.address}
            left={() => (
              <UserAvatar
                username={item.username}
                style={{ height: 50, width: 50, borderRadius: 25 }}
              />
            )}
          />
        ))
      )}
    </ScrollView>
  );
}
