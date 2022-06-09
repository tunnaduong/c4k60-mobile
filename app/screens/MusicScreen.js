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
} from "react-native";
import UserAvatar from "./UserAvatar";
import YoutubePlayer from "react-native-youtube-iframe";
import SegmentedControlTab from "react-native-segmented-control-tab";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { ProgressBar, Colors } from "react-native-paper";
import TextTicker from "react-native-text-ticker";

//Platform.OS === "ios"
// const baseBackendServerURL = "172.20.10.2:2222";
const baseBackendServerURL = "192.168.1.114:2222";
const socket = io("ws://" + baseBackendServerURL + "/");
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const style = require("../global/style");

export default function MusicScreen() {
  const [elapsed, setElapsed] = React.useState(100);
  const [video, setVideo] = React.useState("");
  const [playing, setPlaying] = React.useState(true);
  const [currentLiveData, setCurrentLiveData] = React.useState("abc");
  const [currentProgress, setProgress] = useState(0.1);
  const [started, setStarted] = useState(false);
  const player = useRef();

  useEffect(() => {
    console.log("socket connected");
    socket.connect();
  }, []);

  useEffect(() => {
    getData();
    syncWithServer();
  }, []);

  useEffect(() => {
    return () => {
      socket.disconnect();
      console.log("user exited");
    };
  }, []);

  const renderYoutube = () => {
    return (
      <YoutubePlayer
        width={windowWidth}
        height={220}
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
            console.log("Is playing: " + playing);
          }
          if (event == "playing") {
            setStarted(true);
          }
        }}
      />
    );
  };

  const syncWithServer = async () => {
    await axios.get("http://" + baseBackendServerURL + "/live").then((res) => {
      const position = res.data.video_in_queue.findIndex(
        (data) => data.position == res.data.now_playing_position
      );
      const videoToPlay = res.data.video_in_queue[position].video_id;
      const elapsed = parseInt(res.data.elapsed_time);
      setVideo(videoToPlay);
      setElapsed(elapsed);
      console.log("Server timestamp: " + elapsed);
    });
  };

  const title = () => {
    if (currentLiveData != "abc") {
      return currentLiveData.now_playing_video_info.video_title;
    } else {
      return "Đang tải...";
    }
  };

  const song_img = (setting) => {
    if (currentLiveData != "abc") {
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

  const channel = () => {
    if (currentLiveData != "abc") {
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
        // Alert.alert(error.message);
      });
    setCurrentLiveData(response.data);
    return response.data;
  };

  // useEffect(() => {
  //   playerRef.current
  //     ?.getCurrentTime()
  //     .then((currentTime) => {
  //       playerRef.current
  //         ?.getDuration()
  //         .then((duration) => {
  //           // myGlobalObj.progress = currentTime / duration;
  //           // console.log("Progress: " + myGlobalObj.progress);
  //           setProgress(currentTime / duration);
  //         })
  //         .catch((err) => console.log(err));
  //     })
  //     .catch((err) => console.log(err));
  // });

  return (
    <>
      <View style={style.YTrender} pointerEvents="none">
        <View style={style.liveBadge_container}>
          <View style={style.liveBadge}>
            <Text style={style.liveBadge_text}>Trực tiếp</Text>
          </View>
          <View style={style.liveBadge_watching}>
            <Text style={style.liveBadge_text}>
              <Ionicons
                name={"eye"}
                size={15}
                color={"white"}
                style={{ marginRight: 15 }}
              />{" "}
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
            color={Colors.yellow400}
            style={{ marginTop: -0.7 }}
          />
          <View style={style.nowPlayingBox_upperContainer}>
            <Image
              source={song_img()}
              style={style.nowPlayingBox_songImg}
            ></Image>

            <View style={style.nowPlayingBox_middle}>
              <TextTicker
                bounce
                bounceDelay={1500}
                easing={Easing.linear}
                animationType={"bounce"}
                bounceSpeed={50}
                marqueeDelay={750}
                bouncePadding={{ left: 0, right: 0 }}
                style={style.textTicker}
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
                bouncePadding={{ left: 0, right: 0 }}
                style={style.textTicker}
              >
                {channel()}
              </TextTicker>
            </View>
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
    </>
  );
}
