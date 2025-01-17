import axios from "axios";

export default async function updateLastActivity(username) {
  const response = await axios.get(
    "https://api.c4k60.com/v2.0/users/online/?username=" + username
  );
  console.log(new Error().stack, "last-activity", response.data);
}
