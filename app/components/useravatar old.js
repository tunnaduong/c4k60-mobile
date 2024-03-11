import React from "react";
import { Image, ActivityIndicator, View } from "react-native";

export default class UserAvatar extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     avatar: null,
  //     showDefault: true,
  //   };
  // }

  // GetAvatar = (Username) => {
  //   var APIURL = "https://c4k60.tunnaduong.com/api/getAvatar.php";

  //   var headers = {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   };

  //   var Data = {
  //     username: Username,
  //   };

  //   fetch(APIURL, {
  //     method: "POST",
  //     headers: headers,
  //     body: JSON.stringify(Data),
  //   })
  //     .then((Response) => Response.json())
  //     .then((Response) => {
  //       if (Response.Message == "success") {
  //         const UserAvatar = Response.Avatar;
  //         this.setState({ avatar: UserAvatar });
  //       } else {
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Lỗi khi lấy ảnh đại diện người dùng: " + error);
  //     });
  // };

  render() {
    // this.GetAvatar(this.props.username);
    // var imgSrc =
    //   this.state.showDefault == true
    //     ? require("../assets/gray_load.png")
    //     : this.state.avatar == "default_avatar"
    //     ? require("../assets/userdefault.jpeg")
    //     : { uri: this.state.avatar };
    return (
      <>
        <View>
          <Image
            source={require("../assets/userdefault.jpeg")}
            style={this.props.style}
            // onLoadEnd={() => {
            //   this.setState({ showDefault: false });
            // }}
          />
          {/* <ActivityIndicator
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            animating={this.state.showDefault}
            color="#A7A7A7"
          /> */}
        </View>
      </>
    );
  }
}
