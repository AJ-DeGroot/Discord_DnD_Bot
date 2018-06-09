const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});

const times = x => f => {
  if (x > 0) {
    f()
    times (x - 1) (f)
  }
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online.`);
  bot.user.setActivity('!roll', {type: 'STREAMING' })
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}roll`){
    let newArgs = args;
    let diceResults = [];
    let diceTotal = [];
    let rollBonus = 0;

    for (var x of newArgs){
      console.log(newArgs);
      let diceCount = x[0];
      console.log(diceCount);
      if (isNaN(x.split("+")[1])){

      } else {
      rollBonus = Number(rollBonus) + Number(x.split("+")[1]);
      console.log(rollBonus);
      }
      let diceSize = x.split("+")[0].slice(2);
      console.log(diceSize);

      times (diceCount) (() => diceResults.push((Math.floor(Math.random() * diceSize) + 1)));
    }

    for (var n of diceResults){
      diceTotal = Number(diceTotal) + Number(n);
    }

    diceTotal = Number(diceTotal) + Number(rollBonus);

    console.log(diceResults);
    message.delete().catch(O_o=>{});
    return message.channel.send(`${message.author} rolled: **${diceTotal}**.\n ${diceResults}.\n ${args}`);

  }
});

bot.login(botconfig.token);
