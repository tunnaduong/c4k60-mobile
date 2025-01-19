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
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function NewsfeedScreen({ navigation, route }) {
  const [feedData, setFeedData] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);
  const username = storage.getString("username");

  React.useEffect(() => {
    fetchNewsfeed();
  }, []);

  // check if screen is focused
  const isFocused = useIsFocused();

  // listen for isFocused, if useFocused changes
  // call the function that you use to mount the component.

  React.useEffect(() => {
    setTimeout(() => {
      isFocused && fetchNewsfeed();
    }, 1000);
  }, [isFocused]);

  const fetchNewsfeed = () => {
    console.log("fetching newsfeed");

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
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .1)"
          onPress={() => {
            navigation.navigate("CreatePost");
          }}
          style={{
            flex: 1,
            borderRadius: 10,
            height: 40,
            marginRight: 10,
            marginLeft: 5,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16, marginLeft: 5 }}>Bạn đang nghĩ gì?</Text>
        </TouchableRipple>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="images"
            size={22}
            color={"#36BF2D"}
            style={{ marginRight: 7 }}
          ></Ionicons>
        </TouchableOpacity>
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
