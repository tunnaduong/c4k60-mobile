import React from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import ProgressHUD from "../components/ProgressHUD";

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
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainScreen" }],
          })
        );
        this.props.navigation.navigate("MainScreen");
      } else {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          })
        );
      }
    } catch (e) {
      // error reading value
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ProgressHUD loadText="Đang tải..." visible={true} />
      </View>
    );
  }
}

export default LoadingScreen;
