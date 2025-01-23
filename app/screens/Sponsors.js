import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import OrderedList from "../components/OrderedList";

export default function Sponsors({ navigation }) {
  const [sponsors, setSponsors] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("https://api.c4k60.com/v2.0/sponsors")
      .then((response) => {
        setSponsors(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      {sponsors == null ? (
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
            <Text style={{ marginTop: 15 }}>Đang tải nhà tài trợ...</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.text}>
            C4K60 Web và C4K60 Mobile có thể đã không được tồn tại mà không có
            sự hỗ trợ từ các mạnh thường quân sau:
          </Text>
          {sponsors.map((sponsor) => (
            <TouchableOpacity
              key={`key-${sponsor.id}`}
              style={styles.sponsor}
              className="flex-row items-center"
              onPress={() => {
                if (sponsor.username == null) {
                  return;
                }
                navigation.navigate("ProfileDetail", {
                  name: sponsor.name,
                  username: sponsor.username,
                });
              }}
            >
              <Image
                source={
                  sponsor.username == null
                    ? require("../assets/userdefault.jpeg")
                    : {
                        uri:
                          "https://api.c4k60.com/v2.0/users/avatar/" +
                          sponsor.username,
                      }
                }
                style={{ width: 60, height: 60, borderRadius: 50 }}
              />
              <View className="flex-col ml-3">
                <Text style={styles.sponsorText}>{sponsor.name}</Text>
                <Text className="text-lg">{sponsor.amount}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.text} className="mt-3">
            Bạn muốn ủng hộ cho dự án này? Mình rất cảm ơn tấm lòng của bạn.
            Dưới đây là các kênh thanh toán mình đang mở:
          </Text>
          <OrderedList
            items={[
              "Techcombank: 8821112003",
              "TP Bank: 21112003210",
              "MoMo: 0707006421",
              "Viettel Money: 9704229245853309",
              "MSB: 03801017934767",
              "PayPal: paypal.me/techup",
            ]}
          />
          <Text style={styles.text}>Chủ tài khoản: Dương Tùng Anh</Text>
          <View className="items-center my-6">
            <Image
              source={require("../assets/qr-payment.jpg")}
              style={{ width: 200, height: 200 }}
            />
          </View>
          <Text style={styles.text}>
            Cảm ơn các bạn một lần nữa vì đã quan tâm và ủng hộ dự án này của
            mình! Nó có ý nghĩa về mặt tinh thần rất lớn đối với mình!
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 18,
    backgroundColor: "#fff",
  },
  title: { fontWeight: "bold", fontSize: 25 },
  text: { fontSize: 16, marginHorizontal: 3 },
  sponsor: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
  },
  sponsorText: { fontWeight: "bold", fontSize: 20 },
});
