import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { storage } from "../../global/storage";
import ProgressHUD from "../../components/ProgressHUD";

const AvatarSelected = ({ navigation, route }) => {
  const [imageUri, setImageUri] = React.useState(route.params.image);
  const [originalUri, setOriginalUri] = React.useState(route.params.image); // Add this line
  const [visible, setVisible] = React.useState(false);
  const username = storage.getString("username");

  React.useEffect(() => {
    setImageUri(route.params.image);
    // Store the original image when first loading
    if (!originalUri) {
      setOriginalUri(route.params.image);
    }
  }, [route.params.image]);

  const uploadImage = () => {
    let formData = new FormData();
    const uri = imageUri;
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const imageName = `avatar_${uri.split("/").pop()}`;
    formData.append("username", username);
    formData.append("avatar", {
      uri,
      name: imageName,
      type: `image/${fileType}`,
    });
    setVisible(true);
    // Upload image to server
    axios
      .post("https://api.c4k60.com/v2.0/users/avatar/upload", formData)
      .then((res) => {
        setVisible(false);
        console.log(res.data);
        Alert.alert(
          "Tải ảnh lên thành công. Có thể mất một thời gian để cập nhật ảnh mới."
        );
        navigation.navigate("MainScreen");
      })
      .catch((err) => {
        console.log(err);
        setVisible(false);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity onPress={uploadImage}>
          <Text className="text-blue-500 text-lg">Đăng</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      <ProgressHUD loadText="Đang tải lên..." visible={visible} />
      <View className="bg-white flex-1 p-4">
        <Pressable onPress={Keyboard.dismiss}>
          <>
            <View className="flex-row items-center mb-6">
              <Text className=" text-[#9395A6]">Đến: </Text>
              <Ionicons name="earth" size={19} color="#9395A6" />
              <Text className="font-semibold text-[#9395A6]"> Công khai</Text>
            </View>
            <View className="flex-1 items-center">
              <View
                className="w-72 h-72 rounded-full border-4 border-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full rounded-full"
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <View className="absolute right-5 bottom-5 bg-gray-200 w-11 h-11 rounded-full items-center justify-center border-4 border-white">
                    <Ionicons name="camera" size={25} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CropAvatar", { image: originalUri })
                }
              >
                <View className="p-2.5 bg-gray-300 rounded-lg flex-row items-center mt-4">
                  <Ionicons name="crop" size={17} />
                  <Text className="text-black font-medium"> Chỉnh sửa</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        </Pressable>
      </View>
    </>
  );
};

export default AvatarSelected;
