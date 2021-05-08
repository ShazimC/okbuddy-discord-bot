import { config } from "dotenv";
import axios from "axios";
import FormData from "form-data";

config();
const reddit_id = process.env.REDDIT_CLIENT_ID;
const reddit_secret = process.env.REDDIT_CLIENT_SECRET;
const reddit_un = process.env.REDDIT_USERNAME;
const reddit_pw = process.env.REDDIT_PASSWORD;

const authenticate = async () => {
  const form = new FormData();
  form.append("grant_type", "password");
  form.append("username", reddit_un);
  form.append("password", reddit_pw);
  try {
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      form,
      {
        headers: form.getHeaders(),
        auth: {
          username: reddit_id,
          password: reddit_secret,
        },
      }
    );
    if (response.data.access_token) return response.data;
    else Promise.reject("No access token received.");
  } catch (err) {
    console.error(err);
  }
};

export { authenticate };
