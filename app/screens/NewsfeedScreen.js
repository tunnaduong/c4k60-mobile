import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
  FlatList,
} from "react-native";
import { storage } from "../global/storage";
import UserAvatar from "../components/UserAvatar";
import Ionicons from "@expo/vector-icons/Ionicons";
import FeedPost from "../components/FeedPost";
import axios from "axios";
import LikeText from "../components/LikeText";

export default function NewsfeedScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [page, setPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);
  const [isFirstRender, setIsFirstRender] = React.useState(true);
  const username = storage.getString("username");
  const [screenState, setScreenState] = React.useState("initialState");

  const resetScreenState = () => {
    setScreenState("initialState");
  };

  React.useEffect(() => {
    fetchNewsfeed();
  }, []);

  const fetchNewsfeed = async () => {
    try {
      const response = await axios.get("https://c4k60.com/api/v1.0/feed/list/");
      setData(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNextPage = async () => {
    // console.log("-------");
    console.log("runnn", page);
    if (!hasMore || isFirstRender) {
      // setPage(2);
      return;
    }

    try {
      const response = await axios.get(
        "https://c4k60.com/api/v1.0/feed/list/?page=" + page
      );
      if (response.data?.items.length === 0) {
        setHasMore(false);
        return;
      }

      // Ensure response.data?.items is an array and handle errors
      setData((prevData) => {
        return [...prevData, ...response.data.items];
      });

      // Increment the page number
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
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
            extraData={data}
            onEndReached={fetchNextPage}
            onEndReachedThreshold={0.2}
            ListFooterComponent={ListEndLoader}
            onContentSizeChange={() => setIsFirstRender(false)}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <FeedPost
                key={new Date().getTime()}
                username={item.username}
                name={item.author}
                caption={item.content}
                time={item.timeofpost}
                image={
                  item.has_image == "block"
                    ? "https://c4k60.com/assets" + item.image
                    : null
                }
                likeText={
                  <LikeText key={new Date().getTime()} like_id={item.id} />
                }
                postId={item.id}
              />
            )}
            keyExtractor={(item, index) => item.id.toString()}
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true);
                  await fetchNewsfeed(); // Refresh feed
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
