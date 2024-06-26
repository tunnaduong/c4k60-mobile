import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  Pressable,
  Dimensions,
  Keyboard,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { storage } from "../global/storage";
import { CommonActions } from "@react-navigation/native";
import ProgressHUD from "../components/ProgressHUD";
export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      avatar: "",
      check_textInputChange: false,
      secureTextEntry: true,
      token: "undefined",
      name: "",
      loading: false,
      show: true,
    };
    this.getData();
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  componentWillUnmount() {
    this.setState({
      show: false,
    });
  }

  InsertRecord = async () => {
    // show loading hud
    this.setState({ loading: true });
    var Username = this.state.username;
    var Password = this.state.password;

    if (Username.length == 0 || Password.length == 0) {
      this.setState({ loading: false });
      Alert.alert("Vui lòng điền đầy đủ thông tin vào các trường!");
    } else {
      var APIURL = "https://c4k60.com/api/login.php";

      var headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      var Data = {
        username: Username,
        password: Password,
      };

      fetch(APIURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      })
        .then((Response) => Response.json())
        .then((Response) => {
          if (Response[0].Message == "Thành công!") {
            setTimeout(() => {
              const NameOfUser = Response[0].Name;
              const UserAvatar = Response[0].Avatar;
              this.setState({
                name: NameOfUser,
                avatar: UserAvatar,
              });
              this.setData();
              this.setState({ loading: false });

              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "MainScreen" }],
                })
              );
            }, 350);
          } else {
            setTimeout(() => {
              this.setState({ loading: false });
              Alert.alert(Response[0].Message);
            }, 350);
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.error("Lỗi " + error);
          Alert.alert("Lỗi: " + error);
        });
    }
  };

  setData = async (input) => {
    this.setState({ token: "abc123" });
    await AsyncStorage.setItem("username", this.state.username);
    await AsyncStorage.setItem("name", this.state.name);
    await AsyncStorage.setItem("avatar", this.state.avatar);
    await AsyncStorage.setItem("token", "abc123");
    input == "delete_user" && (await AsyncStorage.removeItem("username"));
  };

  getData = async () => {
    try {
      const value = storage.getString("token");
      const username = storage.getString("username");
      if (value !== null) {
        // value previously stored
        this.setState({ token: value });
      }
      if (username !== null) {
        // value previously stored
        this.setState({ username });
      }
    } catch (e) {
      // error reading value
    }
  };

  updateSecureTextEntry() {
    this.setState({
      ...this.state,
      secureTextEntry: !this.state.secureTextEntry,
    });
  }

  handleKeyDown(e) {
    if (e.nativeEvent.key == "Enter") {
      InsertRecord();
    }
  }

  render() {
    return (
      <>
        <ProgressHUD
          loadText="Đang đăng nhập..."
          visible={this.state.loading}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={Platform.OS === "ios" ? false : true}
        >
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={Platform.OS === "ios" ? 0.5 : null}
            onPress={() => {
              this.props.navigation.goBack();
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
                onSubmitEditing={(event) => this.InsertRecord()}
                multiline={false}
                placeholderTextColor="#404040"
                style={{ flex: 1, fontSize: 16, marginLeft: 10 }}
                onChangeText={(username) => this.setState({ username })}
                placeholder="Tên đăng nhập"
                autoCapitalize="none"
                value={this.state.username}
                ref={this.usernameRef}
              />
              <Pressable
                onPress={() => {
                  this.setState({ username: "" });
                  this.setData("delete_user");
                }}
                style={[
                  this.state.username != "" &&
                  this.usernameRef.current.isFocused()
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
                onSubmitEditing={(event) => this.InsertRecord()}
                multiline={false}
                secureTextEntry={this.state.secureTextEntry ? true : false}
                placeholderTextColor="#404040"
                style={{ flex: 1, fontSize: 16, marginLeft: 10 }}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                placeholder="Mật khẩu"
                autoCapitalize="none"
                ref={this.passwordRef}
              />
              <Pressable
                onPress={() => this.setState({ password: "" })}
                style={[
                  this.state.password != "" &&
                  this.passwordRef.current.isFocused()
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
                this.InsertRecord();
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
        </ScrollView>
      </>
    );
  }
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
