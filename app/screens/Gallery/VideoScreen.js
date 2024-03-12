import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Image } from "expo-image";
import { Video } from "expo-av";
import Modal from "react-native-modal";
import YoutubePlayer from "react-native-youtube-iframe";

const VideoPopup = ({
  visible,
  url,
  onRequestClose,
  caption,
  type = "html5",
}) => {
  return (
    <>
      {type == "html5" ? (
        <Modal
          onBackdropPress={onRequestClose}
          isVisible={visible}
          backdropOpacity={1}
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Video
            style={styles.video}
            source={{
              uri: url,
            }}
            useNativeControls
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            isLooping
            shouldPlay
          />
          <Text
            style={{
              fontSize: 18,
              color: "#FFF",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            {caption}
          </Text>
        </Modal>
      ) : (
        <>
          <Modal
            onBackdropPress={onRequestClose}
            isVisible={visible}
            backdropOpacity={1}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onRequestClose}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <YoutubePlayer height={300} play={true} videoId={url} />
            <Text
              style={{
                fontSize: 18,
                color: "#FFF",
                textAlign: "center",
                marginTop: 30,
              }}
            >
              {caption}
            </Text>
          </Modal>
        </>
      )}
    </>
  );
};

export default function VideoScreen() {
  const [videoList, setVideoList] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [type, setType] = React.useState("html5");

  React.useEffect(() => {
    getVideoList();
  }, []);

  const getVideoList = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/gallery/videos"
      );
      setVideoList(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {videoList == null ? (
        <>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              width: "100%",
            }}
          >
            <ActivityIndicator size={"large"} color="#636568" />
            <Text style={{ marginTop: 15 }}>Đang tải danh sách video...</Text>
          </View>
        </>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 40,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#C0BFBC",
                  paddingHorizontal: 15,
                  lineHeight: 50,
                }}
              >
                Video YouTube
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "#C0BFBC",
                  marginRight: 9,
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                padding: 2,
              }}
            >
              {videoList
                .filter((x) => {
                  return x.type == "youtube";
                })
                .map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: "33%",
                      padding: 2,
                    }}
                    activeOpacity={0.6}
                    onPress={() => {
                      setVideoUrl(
                        item.link_youtube.replace(
                          "https://www.youtube.com/watch?v=",
                          ""
                        )
                      );
                      setVisible(true);
                      setCaption(item.caption);
                      setType("youtube");
                    }}
                  >
                    <Image
                      source={
                        "https://c4k60.tunnaduong.com/anhvavideo/" +
                        item.thumb_path
                      }
                      style={{
                        width: "100%",
                        height: 130,
                      }}
                    ></Image>
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../assets/play.png")}
                        style={{
                          height: 50,
                          width: 50,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#C0BFBC",
                  paddingHorizontal: 15,
                  lineHeight: 50,
                }}
              >
                Video đã tải lên
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "#C0BFBC",
                  marginRight: 9,
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                padding: 2,
              }}
            >
              {videoList
                .filter((x) => {
                  return x.type == "html5";
                })
                .map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: "33%",
                      padding: 2,
                    }}
                    activeOpacity={0.6}
                    onPress={() => {
                      setVideoUrl(
                        "https://c4k60.tunnaduong.com/anhvavideo/" + item.path
                      );
                      setVisible(true);
                      setCaption(item.caption);
                      setType("html5");
                    }}
                  >
                    <Image
                      source={
                        "https://c4k60.tunnaduong.com/anhvavideo/" +
                        item.thumb_path
                      }
                      style={{
                        width: "100%",
                        height: 130,
                      }}
                    ></Image>
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../../assets/play.png")}
                        style={{
                          height: 50,
                          width: 50,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            <VideoPopup
              visible={visible}
              url={videoUrl}
              onRequestClose={() => setVisible(false)}
              caption={caption}
              type={type}
            />
          </ScrollView>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 240,
  },
  closeButton: {
    width: 45,
    height: 45,
    position: "absolute",
    right: 0,
    zIndex: 1000,
    top: 50,
  },
  closeText: {
    lineHeight: 25,
    fontSize: 25,
    paddingTop: 2,
    includeFontPadding: false,
    color: "#FFF",
  },
});
