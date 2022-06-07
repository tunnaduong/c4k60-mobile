import React from "react";
import Carousel from "react-native-carousel-view";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";

export default class HomeScreenCarousel extends React.Component {
  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.container}>
          <Carousel
            indicatorColor="#007AFF"
            width={
              Platform.OS === "web"
                ? Dimensions.get("screen").width > 500
                  ? 720
                  : 375
                : Dimensions.get("window").width - 30
            }
            height={
              Platform.OS === "web"
                ? Dimensions.get("screen").width > 500
                  ? 400
                  : 200
                : 200 - 25
            }
            delay={3000}
            indicatorSize={
              Platform.OS === "ios" || Platform.OS === "web" ? 12 : 20
            }
            indicatorOffset={Platform.OS === "ios" ? -20 : -3}
          >
            <View style={styles.contentContainer}>
              <Image
                source={require("../assets/1.jpeg")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 720
                        : 375
                      : Dimensions.get("window").width,
                  height:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 400
                        : 200
                      : 200,
                }}
              />
              <Image
                source={require("../assets/black-fade.png")}
                style={{
                  position: "absolute",
                  width: Dimensions.get("screen").width,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Chào mừng đến với C4K60 Mobile
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  App di động đầu tiên dành cho học sinh chuyên Nga K60 Chuyên
                  Biên Hòa.
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Image
                source={require("../assets/2.jpeg")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 720
                        : 375
                      : Dimensions.get("window").width,
                  height:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 400
                        : 200
                      : 200,
                }}
              />
              <Image
                source={require("../assets/black-fade.png")}
                style={{
                  position: "absolute",
                  width: Dimensions.get("screen").width,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Nhanh, gọn, tiện lợi
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Đó là những từ có thể dùng để miêu tả cho ứng dụng này.
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Image
                source={require("../assets/3.jpeg")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 720
                        : 375
                      : Dimensions.get("window").width,
                  height:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 400
                        : 200
                      : 200,
                }}
              />
              <Image
                source={require("../assets/black-fade.png")}
                style={{
                  position: "absolute",
                  width: Dimensions.get("screen").width,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Không bao giờ bỏ lỡ thông tin
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Không phải mất thời gian truy cập web lớp là một trong những
                  lợi ích mà C4K60 Mobile mang lại.
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Image
                source={require("../assets/4.jpeg")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 720
                        : 375
                      : Dimensions.get("window").width,
                  height:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 400
                        : 200
                      : 200,
                }}
              />
              <Image
                source={require("../assets/black-fade.png")}
                style={{
                  position: "absolute",
                  width: Dimensions.get("screen").width,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Kết nối thầy cô và bạn bè
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Gắn kết mọi người trong tập thể lớp và giáo viên với nhau, dù
                  ở bất kỳ nơi đâu. Đó là tiêu chí hoạt động của app C4K60.
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Image
                source={require("../assets/5.jpeg")}
                style={{
                  width:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 720
                        : 375
                      : Dimensions.get("window").width,
                  height:
                    Platform.OS === "web"
                      ? Dimensions.get("screen").width > 500
                        ? 400
                        : 200
                      : 200,
                }}
              />
              <Image
                source={require("../assets/black-fade.png")}
                style={{
                  position: "absolute",
                  width: Dimensions.get("screen").width,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Và còn nhiều tính năng khác...
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    textShadowColor: "rgba(0, 0, 0, 1)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 4,
                  }}
                >
                  Hãy tự mình khám phá nhé! Chúc bạn có một trải nghiệm thú vị.
                </Text>
              </View>
            </View>
          </Carousel>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  contentContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
});
