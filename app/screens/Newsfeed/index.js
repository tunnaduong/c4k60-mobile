import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  FlatList,
} from "react-native";
import { storage } from "../../global/storage";
import UserAvatar from "../../components/UserAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { withBadge } from "react-native-elements";

export default function NewsfeedScreen({ navigation, route }) {
  const [feedData, setFeedData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);
  const username = storage.getString("username");

  React.useEffect(() => {
    fetchNewsfeed();
  }, []);

  const fetchNewsfeed = () => {
    axios.get("https://api.c4k60.com/v2.0/feed/list").then((response) => {
      setFeedData(response.data.items);
    });
  };

  const onEndReached = () => {
    if (!hasMore) return;

    axios
      .get("https://api.c4k60.com/v2.0/feed/list?page=" + currentPage)
      .then((response) => {
        if (response.data.items.length === 0) {
          setHasMore(false);
          return;
        }
        setFeedData((prevData) => {
          return [...prevData, ...response.data.items];
        });
        setCurrentPage((prevPage) => prevPage + 1);
      });
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          padding: 10,
          borderBottomWidth: 8,
          borderBottomColor: "#E6E6E6",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <UserAvatar
            username={item.author.username}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <Text
            style={{
              marginLeft: 10,
              fontWeight: "bold",
              fontSize: 16,
              color: "#333",
            }}
          >
            {item.author.name}
          </Text>
        </View>
        <Text style={{ marginTop: 10 }}>{item.content}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#333" }}>
            {new Date(item.timeofpost).toLocaleString()}
          </Text>
          <Ionicons name="heart" size={20} color="#333" />
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "white",
          borderBottomWidth: 8,
          borderBottomColor: "#E6E6E6",
        }}
      >
        <UserAvatar
          username={username}
          style={{ width: 40, height: 40, borderRadius: 25 }}
        ></UserAvatar>
        <Text style={{ fontSize: 16, marginLeft: 10, flex: 1 }}>
          Bạn đang nghĩ gì?
        </Text>
        <Ionicons
          name="images"
          size={22}
          color={"#36BF2D"}
          style={{ marginRight: 7 }}
        ></Ionicons>
      </View>
    );
  };

  const ListEndLoader = () => {
    if (hasMore) {
      return (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator />
        </View>
      );
    }
  };

  return feedData == null ? (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 400,
      }}
    >
      <ActivityIndicator size={"large"} color="#636568" />
      <Text style={{ marginTop: 15 }}>Đang tải bảng tin...</Text>
    </View>
  ) : (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <FlatList
        data={feedData}
        keyExtractor={(item, index) => `key-${index}`}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              fetchNewsfeed();
              setHasMore(true);
              setCurrentPage(2);
              setTimeout(() => {
                setRefreshing(false);
              }, 1000);
            }}
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={ListEndLoader}
      />
    </View>
  );
}
