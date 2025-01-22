import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { storage } from "../../global/storage";

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const username = storage.getString("username");

  const handleChangePassword = () => {
    // Add logic to handle password change
    if (newPassword === confirmPassword) {
      // Call API to change password
      axios
        .post("https://api.c4k60.com/v2.0/users/change-password", {
          username,
          old_password: currentPassword,
          new_password: newPassword,
        })
        .then(() => {
          Alert.alert("Đổi mật khẩu thành công");
          navigation.goBack();
        })
        .catch((err) => {
          Alert.alert("Đổi mật khẩu thất bại");
          console.log(err.response.data);
        });
    } else {
      Alert.alert("Mật khẩu mới không khớp");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Bạn nên thay đổi mật khẩu của mình trước khi sử dụng ứng dụng
      </Text>
      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Đổi mật khẩu" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default ChangePassword;
