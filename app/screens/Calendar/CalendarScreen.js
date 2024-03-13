import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = React.useState(null);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://c4k60.tunnaduong.com/api/v1.0/calendar/list/"
      );
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {events == null ? (
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
            <Text style={{ marginTop: 15 }}>Đang tải lịch...</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.calendarContainer}>
            <CalendarPicker
              onDateChange={(date) => {
                navigation.navigate("CalendarDetail", {
                  date: moment(date, "YYYY-MM-DD").toString(),
                });
              }}
              weekdays={["CN", "T2", "T3", "T4", "T5", "T6", "T7"]}
              months={[
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12",
              ]}
              previousTitle="Trước"
              nextTitle="Sau"
            />
          </View>
          <Text style={styles.textEvents}>Sự kiện sắp tới</Text>

          <View style={styles.flatListContainer}>
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => {
                    navigation.navigate("CalendarDetail", {
                      date: moment(item.start, "YYYY-MM-DD").toString(),
                    });
                  }}
                >
                  <Text style={styles.textDate}>
                    {new Date(item.start).toLocaleDateString()}
                  </Text>
                  <Text style={styles.eventText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  calendarContainer: {
    marginTop: 10,
  },
  textEvents: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 40,
    fontSize: 20,
    fontWeight: "bold",
  },
  flatListContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
  },
  itemContainer: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#E1BEE7",
    paddingBottom: 5,
    marginBottom: 15,
    paddingLeft: 5,
  },
  textDate: {
    fontWeight: "bold",
  },
  eventText: {
    fontSize: 16,
    marginTop: 5,
  },
});
