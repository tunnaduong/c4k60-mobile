import React from "react";
import { TouchableOpacity, View, TextInput, Dimensions } from "react-native";
import UserAvatar from "./UserAvatar";
import Ionicons from "react-native-vector-icons/Ionicons";

const CommentChat = React.forwardRef(
  (
    {
      username,
      placeholderText,
      onSubmit,
      onUpload,
      onChangeText,
      value,
      onKeyPress,
    },
    ref
  ) => {
    return (
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          backgroundColor: "white",
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
              username={username}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
              }}
              containerStyle={{ marginRight: 10 }}
            />
            <View
              style={{
                backgroundColor: "#DFDEDD",
                height: 40,
                borderRadius: 50,
                padding: 7,
                paddingLeft: 13,
                flexDirection: "row",
                flex: 1,
              }}
            >
              <TextInput
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
                placeholder={placeholderText}
                multiline={true}
                ref={ref}
                onChangeText={onChangeText}
                value={value}
                onKeyPress={onKeyPress}
              ></TextInput>
              <TouchableOpacity onPress={onUpload}>
                <Ionicons
                  style={{
                    textAlign: "right",
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  name={"camera-outline"}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
                paddingLeft: 10,
              }}
              onPress={onSubmit}
            >
              <Ionicons name={"send"} size={25} color={"#007AFF"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

export default CommentChat;
