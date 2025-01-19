import React, { useState, useEffect } from "react";
import { View, Image, ActivityIndicator, Dimensions } from "react-native";

export interface ImageDetli {
  width: number;
  height: number;
  url: string;
}

export const ImageRenderer = ({ url }: { url: string }) => {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );
  const [loading, setLoading] = useState(true); // untill we load the image fully
  const [image, setImage] = useState(undefined as ImageDetli | undefined);
  const getSize = async (url: string) => {
    return new Promise((resolve, reject) => {
      // this is very imported so you can keep an eye on the size of the image
      Image.getSize(
        url,
        (width, height) => {
          resolve({
            url: url,
            width: width > windowWidth ? windowWidth : width,
            height: height > windowHeight ? windowHeight : height,
          });
        },
        async (error) => {
          console.log("image not loaded: " + url);
          console.log(error);
          resolve(undefined);
        }
      );
    }) as Promise<ImageDetli | undefined>;
  };

  useEffect(() => {
    (async () => {
      var imageDetali = await getSize(url);
      if (!imageDetali) {
        // load an empty Image or somthing
      } else {
        setImage(imageDetali);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: image.url }}
            style={{
              width: image.width,
              height: image.height,
              resizeMode: "contain",
            }}
          />
        </View>
      )}
    </>
  );
};
