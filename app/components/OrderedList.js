import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default OrderedList = ({ items }) => {
  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.index}>{index + 1}.</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  index: {
    fontSize: 18,
    marginRight: 5,
  },
  itemText: {
    fontSize: 18,
  },
});
