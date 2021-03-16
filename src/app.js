import { Client, Message, MessageEmbed } from "discord.js";
import { config } from "dotenv";
import OKBuddy from "./reddit/okbuddy.js";
config(); // loads the .env contents into process.env

const client = new Client(); // Discord Client.
let okb = new OKBuddy(); //OKBuddy representative.
client.once("ready", async () => {
  console.log("okbuddy has connected!");
});

client.on("message", (msg) => {
  if (!okb.auth) {
    msg.reply("Reddit API being cringe, check it.");
    return;
  }

  if (msg.content.toLowerCase() === "okb") {
    const meme = okb.getNextMeme();
    const memeEmbed = new MessageEmbed()
      .setURL("https://reddit.com" + meme.permalink)
      .setTitle(meme.title)
      .setImage(meme.url)
      .setFooter(`👍 ${meme.ups}  |  💬 ${meme.num_comments}`);
    msg.channel.send(memeEmbed);
  }

  if(msg.content.toLowerCase().startsWith('okb set-sub ')) {
    let newSub = msg.content.substring(12);
    console.log(newSub);
    if(newSub.length <= 2){
      msg.channel.send("Highly doubt that's a subreddit, not setting.");
      return;
    }
    okb.setSub(newSub).then(() => {
      console.log('Subreddit changed to: ' + newSub);
    });
  }

  if (msg.content.toLowerCase() === "okb pain") {
    const pain = new MessageEmbed().setImage(
      "https://i.kym-cdn.com/photos/images/newsfeed/001/623/463/d90.jpg"
    );
    msg.channel.send(pain);
  }

  if (msg.content.toLowerCase() === "okb hope") {
    const hopium = new MessageEmbed().setImage(
      "https://i.redd.it/mll25v5ad4w51.jpg"
    );
    msg.channel.send(hopium);
  }

  if (msg.content.toLowerCase() === "okb help") {
    let help = "okb -- next hot meme from currently selected subreddit";
    help += "\nokb set-sub <subreddit> -- selects new subreddit";
    help += "\nokb hope -- sends wojack on hope";
    help += "\nokb pain -- sends wojack on pain";
    msg.channel.send(help);
  }
});

client.login(process.env.DISCORD_CLIENT_TOKEN);