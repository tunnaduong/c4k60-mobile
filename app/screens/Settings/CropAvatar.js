import { Platform, TouchableOpacity, Text } from "react-native";
import React from "react";
import { CropView } from "react-native-image-crop-tools";

const cropViewRef = React.createRef();

const CropAvatar = ({ navigation, route }) => {
  const { image } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => cropViewRef.current.saveImage(true, 60)}
        >
          <Text className="text-blue-500 text-lg">Xong</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      <CropView
        sourceUrl={image}
        ref={cropViewRef}
        className="flex-1"
        onImageCrop={(res) => {
          // console.warn(res);
          console.log(res.uri.slice(150, res.uri.length));

          navigation.navigate({
            name: "AvatarSelected",
            params: {
              image: Platform.OS == "android" ? "file://" + res.uri : res.uri,
            },
            merge: true,
          });
        }}
        keepAspectRatio
        aspectRatio={{ width: 1, height: 1 }}
      />
    </>
  );
};

export { CropAvatar, cropViewRef };
