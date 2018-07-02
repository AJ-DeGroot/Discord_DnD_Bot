const botconfig = require("./config.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const token = process.env.token;

const times = x => f => {
  if (x > 0) {
    f()
    times (x - 1) (f)
  }
}

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online.`);
  bot.user.setActivity('!roll help', {type: 'STREAMING' })
});

bot.on("message", async message => {
  if(message.author.bot) return;
  // if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.toLowerCase().split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  //Format !roll #d# #d#+# #d#++#
  if(cmd === `${prefix}roll` && args[0] != "help"){
    let newArgs = args;
    let totalOfAllRolls = 0;
    let diceRolls = [];

    for (var x of newArgs) {
      let localResult = 0;
      let isAddOrSub = 1;
      let splitValues = x.split("+");
      if (splitValues.toString().includes("-")){
        splitValues = x.split("-");
        isAddOrSub = -1;
      }
      let diceSize = splitValues[0].split("d")[1];
      let diceCount = splitValues[0].split("d")[0];
      let currentRolls = [];
      let addBonusToAll = 0;

      //Generate Random Rolls
      function createRolls(diceCount, diceSize, thisBonus) {
        times (diceCount) (() => currentRolls.push((Math.floor(Math.random() * diceSize) + 1)));
        if (thisBonus != 0) {
          currentRolls.push(thisBonus * isAddOrSub);
        }
      }

      //String Together and Store; Local Rolls, Total Rolls, and Results of Rolls
      function evaluateResults(rolls) {
        diceRolls = diceRolls + x + ", ";
        for (var [index, roll] of rolls.entries()){
          roll = Number(roll) + Number(addBonusToAll * isAddOrSub);
          localResult = Number(localResult) + Number(roll);

          if (rolls.length === 1){
            diceRolls = diceRolls + "**" + roll.toString() + "**" + "\n";
          } else if (index === rolls.length - 1){
            diceRolls = diceRolls + roll.toString() + "=" + "**" + localResult + "**" + "\n";
          } else if (Number(rolls[index + 1] + Number(addBonusToAll * isAddOrSub)).toString().includes("-")) {
            diceRolls = diceRolls + roll.toString();
          } else {
            diceRolls = diceRolls + roll.toString() + "+";
          }
        }
        totalOfAllRolls = totalOfAllRolls + localResult;
      }

      //Check and Process the Type of Roll: #d#, #d#+#, #d#++#
      //#d#++#
      if (splitValues[1] === '' && splitValues[2] >= 0){
        addBonusToAll = splitValues[2];
        createRolls(diceCount, diceSize, 0);
        evaluateResults(currentRolls);

        //#d#
      } else if (isNaN(splitValues[1]) || (splitValues[1] === '0')) {
        createRolls(diceCount, diceSize, 0);
        evaluateResults(currentRolls);

        //#d#+#
      } else {
        createRolls(diceCount, diceSize, splitValues[1]);
        evaluateResults(currentRolls);
      }
    }

  //Delete User Original Message and Return Result of Dice Rolls
  message.delete().catch(O_o=>{});
  return message.channel.send(`${message.author} rolled: **${totalOfAllRolls}**.\n${diceRolls}`);
  }

  if(cmd === `${prefix}roll` && args[0] === 'help'){
    return message.channel.send("**Commands for Rolling Dice: Use `!roll`**\n\n__Examples__\n```!roll 1d20\n!roll 3d4+2\n!roll 1d20-2 5d6\n!roll 3d20++2```\n\n__Possible Inputs__\n```#d#, #d#+#, #d#-#, #d#++#, #d#--#```\n\n__#d#__\nThe first number is how many dice.\nThe second number is the dice size.\n```!roll 3d4\n!roll 1d4 1d20```\n\n__#d#+# and #d#-#__\nThe first number is how many dice.\nThe second number is the dice size.\nThe third number is the bonus applied to the total.\nThe + or - either adds or subtracts the bonus.```!roll 2d4+2\n!roll 1d20-2 4d5+2```\n\n__#d#++# and #d#--#__\nThe first number is how many dice.\nThe second number is the dice size.\nThe third number is the bonus applied to each individual roll.\nThe ++ or -- either adds or subtract the bonus.\n```!roll 2d20++2\n!roll 5d20++1 3d5--2 2d8++1```");
  }

});

// bot.login(botconfig.token);
bot.login(token);
