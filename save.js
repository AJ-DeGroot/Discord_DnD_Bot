//TO DO:
//Refractor Code,
//Promises/Edge Cases,
//Add option to add bonus to each dice roll in a set.
//set input to lowercase

//Format !roll 1d20 3d4+2 8d100++1
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
      let thisBonus = 0;

      if (x.split("+")[1] === '' && x.split("+")[2] >= 0) {
        //Build Function for applying bonus to each dice roll
        //Remember blank array item [ '1d4', '', '2' ]
      } else if (isNaN(x.split("+")[1])){
        thisBonus = 0;
      } else {
        rollBonus = Number(rollBonus) + Number(x.split("+")[1]);
        thisBonus = x.split("+")[1];
      }

      //Generate Random Rolls
      times (diceCount) (() => currentRolls.push((Math.floor(Math.random() * diceSize) + 1)));

      diceRolls = diceRolls + x.toString() + " (";

      //String Results Together
      for (var [index, r] of currentRolls.entries()){

        diceResults.push(r);
        localRolls = Number(localRolls) + Number(r);

        if (index === currentRolls.length - 1) {
          localRolls = Number(localRolls) + Number(thisBonus);
            if (thisBonus === 0 && diceCount === '1') {
              diceRolls = diceRolls + "**" + r.toString() + "**";
            } else if (thisBonus === 0) {
              diceRolls = diceRolls + r.toString() + " = " + "**" + localRolls + "**";
            } else {
              diceRolls = diceRolls + r.toString() + " + *" + thisBonus + "*" + " = " + "**" + localRolls + "**";
            }
        } else {
          diceRolls = diceRolls + r.toString() + " + ";
        }
      }
      diceRolls = diceRolls + ")" + "\n"
    }

    //Add Results
    for (var n of diceResults){
      diceTotal = Number(diceTotal) + Number(n);
    }
    diceTotal = Number(diceTotal) + Number(rollBonus);

    //Display Results
    message.delete().catch(O_o=>{});
    return message.channel.send(`${message.author} rolled: **${diceTotal}**.\n${diceRolls}`);
