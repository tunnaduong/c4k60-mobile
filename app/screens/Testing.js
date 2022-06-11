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
} from "react-native";
import UserAvatar from "./UserAvatar";
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
import { List } from "react-native-paper";
