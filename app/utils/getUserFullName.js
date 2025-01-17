import axios from "axios";

export const getUserFullName = async (username, type = "full_name") => {
  try {
    if (type == "full_name") {
      const response = await axios.post("https://api.c4k60.com/v2.0/users", {
        username: username,
      });
      return response.data.info.full_name;
    } else {
      const response = await axios.post("https://api.c4k60.com/v2.0/users", {
        username: username,
      });
      return response.data.info.last_name;
    }
  } catch (err) {
    return err;
  }
};
