const botconfig = require("./config.json");
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
    let diceRolls = "";
    let rollBonus = 0;

    for (var x of newArgs){
      let diceCount = x[0];
      let diceSize = x.split("+")[0].slice(2);
      let currentRolls = [];
      let localRolls = 0;

      if (isNaN(x.split("+")[1])){
      } else {
          rollBonus = Number(rollBonus) + Number(x.split("+")[1]);
      }

      times (diceCount) (() => currentRolls.push((Math.floor(Math.random() * diceSize) + 1)));

      diceRolls = diceRolls + "(" + (x.split("+")[0]).toString() + ": ";

      for (var [index, r] of currentRolls.entries()){

        diceResults.push(r);
        localRolls = Number(localRolls) + Number(r);

        if (index === currentRolls.length - 1) {
          diceRolls = diceRolls + r.toString() + " = " + localRolls;
        } else {
          diceRolls = diceRolls + r.toString() + " + ";
        }
      }

      diceRolls = diceRolls + ")"
    }

    for (var n of diceResults){
      diceTotal = Number(diceTotal) + Number(n);
    }
    diceTotal = Number(diceTotal) + Number(rollBonus);

    message.delete().catch(O_o=>{});
    return message.channel.send(`${message.author} rolled: **${diceTotal}**.\n ${diceRolls}`);

  }
});

bot.login(botconfig.token);
