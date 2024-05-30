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

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function NotificationScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  // const translateX = new Animated.Value(0);
  // const opacity = new Animated.Value(0);
  const prevScreen = route.params.previous_screen;
  const [refreshing, setRefreshing] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [notifications, setNotifications] = React.useState([{}, {}, {}]);
  const [skeleton, setSkeleton] = React.useState(false);

  // const fadeIn = (from) => {
  //   translateX.setValue(from == "right" ? 150 : -150);
  //   // opacity.setValue(0.1);

  //   Animated.parallel([
  //     createAnimation(translateX, 150, Easing.inout, null, 0),
  //     // createAnimation(opacity, 200, Easing.inout, null, 1),
  //   ]).start();
  // };

  React.useState(() => {
    setSkeleton(true);
    setTimeout(() => {
      setSkeleton(false);
    }, 1500);
  }, []);

  // React.useEffect(() => {
  //   if (isFocused && prevScreen != "NotiScreen") {
  //     if (
  //       prevScreen == "HomeScreen" ||
  //       prevScreen == "NewsfeedScreen" ||
  //       prevScreen == "ChatScreen"
  //     ) {
  //       fadeIn("right");
  //     } else {
  //       fadeIn("left");
  //     }
  //   }
  //   setTimeout(() => {
  //     setFilter("all");
  //   }, 200);
  // }, [route]);

  let A = [];
  let B = [
    {
      id: 18,
      title: "Nhắc đi họp lớp chiều mùng 3/9",
      content:
        "Hmm hello anh em :))) để thử nghiệm thử khả năng truyền tải thông báo lớp qua app của tui thì nay tui nhắc luôn mn chiều hôm nay (03/09/2022) lúc 3h anh em tập trung tại cổng trường để đi cafe tại Monolic nkaaaa 😘",
      createdBy: "Dương Tùng Anh",
      image: [
        {
          img_id: 1,
          url: "https://c4k60.com/assets/images/cafe_hong.jpeg",
        },
      ],
      date: "2022-09-03 10:46:19",
    },
    {
      id: 14,
      title: "Tùng Anh đẹp trai vcl",
      content: "Nhỉ?? :)))) ai cũng phải công nhận",
      createdBy: "Admin C4K60",
      image: [
        {
          img_id: 1,
          url: "https://c4k60.com/anhvavideo/media/original/%E1%BA%A2nh%20k%E1%BB%B7%20y%E1%BA%BFu/217707980348167410533151108516773PHQ_2379-min.jpg",
        },
      ],
      date: "2021-12-11 21:24:23",
    },
    {
      id: 12,
      title: "Thu quần áo thuê chụp",
      content:
        "Ra chơi tiết 1 ngày mai t sẽ thu từng người từng bộ qao cmay thuê để chiều mai ship trả cho studio, ai thiếu đồ gì sẽ phải đền bù cho bên đó nhé",
      createdBy: "Ngô Phương Anh",
      image: [
        {
          img_id: 1,
          url: "no",
        },
      ],
      date: "2021-01-23 21:02:51",
    },
    {
      id: 11,
      title: "Lịch trình buổi chụp ",
      content:
        "7-10h chụp ở trường\n10h-12h mng tự túc ăn trưa và nghỉ ngơi\n12h15 lên xe di chuyển đến vườn nhãn Long Biên\n14h-16h15 chụp tại vườn nhãn\n16h30 lên xe về Phủ Lý\n19h chụp party night tại Vinpearl\nMng đọc để nắm lịch và xin phép bố mẹ nhé",
      createdBy: "Ngô Phương Anh",
      image: [
        {
          img_id: 1,
          url: "no",
        },
      ],
      date: "2021-01-23 20:58:59",
    },
    {
      id: 10,
      title: "Nộp tiền chụp kỷ yếu",
      content:
        "Tiền chụp kỉ yếu là 495k/ người lớp sẽ dc trừ 2tr tổng bill nhưng t nghĩ tiền đó cứ để hội phụ huynh cầm vì mình cũng phải bỏ tiền để thuê xe lên Hà Nội chụp và tiền đặt bánh ở Vincom nữa.\nMọi người xin phép phụ huynh chụp kỉ yếu và nộp tiền từ tuần sau nhé, có thể chuyển khoản luôn cho cô Thảo thủ quỹ nhá ( bạn nữ nào ko mặc áo dài của bên chụp thì trừ đi 30k )",
      createdBy: "Ngô Phương Anh",
      image: [
        {
          img_id: 1,
          url: "no",
        },
      ],
      date: "2021-01-23 20:57:39",
    },
  ];
  let C = [];

  return (
    <>
      <SectionList
        style={{
          height: "100%",
          backgroundColor: "white",
          flex: 1,
        }}
        sections={[
          {
            title: "Mới nhất",
            data: A,
          },
          {
            title: "Từ ban cán sự lớp",
            action: () => {
              Alert.alert("Chưa có gì đâu hihi ^^");
            },
            data: B,
          },
          {
            title: "Dành cho bạn",
            data: C,
          },
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
        data={notifications}
        renderItem={({ item }) => (
          <View key={item.id}>
            {!skeleton ? (
              <TouchableHighlight
                underlayColor={"rgba(0,0,0,0.1)"}
                onPress={!item.action ? () => null : item.action}
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
                        className="font-bold text-[15px]"
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
