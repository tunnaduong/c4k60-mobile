import React from "react";
import { View } from "react-native";
import { storage } from "../global/storage";
import { CommonActions } from "@react-navigation/native";
import ProgressHUD from "../components/ProgressHUD";

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      loading: false,
    };
    this.getData();
  }

  getData = async () => {
    try {
      const value = storage.getString("token");
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
        <ProgressHUD
          loadText="Đang tải..."
          visible={false}
          noBackground={true}
        />
      </View>
    );
  }
}

export default LoadingScreen;
