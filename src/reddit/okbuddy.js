import { authenticate } from "./auth.js";
import axios from "axios";
let baseURL = 'https://oauth.reddit.com/r/';
export default class OKBuddy {
  auth = undefined;
  memes = [];
  current = 0;
  subreddit = 'okbuddyretard';
  
  constructor(){
    this.refreshToken().then(async data => {
      if(data.access_token){
        this.memes = await this.getHotMemes();
        console.log('Reddit API: ready for memes');
        setInterval(this.refreshToken, data.expires_in * 1000);
      }
    })
  }

  async setSub(name){
    if(typeof name === 'string'){
      this.subreddit = name;
      this.memes = await this.getHotMemes();
      this.current = 0;
    }
    else console.error('subreddit name has to be string');
  }

  async refreshToken(){
    this.auth = await authenticate();
    return this.auth;
  }

  async getHotMemes(){
    let subredditURL = baseURL + this.subreddit;
    const response = await axios.get(`${subredditURL}/hot`, {
      headers: {
        'Authorization': `bearer ${this.auth.access_token}`
      }
    })
    const listings = response.data.data.children;
    const memes = listings.filter(listing => {
      let notModPost = listing.data?.distinguished === null;
      let isVideo = listing.data?.is_video;
      let isGallery = listing.data?.is_gallery;
      let sfw = listing.data?.over_18 === false;
      return notModPost && !isVideo && sfw && !isGallery;
    }).sort((a,b) =>
      b.data?.ups - a.data?.ups
    );
    return memes;
  }

  getRandomMeme(){
    let randomIndex = Math.floor(Math.random() * this.memes.length);
    return this.memes[randomIndex].data;
  }

  getNextMeme(){
    if(this.current === this.memes.length) this.current = 0;
    return this.memes[this.current++].data;
  }
}