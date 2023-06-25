import React, { useState, useRef, createRef, useEffect } from "react";
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
  ImageBackground,
  Easing,
  Animated,
  ScrollView,
  AppState,
} from "react-native";
import UserAvatar from "../components/UserAvatar";
import YoutubePlayer from "react-native-youtube-iframe";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { ProgressBar, Colors } from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Snackbar } from "react-native-paper";
import config from "../configurations/config";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import myGlobalObj from "../global/myGlobalObj";

const Tab = createMaterialTopTabNavigator();

const baseBackendServerURL =
  config.baseBackendServerURL + ":" + config.backendServerPort;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const style = require("../global/style");

function MusicScreen({ tab, childToParent, keyboardSummon }) {
  const [elapsedState, setElapsed] = React.useState(100);
  const [video, setVideo] = React.useState("");
  const [playing, setPlaying] = React.useState(true);
  const [currentLiveData, setCurrentLiveData] = React.useState("abc");
  const [currentProgress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [snackbarShow, setSnackbarShow] = useState(false);
  const [errMsg, setErrMsg] = useState("UNKNOWN_ERR");
  const [msg, setMsg] = useState(
    "Không thể kết nối đến máy chủ!" + "\nMã lỗi: " + errMsg
  );
  const [msgBtn, _setMsgBtn] = useState("Tải lại");
  const player = useRef();

  const fetchStorage = async () => {
    const username = await AsyncStorage.getItem("username");
    if (username) {
      myGlobalObj.username = username;
    }
    return username;
  };

  useEffect(() => {
    fetchStorage();
    const socket = io("ws://" + baseBackendServerURL + "/");
    socket.connect();
    socket.on("connect", () => {
      console.log(myGlobalObj.username + " connected to socket server");
      socket.emit("conn", myGlobalObj.username);
    });
    socket.on("refresh", () => {
      // console.log("Received refresh signal from server! Now restarting...");
      getData();
      syncWithServer();
    });
    socket.on("play", () => {
      // console.log("Received play signal from server! Now playing video...");
      setPlaying(true);
    });
    socket.on("views", () => {
      // console.log(
      //   "Received reload views count signal from server! Now reloading views count..."
      // );
      getData();
    });
    watchingAnimation();
    getData();
    syncWithServer();
    return () => {
      socket.emit("discon", myGlobalObj.username);
      setPlaying(false);
      console.log("User exited");
    };
  }, []);

  useEffect(() => {
    childToParent(currentLiveData);
  }, [currentLiveData]);

  const fadeAnim = useRef(new Animated.Value(0.65)).current;

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        setPlaying(true);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const renderYoutube = () => {
    return (
      <YoutubePlayer
        width={windowWidth}
        height={keyboardSummon ? 0 : windowWidth / (16 / 9)}
        ref={player}
        videoId={video}
        play={playing}
        initialPlayerParams={{
          controls: false,
          rel: 0,
          showClosedCaptions: true,
          start: 100,
          cc_lang_pref: "vi",
        }}
        style={{ alignItems: "center" }}
        onChangeState={(event) => {
          if (event == "unstarted") {
            console.log(
              "The player hasn't started yet. Now syncing duration time with server..."
            );
            getData();
            syncWithServer();
          }
          if (event == "ended") {
            console.log("Video is ended, now loading next song...");
            getData();
            syncWithServer();
            setTimeout(() => {
              getData();
              syncWithServer();
            }, 2000);
          }
          if (event == "paused") {
            console.log("Video is paused...");
            setPlaying(false);
            console.log("Is playing: " + playing);
          }
          if (event == "playing") {
            watchingAnimation();
            setStarted(true);
          }
        }}
      />
    );
  };

  const syncWithServer = async () => {
    await axios
      .get("http://" + baseBackendServerURL + "/live")
      .then((res) => {
        const position = res.data.video_in_queue.findIndex(
          (data) => data.position == res.data.now_playing_position
        );
        const videoToPlay = res.data.video_in_queue[position].video_id;
        const elapsed = parseInt(res.data.elapsed_time);
        setVideo(videoToPlay);
        setElapsed(elapsed);
        console.log("Server timestamp: " + elapsed);
        player.current.seekTo(elapsed, true);
      })
      .catch((error) => {
        console.log(error.message);
        setSnackbarShow(true);
        setErrMsg(error.message);
        setMsg("Không thể kết nối đến máy chủ!" + "\nMã lỗi: " + error.message);
        // Alert.alert(error.message);
      });
  };

  const title = () => {
    if (currentLiveData != "abc" && currentLiveData.now_playing_video_info) {
      return currentLiveData.now_playing_video_info.video_title;
    } else {
      return "Đang tải...";
    }
  };

  const song_img = (setting) => {
    if (currentLiveData != "abc" && currentLiveData.now_playing_video_info) {
      return {
        uri: currentLiveData.now_playing_video_info.video_thumbnail,
      };
    } else {
      if (setting == "bg") {
        return require("../assets/gray_load.png");
      } else {
        return require("../assets/song_load.jpeg");
      }
    }
  };

  const channel = (setting) => {
    if (currentLiveData != "abc" && currentLiveData.now_playing_video_info) {
      if (setting == "request") {
        return currentLiveData.now_playing_video_info.requested_by;
      }
      return currentLiveData.now_playing_video_info.uploaded_by;
    } else {
      return "";
    }
  };

  const getData = async () => {
    const response = await axios
      .get("http://" + baseBackendServerURL + "/live")
      .catch((error) => {
        console.log(error.message);
        setSnackbarShow(true);
        setErrMsg(error.message);
        setMsg("Không thể kết nối đến máy chủ!" + "\nMã lỗi: " + error.message);
      });
    setCurrentLiveData(response.data);
    return response.data;
  };

  const watchingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.65,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    var refresh = setInterval(() => {
      player.current
        .getCurrentTime()
        .then((currentTime) => {
          player.current
            .getDuration()
            .then((duration) => {
              // myGlobalObj.progress = currentTime / duration;
              // console.log("Progress: " + myGlobalObj.progress);
              setProgress(currentTime / duration);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }, 1000);
    return () => {
      clearInterval(refresh);
    };
  }, []);

  return (
    <>
      <View style={style.YTrender} pointerEvents="none">
        <View style={style.liveBadge_container}>
          <Animated.View
            style={
              playing
                ? {
                    backgroundColor: "red",
                    padding: 5,
                    borderRadius: 5,
                    opacity: fadeAnim,
                  }
                : {
                    backgroundColor: "#7F7F7F",
                    padding: 5,
                    borderRadius: 5,
                    opacity: 1,
                  }
            }
          >
            <Text style={style.liveBadge_text}>Trực tiếp</Text>
          </Animated.View>
          <View style={style.liveBadge_watching}>
            <View style={{ paddingLeft: 3, paddingRight: 6 }}>
              <Ionicons name={"eye"} size={16} color={"white"} />
            </View>
            <Text style={style.liveBadge_watching_text}>
              {currentLiveData.users_watching}
            </Text>
          </View>
        </View>
        {renderYoutube()}
      </View>

      <View style={style.nowPlayingBox}>
        <ImageBackground
          source={song_img("bg")}
          style={style.nowPlayingBox_coverBg}
          blurRadius={4.5}
        >
          <ProgressBar
            indeterminate={!started}
            progress={
              isNaN(currentProgress) || !isFinite(currentProgress)
                ? 0
                : currentProgress
            }
            color={"#fff"}
          />
          <View style={style.nowPlayingBox_upperContainer}>
            <View style={style.nowPlayingBox_songImg}>
              <Image
                source={song_img()}
                style={{
                  width: 85,
                  height: 45,
                }}
              ></Image>
            </View>
            <MaskedView
              maskElement={
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={[
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,1)",
                    "rgba(0,0,0,1)",
                    "rgba(0,0,0,0)",
                  ]}
                  locations={[0, 0.05, 0.95, 1]}
                  style={{
                    width: "97%",
                    marginLeft: 3,
                    height: 40,
                    position: "absolute",
                    zIndex: 10,
                  }}
                ></LinearGradient>
              }
              style={style.nowPlayingBox_middle}
            >
              <TextTicker
                bounce
                bounceDelay={1500}
                easing={Easing.linear}
                animationType={"bounce"}
                bounceSpeed={50}
                marqueeDelay={750}
                bouncePadding={{ left: 0, right: 10 }}
                style={style.textTicker}
                shouldAnimateTreshold={5}
              >
                {title()}
              </TextTicker>
              <TextTicker
                bounce
                bounceDelay={1500}
                easing={Easing.linear}
                animationType={"bounce"}
                bounceSpeed={50}
                marqueeDelay={750}
                style={{
                  color: "white",
                  fontSize: 13,
                  lineHeight: 20,
                  paddingLeft: 10,
                }}
                bouncePadding={{ left: 0, right: 10 }}
                shouldAnimateTreshold={5}
              >
                {channel()}
              </TextTicker>
            </MaskedView>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  getData();
                  syncWithServer();
                }}
              >
                <Ionicons
                  name={"reload-outline"}
                  size={30}
                  color={"white"}
                  style={{ marginRight: 15 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPlaying(!playing);
                  if (!playing) {
                    getData();
                    syncWithServer();
                  }
                }}
              >
                {playing ? (
                  <Ionicons
                    name={"pause-outline"}
                    size={30}
                    color={"white"}
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <Ionicons
                    name={"play"}
                    size={30}
                    color={"white"}
                    style={{ marginRight: 10 }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
      {tab}
      <Snackbar
        visible={snackbarShow}
        onDismiss={() => {
          setSnackbarShow(false);
        }}
        action={{
          label: msgBtn,
          onPress: () => {
            // Do something
            syncWithServer();
            getData();
          },
        }}
      >
        {msg}
      </Snackbar>
    </>
  );
}

export default React.memo(MusicScreen);
