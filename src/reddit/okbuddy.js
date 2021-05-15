import { authenticate } from "./auth.js";
import axios from "axios";
const baseURL = "https://oauth.reddit.com/r/";
export default class OKBuddy {
  auth = undefined;
  memes = [];
  current = 0;
  subreddit = "okbuddyretard";

  constructor() {
    this.refreshToken().then(async (result) => {
      if (result.access_token) {
        this.memes = await this.getHotMemes();
      }
    });
    setInterval(() => this.refreshToken(), 1800000);
  }

  async setSub(name) {
    if (typeof name === "string") {
      this.subreddit = name;
      this.memes = await this.getHotMemes();
      this.current = 0;
    } else console.error("subreddit name has to be string");
  }

  async refreshToken() {
    console.log("refreshing token..");
    this.auth = await authenticate();
    if (this.auth.access_token) console.log("Reddit API: ready for memes");
    else console.log("Auth couldn't be refreshed.");
    return this.auth;
  }

  async getHotMemes() {
    const subredditURL = baseURL + this.subreddit;
    let response = {};
    try {
      response = await axios.get(`${subredditURL}/hot`, {
        headers: {
          Authorization: `bearer ${this.auth.access_token}`,
        },
      });
    } catch (err) {
      console.error(err);
      return [];
    }
    const listings = response.data?.data?.children;
    if (listings.length === 0 || !listings) {
      console.error("No response or data found.");
      return [];
    }
    const memes = listings
      .filter((listing) => {
        const notModPost = listing.data?.distinguished === null;
        const isVideo = listing.data?.is_video;
        const isGallery = listing.data?.is_gallery;
        const sfw = listing.data?.over_18 === false;
        return notModPost && !isVideo && sfw && !isGallery;
      })
      .sort((a, b) => b.data?.ups - a.data?.ups);
    return memes;
  }

  getRandomMeme() {
    if (this.memes.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * this.memes.length);
    return this.memes[randomIndex].data;
  }

  getNextMeme() {
    if (this.memes.length === 0) return undefined;
    if (this.current === this.memes.length) this.current = 0;
    return this.memes[this.current++].data;
  }
}
