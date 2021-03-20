import { authenticate } from "./auth.js";
import axios from "axios";
let baseURL = "https://oauth.reddit.com/r/";
export default class OKBuddy {
  auth = undefined;
  memes = [];
  current = 0;
  subreddit = "okbuddyretard";

  constructor() {
    this.refreshToken();
    setInterval(() => {
      this.refreshToken().then(async (data) => {
        if (data.access_token) {
          this.memes = await this.getHotMemes();
          console.log("Reddit API: ready for memes");
        } else console.log("Auth couldn't be refreshed.");
      });
    }, 350000);
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
    return this.auth;
  }

  async getHotMemes() {
    let subredditURL = baseURL + this.subreddit;
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
    const listings = response.data.data.children;
    if (listings.length === 0 || !listings) {
      console.error("No response or data found.");
      return [];
    }
    const memes = listings
      .filter((listing) => {
        let notModPost = listing.data?.distinguished === null;
        let isVideo = listing.data?.is_video;
        let isGallery = listing.data?.is_gallery;
        let sfw = listing.data?.over_18 === false;
        return notModPost && !isVideo && sfw && !isGallery;
      })
      .sort((a, b) => b.data?.ups - a.data?.ups);
    return memes;
  }

  getRandomMeme() {
    if (this.memes.length === 0) return undefined;
    let randomIndex = Math.floor(Math.random() * this.memes.length);
    return this.memes[randomIndex].data;
  }

  getNextMeme() {
    if (this.memes.length === 0) return undefined;
    if (this.current === this.memes.length) this.current = 0;
    return this.memes[this.current++].data;
  }
}
