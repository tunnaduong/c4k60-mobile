import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../global/storage";
import UserAvatar from "../../components/UserAvatar";

const AddProfilePicture = ({ navigation }) => {
  const username = storage.getString("username");

  const handlePress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate("AvatarSelected", {
        image: result.assets[0].uri,
      });
    }
  };

  React.useEffect(() => {
    return () => {
      storage.set("isFirstTimeUse", true);
    };
  }, []);

  const handleExit = () => {
    storage.set("isFirstTimeUse", true);
    navigation.goBack();
  };

  return (
    <View className="bg-white flex-1">
      <SafeAreaView className="mt-7 flex-1">
        <View className="my-14 items-center flex-1">
          <Pressable onPress={handlePress}>
            <View className="rounded-full bg-gray-200 w-32 h-32 border-solid border-white border-2 shadow-sm items-center justify-center">
              <UserAvatar
                username={username}
                style={{ height: 120, width: 120, borderRadius: 64 }}
              />
            </View>
          </Pressable>
          <Text className="mt-4 font-medium text-[16px]">Sửa ảnh đại diện</Text>
          <Text className="mt-1.5 font-light text-gray-600">
            Chọn ngay 1 bức ảnh đẹp nhất của bạn
          </Text>
        </View>
        <View className="my-4 space-y-2">
          <TouchableOpacity
            onPress={handlePress}
            className="bg-[#10A7FF] mx-4 h-10 rounded-lg justify-center items-center flex-row"
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text className="font-medium text-center text-white ml-1.5">
              Chọn từ thư viện
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExit}
            className="bg-white mx-4 h-10 rounded-lg justify-center items-center flex-row border-[0.5px] border-gray-300"
          >
            <Text className="font-medium text-center text-black ml-1.5">
              Cập nhật sau
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AddProfilePicture;
