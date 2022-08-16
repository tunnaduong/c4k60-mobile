import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import LoginCarousel from "../components/LoginCarousel";

class WelcomeScreen extends React.Component {
  render() {
    return (
      <ImageBackground
        style={styles.background}
        source={
          Platform.OS === "web"
            ? require("../assets/background-web.png")
            : require("../assets/background.png")
        }
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo-c4k60.png")}
            style={styles.logo}
          />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <LoginCarousel />
        </View>
        <TouchableOpacity
          activeOpacity={Platform.OS === "ios" ? 0.4 : null}
          style={styles.loginButton}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={Platform.OS === "ios" ? 0.6 : null}
          style={styles.signupButton}
          onPress={() => this.props.navigation.navigate("SignUp")}
        >
          <Text style={styles.signupText}>Đăng ký</Text>
        </TouchableOpacity>
        <View style={styles.underButtons}></View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 100,
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 100,
  },
  slogan: {
    fontSize: 18,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loginButton: {
    zIndex: 10,
    elevation: 10,
    position: "absolute",
    bottom:
      Platform.OS === "ios"
        ? Dimensions.get("screen").height > 667
          ? 85
          : 70
        : 70,
    width: "100%",
    height: 70,
    backgroundColor: "#F5E100",
    flex: 0,
    justifyContent: "center",
  },
  signupButton: {
    zIndex: 9,
    elevation: 9,
    position: "absolute",
    width: "100%",
    height:
      Platform.OS === "ios"
        ? Dimensions.get("screen").height > 667
          ? 85
          : 70
        : 70,
    backgroundColor: "#FF416E",
    flex: 0,
    justifyContent: "center",
  },
  underButtons: {
    zIndex: 0,
    elevation: 0,
    width: "100%",
    height:
      Platform.OS === "ios"
        ? Dimensions.get("screen").height > 667
          ? 155
          : 140
        : 140,
    backgroundColor: "#E9E9E9",
  },
  loginText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    color: "black",
  },
  signupText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
    marginBottom:
      Platform.OS === "ios"
        ? Dimensions.get("screen").height > 667
          ? 10
          : 0
        : 0,
    color: "white",
  },
});

export default WelcomeScreen;
