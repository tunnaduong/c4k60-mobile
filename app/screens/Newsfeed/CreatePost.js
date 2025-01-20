import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../../global/storage";
import UserAvatar from "../../components/UserAvatar";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const CreatePost = forwardRef(
  ({ navigation, route, onPostContentChange }, ref) => {
    const [postContent, setPostContent] = useState("");
    const [image, setImage] = useState(route?.params?.image ?? null);
    const [placeholder, setPlaceholder] = useState("Bạn đang nghĩ gì?");
    const [height, setHeight] = useState(150);
    const hasBeenFocused = useRef(false); // Flag to track first focus
    const username = storage.getString("username");
    const name = storage.getString("name");

    useEffect(() => {
      if (route?.params?.image) {
        setPlaceholder("Nói gì đó về bức ảnh này...");
        setHeight(50);
        setTimeout(() => {
          onPostContentChange("postContent");
        }, 0);
      }
    }, [route]);

    // Expose handlePost and postContent via useImperativeHandle
    useImperativeHandle(ref, () => ({
      handlePost,
      postContent,
    }));

    function uniqid(prefix = "", random = false) {
      const sec = Date.now() * 1000 + Math.random() * 1000;
      const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
      return `${prefix}${id}${
        random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
      }`;
    }

    const handlePost = () => {
      let formData = new FormData();
      formData.append("username", username);
      formData.append("content", postContent);
      if (image) {
        const uri = image;
        const uriParts = uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        const imageName = `${uniqid("feed-image-", true)}.${fileType}`;
        formData.append("image", {
          uri,
          name: imageName,
          type: `image/${fileType}`,
        });
      }

      try {
        fetch("https://api.c4k60.com/v2.0/feed/add", {
          method: "POST",
          body: formData,
        });
      } catch (error) {
        console.error("Network Error:", error);
      }

      // Handle post submission logic here
      navigation.goBack();
    };

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        setPlaceholder("Nói gì đó về bức ảnh này...");
        setHeight(50);
        onPostContentChange("abc123");
        setImage(result.uri);
      }
    };

    const handleContentChange = (text) => {
      setPostContent(text);
      // if image is set then return
      if (image) {
        return;
      }
      if (onPostContentChange) {
        onPostContentChange(text); // Notify parent component of content change
      }
    };

    // Reset postContent and notify parent when screen is focused
    useFocusEffect(
      React.useCallback(() => {
        if (!hasBeenFocused.current) {
          // Reset content only the first time the screen is focused
          setPostContent("");
          if (onPostContentChange) {
            onPostContentChange(""); // Notify parent that the content is empty
          }
          hasBeenFocused.current = true;
        }
      }, [onPostContentChange])
    );

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#fff",
      },
      input: {
        height: height,
        borderTopWidth: 0.8,
        borderColor: "#DBDBDB",
        marginBottom: 16,
        textAlignVertical: "top",
        fontSize: 16,
        padding: 15,
        paddingTop: 15,
      },
    });

    return (
      <View style={styles.container}>
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 15 }}
        >
          <UserAvatar
            username={username}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            containerStyle={{ width: 50 }}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: "#333",
              marginLeft: 10,
            }}
          >
            {name}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={postContent}
          onChangeText={handleContentChange} // Pass updated content to parent
          multiline
        />
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 300 }}
          ></Image>
        )}
        <View style={{ borderTopWidth: 0.8, borderColor: "#DBDBDB" }}></View>
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
            }}
          >
            <Ionicons
              name="images"
              size={22}
              color={"#36BF2D"}
              style={{ marginRight: 7 }}
            />
            <Text style={{ fontSize: 16, marginLeft: 5 }}>Thêm ảnh</Text>
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 0.8, borderColor: "#DBDBDB" }}></View>
      </View>
    );
  }
);

export default CreatePost;
