import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  Platform,
  Pressable,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { storage } from "../global/storage";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import ProgressHUD from "../components/ProgressHUD";

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const usernameRef = React.useRef();
  const passwordRef = React.useRef();
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  //   const [show, setShow] = React.useState(true);
  const [token, setToken] = React.useState("undefined");
  const [name, setName] = React.useState("");
  const [avatar, setAvatar] = React.useState("");

  React.useEffect(() => {
    getData();
  }, []);

  const handleLogin = async () => {
    if (username.length == 0 || password.length == 0) {
      Alert.alert("Vui lòng điền đầy đủ thông tin vào các trường!");
    } else {
      setLoading(true);
      try {
        if (username == "tunganh" && password == "1") {
          setName("Dương Tùng Anh");
          setAvatar("https://c4k60.com/hoso/tunganh.jpg");
          //   setData();
          setToken("abc123");
          storage.set("username", "tunganh");
          storage.set("name", "Dương Tùng Anh");
          storage.set("avatar", avatar);
          storage.set("token", "abc123");
          setLoading(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "MainScreen" }],
            })
          );
        }
        const response = await axios.post("https://c4k60.com/api/login.php", {
          username: username,
          password: password,
        });
        // console.log(response.data);

        if (response.data[0].Message == "Thành công!") {
          setTimeout(async () => {
            setName(response.data[0].Name);
            setAvatar(response.data[0].Avatar);
            // setData();
            setToken("abc123");
            storage.set("username", response.data[0].Username);
            storage.set("name", response.data[0].Name);
            storage.set("avatar", response.data[0].Avatar);
            storage.set("token", "abc123");
            setLoading(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "MainScreen" }],
              })
            );
          }, 350);
        } else {
          setLoading(false);
          Alert.alert("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        Alert.alert("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    }
  };

  const setData = (input) => {
    input == "delete_user" && storage.delete("username");
  };

  const getData = () => {
    try {
      const value = storage.getString("token");
      const username = storage.getString("username");
      if (value !== null) {
        // value previously stored
        setToken(value);
      }
      if (username !== null) {
        // value previously stored
        setUsername(username);
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <>
      <ProgressHUD loadText="Đang đăng nhập..." visible={loading} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={Platform.OS === "ios" ? 0.5 : null}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <View>
              <Ionicons
                name="chevron-back-outline"
                color="white"
                size={35}
                style={{ top: 1, left: 2 }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../assets/logo.png")}
              resizeMode="stretch"
              style={styles.logo}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.usernameContainer}>
              <FontAwesomeIcon icon={faUser} size={16} />
              <TextInput
                onSubmitEditing={() => handleLogin()}
                multiline={false}
                placeholderTextColor="#404040"
                style={{ flex: 1, fontSize: 16, marginLeft: 10 }}
                onChangeText={(username) => setUsername(username)}
                placeholder="Tên đăng nhập"
                autoCapitalize="none"
                value={username}
                ref={usernameRef}
              />
              <Pressable
                onPress={() => {
                  setUsername("");
                  setData("delete_user");
                }}
                style={[
                  username != "" && usernameRef.current?.isFocused()
                    ? { display: "flex" }
                    : { display: "none" },
                ]}
              >
                <View className="aspect-square ml-2 h-[18px] bg-black/20 rounded-full p-[2px] items-center justify-center">
                  <Ionicons
                    name="close"
                    size={15}
                    color={"rgba(255,255,255,0.85)"}
                  />
                </View>
              </Pressable>
            </View>
            <View style={styles.passwordContainer}>
              <FontAwesomeIcon icon={faLock} size={16} />
              <TextInput
                onSubmitEditing={() => handleLogin()}
                multiline={false}
                secureTextEntry={secureTextEntry ? true : false}
                placeholderTextColor="#404040"
                style={{ flex: 1, fontSize: 16, marginLeft: 10 }}
                onChangeText={(password) => setPassword(password)}
                value={password}
                placeholder="Mật khẩu"
                autoCapitalize="none"
                ref={passwordRef}
              />
              <Pressable
                onPress={() => setPassword("")}
                style={[
                  password != "" && passwordRef.current?.isFocused()
                    ? { display: "flex" }
                    : { display: "none" },
                ]}
              >
                <View className="aspect-square ml-2 h-[18px] bg-black/20 rounded-full p-[2px] items-center justify-center">
                  <Ionicons
                    name="close"
                    size={15}
                    color={"rgba(255,255,255,0.85)"}
                  />
                </View>
              </Pressable>
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={Platform.OS === "ios" ? 0.3 : null}
              onPress={() => {
                handleLogin();
                Keyboard.dismiss();
              }}
            >
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  ĐĂNG NHẬP
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#828180",
    width: 40,
    height: 40,
    borderRadius: 35,
    position: "absolute",
    left: 15,
    top:
      Platform.OS === "ios"
        ? Dimensions.get("screen").height > 667
          ? 45
          : 30
        : Platform.OS === "web"
        ? 15
        : 30,
    zIndex: 99,
  },
  logo: {
    width: 200,
    height: 65,
    position: "absolute",
    top: 80,
  },
  usernameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 200,
    backgroundColor: "#DFDEDD",
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 30,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 225,
    backgroundColor: "#DFDEDD",
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 30,
    fontSize: 16,
  },
  loginButton: {
    top: 250,
    backgroundColor: "#FADA00",
    width: "90%",
    borderRadius: 50,
    height: 55,
    justifyContent: "center",
  },
  signUpButton: {
    fontSize: 16,
  },
});
