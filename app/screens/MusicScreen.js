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
const socket = io("ws://" + baseBackendServerURL + "/");
// const baseBackendServerURL = "172.20.10.2:2222";
const baseBackendServerURL = "192.168.1.114:2222";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function MusicScreen() {
  console.log("refr");
  const [elapsed, setElapsed] = React.useState(0);
  const [video, setVideo] = React.useState("");
  const [playing, setPlaying] = React.useState(true);
  const [currentLiveData, setCurrentLiveData] = React.useState("abc");
  const [reRenderCount, reRender] = React.useState(0);
  const playerRef = createRef();
  var second = 0;

  useEffect(() => {
    playerRef.current?.seekTo(elapsed, true);
  }, [elapsed]);

  useEffect(() => {
    if (elapsed == 0) {
      getData();
      syncWithServer();
      playerRef.current?.seekTo(elapsed, true);
    }
  });

  useEffect(() => {
    syncWithServer();
    socket.connect();
    console.log("first load: " + elapsed);
  }, [elapsed]);

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
        ref={playerRef}
        videoId={video}
        play={playing}
        initialPlayerParams={{ controls: false, start: elapsed }}
        style={{ alignItems: "center" }}
        onChangeState={(event) => {
          if (event == "unstarted") {
            console.log("Syncing duration time with server...");
            getData();
            syncWithServer();
            playerRef.current?.seekTo(elapsed, true);
          }
          if (event == "ended") {
            getData();
            syncWithServer();
            playerRef.current?.seekTo(elapsed, true);
          }
          if (event == "paused") {
            console.log("Video is paused...");
            console.log("Is playing: " + playing);
            playerRef.current?.seekTo(elapsed, true);
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
    playerRef.current?.seekTo(elapsed, true);
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
        Alert.alert(error.message);
      });
    setCurrentLiveData(response.data);
  };

  const useProgress = (data = currentLiveData) => {
    const [duration, setDuration] = useState(300);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0.5);

    useEffect(() => {
      if (data != "abc") {
        setDuration(data.current_video_duration);
        setElapsedTime(data.elapsed_time);
      }
    }, [data]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        if (progress < 1) {
          setElapsedTime((t) => t + 1);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
      setProgress(elapsedTime / duration);
    }, [elapsedTime]);

    return progress;
  };
  const progress = useProgress();

  return (
    <>
      <View
        style={{
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
        }}
        pointerEvents="none"
      >
        {renderYoutube()}
      </View>

      <View
        style={{
          backgroundColor: "white",
          height: 60,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.29,
          shadowRadius: 4.65,

          elevation: 7,
        }}
      >
        <ImageBackground
          source={song_img("bg")}
          style={{
            width: windowWidth,
            height: 60,
            flex: 1,
            resizeMode: "cover",
          }}
          blurRadius={4.5}
        >
          <ProgressBar
            progress={progress}
            color={Colors.yellow400}
            style={{ marginTop: -0.7 }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, .3)",
              padding: 7,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={song_img()}
              style={{
                width: 45,
                height: 45,
                borderRadius: 10,
                marginRight: 10,
              }}
            ></Image>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                maxWidth: windowWidth - 165,
                marginRight: 20,
              }}
            >
              <TextTicker
                duration={10000}
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: "white",
                }}
              >
                {title()}
              </TextTicker>
              <TextTicker
                duration={10000}
                numberOfLines={1}
                style={{
                  fontWeight: "400",
                  fontSize: 12.5,
                  maxWidth: windowWidth - 165,
                  color: "white",
                }}
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
                  playerRef.current?.seekTo(elapsed, true);
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
                    playerRef.current?.seekTo(elapsed, true);
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
