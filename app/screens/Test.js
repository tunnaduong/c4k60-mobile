import React from "react";
import { View, Text } from "react-native";

export default function Test(props) {
  const [temp, setTemp] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTemp((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <View>
      <Text>{temp}</Text>
      {props.logger}
    </View>
  );
}
