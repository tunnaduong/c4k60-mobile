import React from "react";
import {
  Alert,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Dimensions,
  StyleSheet,
  Pressable,
  FlatList,
  Keyboard,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import UserAvatar from "../components/UserAvatar";
import YoutubePlayer from "react-native-youtube-iframe";
import SegmentedControlTab from "react-native-segmented-control-tab";
import io from "socket.io-client";
import { storage } from "../global/storage";
import Ionicons from "react-native-vector-icons/Ionicons";

//Platform.OS === "ios"

export class ChatText extends React.Component {
  render() {
    const text = this.props.data;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          maxWidth: "90%",
        }}
      >
        <UserAvatar
          username={text.username}
          style={{ width: 30, height: 30, borderRadius: 50, marginRight: 10 }}
        />
        <Text style={{ fontSize: 14, color: "#6E6E6E" }}>
          {text.name}
          <Text style={{ marginLeft: 10, color: "black" }}>
            {"   " + text.message}
          </Text>
        </Text>
      </View>
    );
  }
}

//pointerEvents="none"
export default class MusicScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
      singleIndex: 0,
      username: "",
      chatMessage: "",
      chatMessages: [],
      nameofuser: "",
      videos: "",
      time: 0,
      settings: {},
      search: "",
      played: false,
    };
    this.inputText = React.createRef();
    this.playerRef = React.createRef();
    //c4k60-backend-server.herokuapp.com
    this.socket = io("ws://172.20.10.2:2222/");

    this.socket.on("chat-message", (msg) => {
      this.setState({ chatMessages: [...this.state.chatMessages, msg] });
      console.log(this.state.chatMessages);
    });

    this.getData();
  }

  updateSingleSegment = (index) => {
    this.setState({ singleIndex: index });
    this.togglePlaying();
  };

  togglePlaying = () => {
    this.setState((prev) => ({ played: !prev.played }));
  };

  getData = async () => {
    const username = storage.getString("username");
    const name = storage.getString("name");
    if (username !== null && name !== null) {
      this.setState({ username: username, nameofuser: name });
    }
  };

  handleKeyDown(e) {
    if (e.nativeEvent.key == "Enter") {
      submitChatMessage();
    }
  }

  componentDidMount() {
    this.fet2();
    this.playerRef.seekTo(this.state.time, true);
  }

  submitChatMessage = () => {
    if (this.state.chatMessage !== "") {
      this.socket.emit("chat-message", {
        name: this.state.nameofuser,
        username: this.state.username,
        message: this.state.chatMessage,
      });
      this.setState({ chatMessage: "" });
      Keyboard.dismiss();
    } else {
      Alert.alert("Nhập tin nhắn có tâm vào bạn êiii :D");
    }
  };

  FlatListRef = null;

  fet = () => {
    return (
      <YoutubePlayer
        height={220}
        ref={(ref) => (this.playerRef = ref)}
        videoId={this.state.videos}
        play={this.state.played}
        initialPlayerParams={{ controls: false, loop: true }}
        onChangeState={(event) => {
          if (event == "unstarted") {
            console.log("loading syncing");
            this.fet2();
            this.playerRef.seekTo(100, true);
          }
          // if (event == "buffering") {
          //   this.fet2();
          //   this.playerRef.seekTo(this.state.time, true);
          // }
          if (event == "ended") {
            this.fet2();
          }
          if (event == "paused") {
            this.togglePlaying();
            this.fet2();
            console.log("paused");
            console.log(this.state.played);
          }
        }}
      />
    );
  };

  fet2 = () => {
    let yo = this;
    fetch("http://172.20.10.2:2222/live", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        // const videoToPlay =
        //   responseJson.server_idle_videos_playback_id[
        //     responseJson.now_playing_position
        //   ];
        const test = responseJson.video_in_queue.findIndex(
          (data) => data.position == responseJson.now_playing_position
        );
        const vid2play = responseJson.video_in_queue[test].video_id;
        const startTime = responseJson.elapsed_time;
        yo.playerRef.seekTo(startTime, true);
        console.log(startTime);
        this.setState({
          videos: vid2play,
        });
      });
  };

  fetchQueue = () => {
    fetch("http://172.20.10.2:2222/live", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {});

    return (
      <>
        <FlatList
          ListEmptyComponent={
            <>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Image
                  source={require("../assets/queue.png")}
                  style={{
                    width: 200,
                    height: 200,
                    marginTop: 30,
                  }}
                />
                <Text
                  style={{
                    color: "#808080",
                    fontSize: 15,
                    paddingLeft: 50,
                    paddingRight: 50,
                    textAlign: "center",
                  }}
                >
                  Danh sách phát đang trống! Hãy thêm một bài hát tại tab "Tìm
                  bài hát" để bắt đầu nghe.
                </Text>
              </View>
            </>
          }
        />
      </>
    );
  };

  submitQueueVideo = () => {
    if (
      this.state.search !== "" &&
      this.state.search.length === 12 &&
      this.state.search[0] === "/"
    ) {
      var s = this.state.search.slice(1);
      fetch(
        "https://www.googleapis.com/youtube/v3/videos?id=" +
          s +
          "&key=AIzaSyD14m2Lz-oKztYbjQC8y4nbDmp9aBys2bc&part=contentDetails,snippet",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.pageInfo.totalResults === 1) {
            Alert.alert("Đã thêm bài hát có id: " + s + " vào hàng đợi!");
            this.setState({ search: "" });
            Keyboard.dismiss();
            this.socket.emit("add-queue", s);
          } else {
            Alert.alert(
              "Bài hát có id: " + s + " không tồn tại! Vui lòng thử lại..."
            );
            this.setState({ search: "" });
            Keyboard.dismiss();
          }
        });
    } else if (this.state.search !== "") {
      Alert.alert("Tính năng đang phát triển!");
    } else {
      Alert.alert("Nhập bài hát có tâm vào bạn êiii :D");
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, height: "100%" }}
        behavior={
          Platform.OS === "ios"
            ? this.state.singleIndex === 1
              ? undefined
              : "padding"
            : null
        }
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View
          style={{
            backgroundColor: "black",
            marginBottom: 10,
            height: 220,
          }}
          pointerEvents="none"
        >
          {this.fet()}
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "95%" }}>
            <SegmentedControlTab
              values={["Bài hát tiếp theo", "Tìm bài hát", "Chat trực tiếp"]}
              selectedIndex={this.state.singleIndex}
              onTabPress={this.updateSingleSegment}
            />
          </View>
        </View>
        {this.state.singleIndex === 2 && (
          <>
            <FlatList
              ref={(ref) => (this.FlatListRef = ref)}
              onContentSizeChange={() => this.FlatListRef.scrollToEnd()}
              style={{ padding: 10 }}
              keyExtractor={(item, index) => index.toString()}
              data={this.state.chatMessages}
              renderItem={({ item }) => {
                return <ChatText data={item} />;
              }}
            />
            <View
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 1,
                shadowRadius: 6.27,
                backgroundColor: "white",
                elevation: 10,
              }}
            >
              <View
                style={{
                  paddingTop: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingBottom: 10,
                  width: "100%",
                  backgroundColor: "#F2F2F1",
                  paddingBottom:
                    Platform.OS === "ios"
                      ? Dimensions.get("screen").height > 667
                        ? 25
                        : 10
                      : 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <UserAvatar
                    username={this.state.username}
                    style={styles.commentAvatar}
                  />
                  <Pressable
                    onPress={() => {
                      this.inputText.current.focus();
                    }}
                    style={styles.commentBox}
                  >
                    <TextInput
                      ref={this.inputText}
                      style={
                        Platform.OS === "web"
                          ? {
                              fontSize: 14,
                              flex: 1,
                              lineHeight: 25,
                            }
                          : {
                              fontSize: 14,
                              flex: 1,
                            }
                      }
                      placeholder="Nhập tin nhắn..."
                      autoCorrect={false}
                      value={this.state.chatMessage}
                      onSubmitEditing={this.submitChatMessage}
                      onChangeText={(chatMessage) => {
                        this.setState({ chatMessage });
                      }}
                    ></TextInput>
                    <Ionicons
                      style={{
                        textAlign: "right",
                        paddingLeft: 5,
                        paddingRight: 5,
                      }}
                      name={"camera-outline"}
                      size={25}
                    />
                  </Pressable>
                  <Pressable
                    style={{
                      alignItems: "center",
                      paddingLeft: 10,
                    }}
                    onPress={this.submitChatMessage}
                  >
                    <Ionicons name={"send"} size={25} color={"#007AFF"} />
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        )}
        {this.state.singleIndex === 0 && <View>{this.fetchQueue()}</View>}
        {this.state.singleIndex === 1 && (
          <View style={{ padding: 10, height: "100%" }}>
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                flexDirection: "row",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.4,
                shadowRadius: 2.27,
                zIndex: 100,
                elevation: 1,
              }}
            >
              <Ionicons
                name={"search-outline"}
                size={25}
                color={"#B0B0B2"}
                style={{ marginRight: 5 }}
              />
              <TextInput
                style={{ fontSize: 16, width: "100%" }}
                placeholder="Nhập tên bài hát..."
                value={this.state.search}
                onSubmitEditing={this.submitQueueVideo}
                onChangeText={(search) => {
                  this.setState({ search });
                }}
              />

              <View
                style={{
                  backgroundColor: "#0076FF",
                  position: "absolute",
                  right: 0,
                  padding: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <TouchableOpacity onPress={this.submitQueueVideo}>
                  <Ionicons
                    name={"arrow-forward-outline"}
                    size={25}
                    color={"white"}
                    style={{ marginRight: 5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              style={{ height: "100%" }}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Image
                    source={require("../assets/search.png")}
                    style={{
                      width: 200,
                      height: 200,
                      marginBottom: 10,
                    }}
                  />
                  <Text style={{ color: "#808080", fontSize: 15 }}>
                    Gõ một vài từ khóa để bắt đầu...
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 18,
  },
  title: { fontWeight: "bold", fontSize: 25 },
  date: { fontSize: 15, marginLeft: 3 },
  content: { fontSize: 16, marginTop: 10 },
  commentBox: {
    backgroundColor: "#DFDEDD",
    height: 40,
    width: "79%",
    borderRadius: 50,
    padding: 7,
    paddingLeft: 13,
    flexDirection: "row",
    flex: 1,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
});
