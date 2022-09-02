import React from "react";
import {
  ActionSheetIOS,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Animated,
  Easing,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider } from "react-native-elements/dist/divider/Divider";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import UserAvatar from "../components/UserAvatar";
import createAnimation from "../utils/createAnimation";

export default function MenuScreen({ navigation, route }) {
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);

  const translateX = new Animated.Value(0);
  const opacity = new Animated.Value(0);

  const isFocused = useIsFocused();
  const prevScreen = route.params.previous_screen;

  const fadeIn = (from) => {
    translateX.setValue(from == "right" ? 150 : -150);
    opacity.setValue(0.1);

    Animated.parallel([
      createAnimation(translateX, 150, Easing.inout, null, 0),
      createAnimation(opacity, 200, Easing.inout, null, 1),
    ]).start();
  };

  React.useEffect(() => {
    isFocused && prevScreen != "MenuScreen" && fadeIn("right");
  }, [route]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const name = await AsyncStorage.getItem("name");
    const username = await AsyncStorage.getItem("username");
    if (name !== null && username !== null) {
      setName(name);
      setUsername(username);
    }
  };

  const goToScreen = () => {
    clearAll();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Loading" }],
      })
    );
  };
  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("avatar");
    } catch (e) {
      // clear error
    }
  };

  const onPressIOS = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: "Bạn có chắc chắn muốn đăng xuất không?",
        options: ["Hủy", "Đăng xuất"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          goToScreen();
          clearAll();
        }
      }
    );
  };
  const onPressAndroid = () =>
    Alert.alert(
      "Thông báo",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Có",
          onPress: () => {
            goToScreen();
            clearAll();
          },
        },
        {
          text: "Không",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );

  return (
    <Animated.View
      style={{
        padding: 15,
        backgroundColor: "white",
        height: "100%",
        transform: [{ translateX: translateX }],
        opacity: opacity,
      }}
    >
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
        <UserAvatar username={username} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 20 }}>{name}</Text>
          <Text style={{ color: "#7F7F7F" }}>Xem trang cá nhân của bạn</Text>
        </View>
      </TouchableOpacity>
      <Divider style={{ marginTop: 13 }} />
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="images-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"orange"}
        />
        <Text style={{ fontSize: 15 }}>Ảnh và video</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="gift-outline"
          color={"#FD6E6C"}
          size={25}
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 15 }}>Sinh nhật sắp tới</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="people-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#1EA82B"}
        />
        <Text style={{ fontSize: 15 }}>Hồ sơ thành viên</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="location-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#E02C99"}
        />
        <Text style={{ fontSize: 15 }}>Bạn bè quanh đây</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("MusicScreen");
        }}
      >
        <Ionicons
          name="musical-notes-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#24BBB9"}
        />
        <Text style={{ fontSize: 15 }}>Nghe nhạc cùng nhau</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("Testing");
        }}
      >
        <Ionicons
          name="chatbox-ellipses-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#206AFE"}
        />
        <Text style={{ fontSize: 15 }}>Đóng góp ý kiến</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="warning-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#B6991C"}
        />
        <Text style={{ fontSize: 15 }}>Báo cáo sự cố</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="settings-outline"
          size={25}
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 15 }}>Cài đặt</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={25}
          style={{ position: "absolute", right: 0 }}
          color={"#CBCCCC"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#E7E7E7",
          padding: 10,
          borderRadius: 6,
        }}
        onPress={() => {
          Platform.OS === "ios"
            ? onPressIOS()
            : Platform.OS === "android"
            ? onPressAndroid()
            : setState({ modalVisible: true });
        }}
      >
        <Text style={{ fontSize: 15 }}>Đăng xuất</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setState({ modalVisible: !modalVisible });
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Bạn có chắc chắn muốn đăng xuất không?
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  goToScreen();
                  clearAll();
                }}
              >
                <Text style={styles.textStyle}>Có</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setState({ modalVisible: !modalVisible })}
              >
                <Text style={styles.textStyle}>Không</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#FF416E",
    marginRight: 10,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 100,
  },
});
