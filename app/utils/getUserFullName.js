import axios from "axios";

export const getUserFullName = async (username, type = "full_name") => {
  try {
    if (type == "full_name") {
      const response = await axios.post("https://c4k60.com/api/v1.0/users/", {
        username: username,
      });
      return response.data.info.full_name;
    } else {
      const response = await axios.post("https://c4k60.com/api/v1.0/users/", {
        username: username,
      });
      return response.data.info.last_name;
    }
  } catch (err) {
    return err;
  }
};
