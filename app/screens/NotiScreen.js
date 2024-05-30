import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import "moment/locale/vi";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Badge } from "react-native-elements";
import UserAvatar from "../components/UserAvatar";
import { Divider } from "react-native-elements/dist/divider/Divider";
import { storage } from "../global/storage";
import ImageView from "react-native-image-viewing";
import axios from "axios";

export class NotiImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  render() {
    if (this.props.imagepath !== "no") {
      return (
        <>
          <TouchableOpacity onPress={this.props.onPress}>
            <Image
              key={this.props.id}
              resizeMode="contain"
              style={{
                width: Dimensions.get("window").width,
                height: Math.round((Dimensions.get("window").width * 1) / 1),
              }}
              source={{ uri: this.props.imagepath }}
              onPress={this.props.onPress}
              onLoadEnd={() => this.setState({ loading: false })}
            />
            <ActivityIndicator
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              animating={this.state.loading}
            />
          </TouchableOpacity>
        </>
      );
    } else {
      return <View></View>;
    }
  }
}

let Images = [];

export default class NotiScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "",
      visible: false,
      imageIndex: 0,
    };

    this.AddItemsToArray(this.props.route.params.id);
    this.username = storage.getString("username");
  }

  componentDidMount() {
    this._removeScreen = this.props.navigation.addListener(
      "beforeRemove",
      () => {
        // do something
        Images = [];
      }
    );
  }

  componentWillUnmount() {
    this._removeScreen();
  }

  async AddItemsToArray(id) {
    try {
      const response = await axios.post(
        "https://c4k60.com/api/getNotifImages.php",
        JSON.stringify({ id: id })
      );
      response.data.map((n) => this.addImage(n.uri));
    } catch (err) {
      console.error(err);
    }
  }

  addImage = (uri) => {
    Images.push({
      uri: uri,
    });
  };

  setVisible = () => {
    this.setState({ visible: false });
  };

  setTrue = (index) => {
    this.setState({ visible: true, imageIndex: index });
  };

  render() {
    const { title, content, date, by, image } = this.props.route.params;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <FlatList
            style={{ flex: 1 }}
            ListHeaderComponent={
              <>
                <View style={styles.container}>
                  <Text style={styles.title}>{title}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons name={"time-outline"} size={15} />
                    <Text style={styles.date}>
                      {moment(date).format("Do MMMM, YYYY [lúc] H:mm")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons name={"person-outline"} size={15} />
                    <Text style={styles.date}>Người đăng: {by}</Text>
                  </View>
                  <Text style={styles.content}>{content}</Text>
                </View>
                <ImageView
                  images={Images}
                  imageIndex={this.state.imageIndex}
                  visible={this.state.visible}
                  onRequestClose={this.setVisible}
                />
              </>
            }
            keyExtractor={(item, index) => index.toString()}
            data={image}
            renderItem={({ item }) => {
              return (
                <View style={styles.flatlistwrapper}>
                  <NotiImage
                    imagepath={item.url}
                    id={item.img_id}
                    onPress={() => {
                      this.setTrue(item.img_id - 1);
                    }}
                  />
                </View>
              );
            }}
            ListFooterComponent={
              <>
                <Divider style={{ marginTop: 20 }} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 19,
                      fontWeight: "bold",
                    }}
                  >
                    Bình luận
                  </Text>
                  <Badge
                    status="primary"
                    value={0}
                    containerStyle={{ marginLeft: 5 }}
                  />
                </View>
              </>
            }
          />
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 1,
              shadowRadius: 6.27,
              backgroundColor: "white",
              elevation: 10,
            }}
          >
            <View
              style={{
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 10,
                width: "100%",
                backgroundColor: "#F2F2F1",
                paddingBottom:
                  Platform.OS === "ios"
                    ? Dimensions.get("screen").height > 667
                      ? 25
                      : 10
                    : 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <UserAvatar
                  username={this.username}
                  style={styles.commentAvatar}
                />
                <Pressable
                  onPress={() => {
                    this.inputText.focus();
                  }}
                  style={styles.commentBox}
                >
                  <TextInput
                    ref={(ref) => (this.inputText = ref)}
                    style={
                      Platform.OS === "web"
                        ? {
                            fontSize: 14,
                            flex: 1,
                            lineHeight: 25,
                          }
                        : {
                            fontSize: 14,
                            flex: 1,
                          }
                    }
                    placeholder="Nhập bình luận..."
                    multiline={true}
                  ></TextInput>
                  <Ionicons
                    style={{
                      textAlign: "right",
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}
                    name={"camera-outline"}
                    size={25}
                  />
                </Pressable>
                <Pressable
                  style={{
                    alignItems: "center",
                    paddingLeft: 10,
                  }}
                >
                  <Ionicons name={"send"} size={25} color={"#007AFF"} />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 18,
  },
  title: { fontWeight: "bold", fontSize: 25 },
  date: { fontSize: 15, marginLeft: 3 },
  content: { fontSize: 16, marginTop: 10 },
  commentBox: {
    backgroundColor: "#DFDEDD",
    height: 40,
    width: "79%",
    borderRadius: 50,
    padding: 7,
    paddingLeft: 13,
    flexDirection: "row",
    flex: 1,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
});
