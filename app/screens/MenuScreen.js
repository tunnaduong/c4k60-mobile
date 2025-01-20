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
  Image,
} from "react-native";
import { storage } from "../global/storage";
import { Divider } from "react-native-elements/dist/divider/Divider";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CommonActions } from "@react-navigation/native";
import UserAvatar from "../components/UserAvatar";

export default function MenuScreen({ navigation, route }) {
  const name = storage.getString("name");
  const username = storage.getString("username");
  const [modalVisible, setModalVisible] = React.useState(false);

  const goToScreen = () => {
    clearAll();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "Loading" }],
      })
    );
  };
  const clearAll = () => {
    try {
      storage.delete("token");
      storage.delete("name");
      storage.delete("avatar");
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
    <View
      style={{
        padding: 15,
        backgroundColor: "white",
        height: "100%",
        // transform: [{ translateX: translateX }],
        // opacity: opacity,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => {
          if (storage.getString("username") == "test") {
            return navigation.navigate("Login");
          }
          navigation.navigate("ProfileDetail", {
            name: name,
            username: username,
            editable: true,
          });
        }}
      >
        {storage.getString("username") == "test" ? (
          <Image
            source={require("../assets/user.png")}
            style={{ height: 50, width: 50, borderRadius: 100 }}
          ></Image>
        ) : (
          <UserAvatar username={username} style={styles.avatar} />
        )}
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 20 }}>{name}</Text>
          <Text style={{ color: "#7F7F7F" }}>
            {storage.getString("username") == "test"
              ? "Đăng nhập để xem thông tin cá nhân"
              : "Xem trang cá nhân của bạn"}
          </Text>
        </View>
      </TouchableOpacity>
      <Divider style={{ marginTop: 13 }} />
      <TouchableOpacity
        style={{
          marginTop: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("GalleryScreen");
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
        onPress={() => {
          navigation.navigate("IncomingBirthday");
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
        onPress={() => {
          navigation.navigate("StudentProfile");
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
        onPress={() => {
          if (storage.getString("username") == "test") {
            return Alert.alert(
              "Chức năng này không khả dụng trong chế độ xem trước."
            );
          }
          navigation.navigate("FriendNearby");
        }}
      >
        <Ionicons
          name="location-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#E02C99"}
        />
        <Text style={{ fontSize: 15 }}>Bạn bè gần đây</Text>
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
          if (storage.getString("username") == "test") {
            return Alert.alert(
              "Chức năng này không khả dụng trong chế độ xem trước."
            );
          }
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
          navigation.navigate("CalendarScreen");
        }}
      >
        <Ionicons
          name="calendar-outline"
          size={25}
          style={{ marginRight: 10 }}
          color={"#9B0041"}
        />
        <Text style={{ fontSize: 15 }}>Lịch & Sự kiện</Text>
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
          navigation.navigate("Testing", {
            title: "Đóng góp ý kiến",
          });
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
        onPress={() => {
          navigation.navigate("Testing", {
            title: "Báo cáo sự cố",
          });
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
        onPress={() => {
          if (storage.getString("username") == "test") {
            return Alert.alert(
              "Chức năng này không khả dụng trong chế độ xem trước."
            );
          }
          navigation.navigate("Testing", {
            title: "Cài đặt",
          });
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
          if (storage.getString("username") == "test") {
            return navigation.navigate("Login");
          }
          Platform.OS === "ios"
            ? onPressIOS()
            : Platform.OS === "android"
            ? onPressAndroid()
            : setState({ modalVisible: true });
        }}
      >
        <Text style={{ fontSize: 15 }}>
          {storage.getString("username") == "test" ? "Đăng nhập" : "Đăng xuất"}
        </Text>
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
    </View>
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
