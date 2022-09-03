import React from "react";
import {
  View,
  ScrollView,
  Animated,
  Image,
  Easing,
  Text,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import createAnimation from "../utils/createAnimation";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  ShineOverlay,
} from "rn-placeholder";

export default function NotificationScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const translateX = new Animated.Value(0);
  const opacity = new Animated.Value(0);
  const prevScreen = route.params.previous_screen;
  const [refreshing, setRefreshing] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [notifications, setNotifications] = React.useState([]);
  const [skeleton, setSkeleton] = React.useState(false);

  const fadeIn = (from) => {
    translateX.setValue(from == "right" ? 150 : -150);
    opacity.setValue(0.1);

    Animated.parallel([
      createAnimation(translateX, 150, Easing.inout, null, 0),
      createAnimation(opacity, 200, Easing.inout, null, 1),
    ]).start();
  };

  React.useState(() => {
    setSkeleton(true);
    setTimeout(() => {
      setSkeleton(false);
    }, 1500);
  }, []);

  React.useEffect(() => {
    if (isFocused && prevScreen != "NotiScreen") {
      if (
        prevScreen == "HomeScreen" ||
        prevScreen == "NewsfeedScreen" ||
        prevScreen == "ChatScreen"
      ) {
        fadeIn("right");
      } else {
        fadeIn("left");
      }
    }
  }, [route]);
  return (
    <>
      <Animated.FlatList
        style={{
          height: "100%",
          transform: [{ translateX: translateX }],
          opacity: opacity,
          backgroundColor: "white",
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => {
                setRefreshing(false);
              }, 800);
              setSkeleton(true);
              setTimeout(() => {
                setSkeleton(false);
              }, 2500);
            }}
          />
        }
        ListHeaderComponent={
          <>
            <View className="flex-row gap-x-2 mx-2">
              <TouchableHighlight
                onPress={(e) => {
                  if (filter == "all") {
                    return null;
                  }
                  setFilter("all");
                  setSkeleton(true);
                  setTimeout(() => {
                    setSkeleton(false);
                  }, 1000);
                }}
                underlayColor={"rgba(0,0,0,0.5)"}
                className="rounded-full"
              >
                <View
                  className={`h-9 ${
                    filter == "all" ? "bg-blue-100" : "bg-gray-100"
                  } rounded-full items-center justify-center px-3`}
                >
                  <Text
                    className={`text-blue-600 ${
                      filter == "all" ? "text-blue-600" : "text-black"
                    } font-semibold text-[15px]`}
                  >
                    Tất cả
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  if (filter == "not_read") {
                    return null;
                  }
                  setFilter("not_read");
                  setSkeleton(true);
                  setTimeout(() => {
                    setSkeleton(false);
                  }, 1000);
                }}
                underlayColor={"rgba(0,0,0,0.5)"}
                className="rounded-full"
              >
                <View
                  className={`h-9 ${
                    filter == "not_read" ? "bg-blue-100" : "bg-gray-100"
                  } rounded-full items-center justify-center px-3`}
                >
                  <Text
                    className={`text-blue-600 ${
                      filter == "not_read" ? "text-blue-600" : "text-black"
                    } font-semibold text-[15px]`}
                  >
                    Chưa đọc
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </>
        }
        data={notifications}
        renderItem={({ item }) => (
          <>
            {/* show this after new notifications */}
            <View className="mx-4 mt-4 flex-row justify-between mb-2">
              <Text className="font-bold text-[16.5px]">Từ ban cán sự lớp</Text>
              <TouchableOpacity>
                <View>
                  <Text className="text-[15px] text-blue-600">Xem tất cả</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
        ListEmptyComponent={
          <>
            {!skeleton ? (
              <View className="mx-4 mt-24 items-center justify-center">
                <Image
                  source={require("../assets/notification-placeholder.png")}
                  className="aspect-square h-56"
                />
                <Text className="text-gray-500 text-lg font-medium">
                  Chưa có thông báo nào
                </Text>
              </View>
            ) : (
              <View className="px-4">
                <View className="border-t-[0.7px] border-gray-200 mt-3 py-4">
                  {Array(7)
                    .fill(null)
                    .map(() => (
                      <>
                        <Placeholder
                          Animation={ShineOverlay}
                          Left={PlaceholderMedia}
                        >
                          <PlaceholderLine width={80} />
                          <PlaceholderLine />
                          <PlaceholderLine width={30} />
                        </Placeholder>
                      </>
                    ))}
                </View>
              </View>
            )}
          </>
        }
      />
    </>
  );
}
