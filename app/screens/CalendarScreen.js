import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import axios from "axios";
import CalendarPicker from "react-native-calendar-picker";
import * as Calendar from "expo-calendar";

async function getDefaultCalendarSource() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  const defaultCalendars = calendars.filter(
    (each) => each.source.name === "Default"
  );
  return defaultCalendars.length
    ? defaultCalendars[0].source
    : calendars[0].source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: "Expo Calendar",
    color: "blue",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: "internalCalendarName",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
  return newCalendarID;
}

export default function CalendarScreen() {
  const [selectedStartDate, setSelectedStartDate] = React.useState(null);
  const [friendNameText, setFriendNameText] = React.useState("");
  const startDate = selectedStartDate ? selectedStartDate.toString() : "";

  React.useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        console.log("Here are all your calendars:");
        console.log({ calendars });
      }
    })();
  }, []);

  const addNewEvent = async () => {
    try {
      const calendarId = await createCalendar();

      const res = await Calendar.createEventAsync(calendarId, {
        endDate: getAppointementDate(startDate),
        startDate: getAppointementDate(startDate),
        title: "Happy Birthday buddy " + friendNameText,
      });
      Alert.alert("Event Created!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        onChangeText={setFriendNameText}
        value={friendNameText}
        placeholder="Enter the name of your friend"
        style={styles.input}
      />
      <CalendarPicker onDateChange={setSelectedStartDate} />
      <Text style={styles.dateText}>Birthday: {startDate}</Text>
      <Button title={"Add to calendar"} onPress={addNewEvent} />
    </ScrollView>
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
