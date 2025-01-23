import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import moment from "moment";

const Changelogs = () => {
  const [logs, setLogs] = React.useState(null);

  React.useEffect(() => {
    axios.get("https://api.c4k60.com/v2.0/changelogs").then((response) => {
      setLogs(response.data);
    });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {logs == null ? (
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
            <Text style={{ marginTop: 15 }}>Đang tải những thay đổi...</Text>
          </View>
        </>
      ) : (
        logs.map((log, index) => (
          <View key={index} style={styles.logEntry}>
            <Text style={styles.version}>Phiên bản {log.version}</Text>
            <Text style={styles.date}>
              {moment(log.release_date).format("DD/MM/YYYY")}
            </Text>
            {log.changelogs.split("\n").map((change, changeIndex) => (
              <Text key={changeIndex} style={styles.change}>
                • {change}
              </Text>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  logEntry: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  version: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  change: {
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
});

export default Changelogs;
