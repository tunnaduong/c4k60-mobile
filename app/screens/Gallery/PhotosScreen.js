import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { Image } from "expo-image";
import ImageView from "react-native-image-viewing";
import ImageFooter from "../../components/ImageFooter";

export default function PhotosScreen({ navigation, route }) {
  const [photos, setPhotos] = React.useState(null);
  const [visible, setIsVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [Images, setImages] = React.useState([]);

  React.useEffect(() => {
    getPhotos();
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      setImages([]);
    });

    return unsubscribe;
  }, []);

  const addImage = (uri) => {
    setImages((prevImages) => [...prevImages, { uri }]);
  };

  const getPhotos = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/gallery/photos?album=" +
          route.params.id
      );
      setPhotos(response.data);
      response.data.map((n) =>
        addImage("https://c4k60.tunnaduong.com/anhvavideo/" + n.path)
      );
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
        padding: 2,
        paddingBottom: 40,
      }}
    >
      {photos == null ? (
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
            <Text style={{ marginTop: 15 }}>Đang tải thư viện ảnh...</Text>
          </View>
        </>
      ) : (
        photos.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              width: "33%",
              padding: 2,
            }}
            activeOpacity={0.6}
            onPress={() => {
              setIsVisible(true);
              setIndex(index);
            }}
          >
            <Image
              source={
                "https://c4k60.tunnaduong.com/anhvavideo/" + item.thumb_path
              }
              style={{
                width: "100%",
                height: 130,
              }}
            ></Image>
          </TouchableOpacity>
        ))
      )}
      <SafeAreaView>
        <ImageView
          images={Images}
          imageIndex={index}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
          FooterComponent={({ imageIndex }) => (
            <ImageFooter imageIndex={imageIndex} imagesCount={Images.length} />
          )}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
