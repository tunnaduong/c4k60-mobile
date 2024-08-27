import axios from "axios";

export default async function updateLastActivity(username) {
  const response = await axios.get(
    "https://c4k60.tunnaduong.com/api/v1.0/users/online/?username=" + username
  );
  console.log("last-activity", response.data);
}
