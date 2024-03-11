import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Image } from "expo-image";

export default function GalleryScreen({ navigation }) {
  const [gallery, setGallery] = React.useState(null);

  React.useEffect(() => {
    getGallery();
  }, [gallery]);

  const getGallery = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/gallery/"
      );
      setGallery(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 5,
      }}
    >
      {gallery == null ? (
        <>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              width: "100%",
            }}
          >
            <ActivityIndicator size={"large"} color="#636568" />
            <Text style={{ marginTop: 15 }}>Đang tải album ảnh...</Text>
          </View>
        </>
      ) : (
        gallery.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: "50%",
              padding: 5,
            }}
            activeOpacity={0.7}
            onPress={() => {
              item.type == "video"
                ? navigation.navigate("VideoScreen", {
                    id: item.id,
                    name: item.name,
                  })
                : navigation.navigate("PhotosScreen", {
                    id: item.id,
                    name: item.name,
                  });
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 10,
                borderRadius: 15,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Image
                source={
                  "https://c4k60.tunnaduong.com/anhvavideo/" + item.bg_image
                }
                style={{
                  width: "100%",
                  height: 130,
                  borderRadius: 10,
                  zIndex: 0,
                }}
              ></Image>
              <Text style={{ fontWeight: "600", fontSize: 19, marginTop: 10 }}>
                {item.name}
              </Text>
              <Text>
                {item.total_pic} {item.type}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
