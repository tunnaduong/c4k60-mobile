import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
  TouchableHighlight,
  ScrollView,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SearchScreen({ navigation }) {
  const inputRef = React.useRef();

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
      <View style={styles.topBar}>
        <TouchableHighlight
          style={styles.backButton}
          underlayColor="rgba(0, 0, 0, .15)"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back-outline" color="black" size={30} />
        </TouchableHighlight>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "#DFDEDD",
            borderRadius: 50,
            paddingLeft: 13,
            paddingVertical: 8,
          }}
        >
          <TextInput
            style={{
              fontSize: 17,
            }}
            placeholder={"Tìm kiếm trên C4K60"}
            // onChangeText={onChangeText}
            // value={value}
            // onKeyPress={onKeyPress}
            ref={inputRef}
          ></TextInput>
        </View>
      </View>
      <ScrollView>
        <View style={styles.searchImage}>
          <Image
            source={require("../assets/search-main.png")}
            style={styles.image}
          />
          <Text style={{ textAlign: "center", fontSize: 16, color: "gray" }}>
            Thử bắt đầu bằng cách tìm kiếm thông báo lớp, bạn bè, số điện
            thoại...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    width: 40,
    height: 40,
    borderRadius: 35,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DFDEDD",
  },
  searchImage: {
    height: Dimensions.get("window").height * 0.5,
    margin: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
