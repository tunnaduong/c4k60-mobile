import React from "react";
import {
  View,
  SectionList,
  Image,
  Text,
  TouchableHighlight,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
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
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { storage } from "../global/storage";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function NotificationScreen({ navigation, route }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [skeleton, setSkeleton] = React.useState(true);
  const [B, setB] = React.useState([]);

  React.useState(() => {
    setTimeout(() => {
      setSkeleton(false);
    }, 1500);

    axios
      .get("https://api.c4k60.com/v2.0/notification/list?show=all")
      .then((response) => {
        setB(response.data.results);
      });
  }, []);

  let A = [];
  let C = [];

  return (
    <>
      <SectionList
        style={{
          height: "100%",
          backgroundColor: "white",
          flex: 1,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        sections={[
          ...(A.length > 0 ? [{ title: "Mới nhất", data: A }] : []),
          ...(B.length > 0
            ? [
                {
                  title: "Từ ban cán sự lớp",
                  data: B,
                  action: () => Alert.alert("Chưa có gì đâu hihi ^^"),
                },
              ]
            : []),
          ...(C.length > 0 ? [{ title: "Dành cho bạn", data: C }] : []),
        ]}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 &&
          !skeleton && (
            <>
              <View className="p-4 pb-3 flex-row justify-between pt-2 mb-2 bg-white">
                <Text className="font-bold text-[17px]">{section.title}</Text>
                {section.action && (
                  <TouchableOpacity onPress={section.action}>
                    <View>
                      <Text className="text-[15px] text-blue-600">
                        Xem tất cả
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )
        }
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
            <View className="flex-row gap-x-2 mx-2 mb-3 mt-2">
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
        data={B}
        keyExtractor={(item, index) => `key-${item.id}`}
        renderItem={({ item }) => (
          <View>
            {!skeleton ? (
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.1)"}
                onPress={() => {
                  if (storage.getString("username") == "test") {
                    return Alert.alert(
                      "Chức năng này không khả dụng trong chế độ xem trước."
                    );
                  }
                  navigation.navigate("NotiScreen", {
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    date: item.date,
                    by: item.createdBy,
                    image: item.image,
                  });
                }}
              >
                <View key={item.id} className="px-4">
                  <View className="mb-1.5 py-1.5 flex-row">
                    <View>
                      {item.image[0].url != "no" ? (
                        <View className="rounded-full border-gray-300/50 border-[1px]">
                          <Image
                            source={{ uri: item.image[0].url }}
                            className="aspect-square w-16 h-16 rounded-full"
                          />
                        </View>
                      ) : (
                        <View className="rounded-full border-gray-300/50 border-[1px]">
                          <Image
                            source={require("../assets/notify.png")}
                            className="aspect-square h-16 w-16 rounded-full"
                          />
                        </View>
                      )}
                      <View
                        className="absolute bg-slate-600 rounded-full p-1 bottom-0 right-0"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        <Ionicons
                          name="notifications"
                          size={18}
                          color="white"
                        />
                      </View>
                    </View>
                    <View className="ml-2 justify-center">
                      <Text
                        numberOfLines={1}
                        lineBreakMode={"tail"}
                        className="font-bold text-[15px] w-[240px]"
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{ width: screenWidth - 150 }}
                        numberOfLines={2}
                        lineBreakMode={"tail"}
                      >
                        {item.content}
                      </Text>
                    </View>
                    <View className="ml-3 justify-center">
                      <Ionicons name="ellipsis-horizontal" size={23} />
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            ) : (
              <View className="px-4">
                <View className="border-t-[0.7px] border-gray-200 py-4">
                  {Array(1)
                    .fill(null)
                    .map(() => (
                      <Placeholder
                        Animation={ShineOverlay}
                        Left={PlaceholderMedia}
                        key={Math.random()}
                      >
                        <PlaceholderLine width={80} />
                        <PlaceholderLine />
                        <PlaceholderLine width={30} />
                      </Placeholder>
                    ))}
                </View>
              </View>
            )}
          </View>
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
              Array(7)
                .fill(null)
                .map(() => (
                  <View className="px-4" key={Math.random()}>
                    <View className="border-t-[0.7px] border-gray-200 py-4">
                      <Placeholder
                        Animation={ShineOverlay}
                        Left={PlaceholderMedia}
                      >
                        <PlaceholderLine width={80} />
                        <PlaceholderLine />
                        <PlaceholderLine width={30} />
                      </Placeholder>
                    </View>
                  </View>
                ))
            )}
          </>
        }
      />
    </>
  );
}
