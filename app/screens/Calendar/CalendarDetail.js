import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  Dimensions,
} from "react-native";
import axios from "axios";
import EventCalendar from "react-native-events-calendar";

let { width } = Dimensions.get("window");

export default function CalendarDetail({ route }) {
  const [events, setEvents] = React.useState(null);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "https://api.c4k60.com/v2.0/calendar/list/"
      );
      setEvents(response.data);
    } catch (error) {
      console.error(new Error().stack, error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <EventCalendar
          eventTapped={() => {}}
          // Function on event press
          events={events}
          // Passing the Array of event
          width={width}
          // Container width
          size={60}
          initDate={route.params.date}
          // number of date will render before and after initDate
          // (default is 30 will render 30 day before initDate
          // and 29 day after initDate)
          // Show initial date (default is today)
          scrollToFirst={true}
          // Scroll to first event of the day (default true)
          // renderEvent={(event) => <Text>{event.title}</Text>}
          //   onTitlePress={(date) => alert("Title Pressed")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  dateText: {
    margin: 16,
  },
});
