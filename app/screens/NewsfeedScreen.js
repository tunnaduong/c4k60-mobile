import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserAvatar from "../components/UserAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import FeedPost from "../components/FeedPost";
import axios from "axios";

export default function NewsfeedScreen({ navigation, route }) {
  // get username from asyncstorage
  const [username, setUsername] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [page, setPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem("username");
        setUsername(username);
      } catch (error) {
        console.error(error);
      }
    };
    getUsername();
    fetchNewsfeed();
  }, []);

  const fetchNewsfeed = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/feed/list/"
      );
      setData(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNextPage = async () => {
    console.log("fetching next page");

    if (!hasMore || isFirstRender) {
      return;
    }

    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/feed/list/?page=" + page
      );
      if (response.data?.items.length === 0) {
        setHasMore(false);
        return;
      }

      setData((prevData) => [...prevData, ...response.data?.items]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const ListEndLoader = () => {
    if (hasMore) {
      // Show loader at the end of list when fetching next page data.
      return <ActivityIndicator size={"large"} />;
    }
  };

  return (
    <>
      {data == null ? (
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
            data={data}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.7}
            onContentSizeChange={() => setIsFirstRender(false)}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListFooterComponent={ListEndLoader}
            renderItem={({ item }) => (
              <FeedPost
                username={item.username}
                name={item.author}
                caption={item.content}
                time={item.timeofpost}
                image={
                  item.has_image == "block"
                    ? "https://m-feed-c4k60.tunnaduong.com" + item.image
                    : null
                }
              />
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchNewsfeed();
                  setHasMore(true);
                  setPage(2);
                  setTimeout(() => {
                    setRefreshing(false);
                  }, 1000);
                }}
              />
            }
            ListHeaderComponent={
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
            }
          ></FlatList>
        </View>
      )}
    </>
  );
}
