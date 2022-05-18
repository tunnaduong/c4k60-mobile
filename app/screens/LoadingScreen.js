import React from "react";
import { Platform, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-tiny-toast";
import { CommonActions } from "@react-navigation/native";

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem("token");
      if (value !== null && value === "abc123") {
        Platform.OS === "web" ? true : Toast.showLoading("Đang tải...");
        setTimeout(() => {
          this.props.navigation.navigate("MainScreen");
          Platform.OS === "web" ? true : Toast.hide();
        }, 800);
      } else {
        Platform.OS === "web" ? true : Toast.showLoading("Đang tải...");
        setTimeout(() => {
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }, { name: "Welcome" }],
            })
          );
          Platform.OS === "web" ? true : Toast.hide();
        }, 800);
      }
    } catch (e) {
      // error reading value
    }
  };

  render() {
    return <View style={{ flex: 1, backgroundColor: "#fff" }}></View>;
  }
}

export default LoadingScreen;
