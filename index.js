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
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);

  //Format !roll #d# #d#+# #d#++#
  if(cmd === `${prefix}roll`){
    let newArgs = args;
    let totalOfAllRolls = 0;
    diceRolls = [];

    for (var x of newArgs) {
      let localResult = 0;
      let splitValues = x.split("+");
      let diceSize = splitValues[0].slice(2);
      let diceCount = x[0];
      let currentRolls = [];

      //Generate Random Rolls
      function createRolls(diceCount, diceSize, thisBonus) {
        times (diceCount) (() => currentRolls.push((Math.floor(Math.random() * diceSize) + 1)));
        if (thisBonus != 0) {
          currentRolls.push(thisBonus);
        }
      }

      //String Together and Store Local Rolls, Total Rolls, and Results of Rolls
      function evaluateResults(rolls) {
        // diceRolls = diceRolls +
        diceRolls = diceRolls + x + ", ";
        for (var [index, roll] of rolls.entries()){
          localResult = Number(localResult) + Number(roll);

          if (rolls.length === 1){
            diceRolls = diceRolls + roll.toString() + "\n";
          } else if (index === rolls.length - 1){
            diceRolls = diceRolls + roll.toString() + "=" + "**" + localResult + "**" + "\n";
          } else {
          diceRolls = diceRolls + roll.toString() + "+";
          }
        }
        totalOfAllRolls = totalOfAllRolls + localResult;
      }

      //Check and Process the Type of Roll: #d#, #d#+#, #d#++#
      if (splitValues[1] === '' && splitValues[2] >= 0){
        //#d#++#
      } else if (isNaN(splitValues[1])) {
        //#d#
        createRolls(diceCount, diceSize, 0);
        evaluateResults(currentRolls);
      } else {
        //#d#+#
        createRolls(diceCount, diceSize, splitValues[1]);
        evaluateResults(currentRolls);
      }
    }

  //Delete User Message and Return Result
  message.delete().catch(O_o=>{});
  return message.channel.send(`${message.author} rolled: **${totalOfAllRolls}**.\n${diceRolls}`);
  }
});

bot.login(botconfig.token);
