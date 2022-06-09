"use strict";
import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

module.exports = StyleSheet.create({
  YTrender: {
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
  },
  nowPlayingBox: {
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
  },
  nowPlayingBox_coverBg: {
    width: windowWidth,
    height: 60,
    flex: 1,
    resizeMode: "cover",
  },
  nowPlayingBox_upperContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    padding: 7,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  nowPlayingBox_songImg: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 10,
  },
  nowPlayingBox_middle: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    maxWidth: windowWidth - 165,
    marginRight: 20,
  },
  textTicker: {
    fontWeight: "700",
    fontSize: 16,
    color: "white",
  },
  liveBadge_container: {
    position: "absolute",
    zIndex: 10,
    left: 10,
    top: 10,
    display: "flex",
    flexDirection: "row",
  },
  liveBadge: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  liveBadge_text: {
    color: "white",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  liveBadge_watching: {
    marginLeft: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 5,
  },
});
