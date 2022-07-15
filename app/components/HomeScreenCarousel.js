import React from "react";
import { View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from "./CarouselCardItem";
import data from "../global/carouselData";

export default function HomeScreenCarousel({ style }) {
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);
  return (
    <>
      <View style={style}>
        <Carousel
          data={data}
          ref={isCarousel}
          renderItem={CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          onSnapToItem={(index) => setIndex(index)}
          inactiveSlideScale={0.8}
          loop
          autoplay
        />
      </View>
      <Pagination
        dotsLength={data.length}
        carouselRef={isCarousel}
        activeDotIndex={index}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
        }}
        containerStyle={{ paddingVertical: 0, marginBottom: 10 }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
        tappableDots={true}
      />
    </>
  );
}