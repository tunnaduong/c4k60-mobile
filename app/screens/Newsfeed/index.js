import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  FlatList,
  Image,
} from "react-native";
import { storage } from "../../global/storage";
import UserAvatar from "../../components/UserAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { withBadge } from "react-native-elements";
import moment from "moment";
import { TouchableRipple } from "react-native-paper";
import PostItem from "../../components/PostItem";

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
          borderBottomWidth: 8,
          borderBottomColor: "#E6E6E6",
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <UserAvatar
            username={item.author.username}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "#333",
              }}
            >
              {item.author.name}
            </Text>
            <Text style={{ fontSize: 14, color: "#A9A9A9" }}>
              {moment(item.timeofpost, "YYYY-MM-DD h:m:s").fromNow()}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 17, marginHorizontal: 10, marginBottom: 10 }}>
          {item.content}
        </Text>
        {item.image == "" ? null : (
          <Image
            source={{ uri: "https://api.c4k60.com/storage/feed/" + item.image }}
            style={{ width: "100%", height: 300 }}
          ></Image>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "white",
            padding: 4,
            gap: 4,
          }}
        >
          <TouchableRipple
            rippleColor="rgba(0, 0, 0, .2)"
            onPress={() => {}}
            style={{
              padding: 5,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              backgroundColor: "white",
            }}
          >
            <>
              <Ionicons
                name={"heart-outline"}
                size={22}
                color={"#8B8D95"}
                style={{ marginRight: 7 }}
              ></Ionicons>
              <Text style={{ color: "#8B8D95" }}>Thích</Text>
            </>
          </TouchableRipple>
          <TouchableRipple
            rippleColor="rgba(0, 0, 0, .2)"
            onPress={() => {}}
            style={{
              padding: 5,
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 6,
            }}
          >
            <>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={22}
                color={"#8B8D95"}
                style={{ marginRight: 7 }}
              ></Ionicons>
              <Text style={{ color: "#8B8D95" }}>Bình luận</Text>
            </>
          </TouchableRipple>
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
        keyExtractor={(item, index) => `key-${item.id}`}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => <PostItem item={item} />}
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
