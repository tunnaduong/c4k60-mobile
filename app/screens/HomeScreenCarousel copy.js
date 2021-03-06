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

export default function HomeScreenCarousel({ style }) {
  return (
    <View style={style}>
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
                Ch??o m???ng ?????n v???i C4K60 Mobile
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
                App di ?????ng ?????u ti??n d??nh cho h???c sinh chuy??n Nga K60 Chuy??n
                Bi??n H??a.
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
                Nhanh, g???n, ti???n l???i
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
                ???? l?? nh???ng t??? c?? th??? d??ng ????? mi??u t??? cho ???ng d???ng n??y.
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
                Kh??ng bao gi??? b??? l??? th??ng tin
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
                Kh??ng ph???i m???t th???i gian truy c???p web l???p l?? m???t trong nh???ng l???i
                ??ch m?? C4K60 Mobile mang l???i.
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
                K???t n???i th???y c?? v?? b???n b??
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
                G???n k???t m???i ng?????i trong t???p th??? l???p v?? gi??o vi??n v???i nhau, d?? ???
                b???t k??? n??i ????u. ???? l?? ti??u ch?? ho???t ?????ng c???a app C4K60.
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
                V?? c??n nhi???u t??nh n??ng kh??c...
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
                H??y t??? m??nh kh??m ph?? nh??! Ch??c b???n c?? m???t tr???i nghi???m th?? v???.
              </Text>
            </View>
          </View>
        </Carousel>
      </View>
    </View>
  );
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
