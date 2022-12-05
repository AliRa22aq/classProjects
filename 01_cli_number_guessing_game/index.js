#! /usr/bin/env node
import inquirer from "inquirer";
const generateARandomNumber = (min = 1, max = 10) => {
    return Number(Math.floor(Math.random() * (max - min + 1)) + min);
};
const TOTAL_ROUNDS = 5;
let rounds = TOTAL_ROUNDS;
let secretNumber = generateARandomNumber();
let wantToContinue = true;
let record = { total: 0, won: 0, lost: 0 };
const askIfWantsToPlayAgain = async (win) => {
    if (win) {
        console.log("You won.");
    }
    else {
        console.log(`You loose. Secret number was ${secretNumber}`);
    }
    console.log("");
    const again = await inquirer.prompt([{
            name: "again",
            type: "confirm",
            message: "Want to play again? ",
        }]);
    if (again.again) {
        rounds = TOTAL_ROUNDS;
        secretNumber = generateARandomNumber();
    }
    else {
        wantToContinue = false;
        console.log("Die in hell");
    }
};
const welcomeMessage = () => {
    console.clear();
    console.log("************** Record **************");
    console.log(`Total Played: ${record.total}, Won: ${record.won}, Lost: ${record.lost}`);
    console.log("************************************");
    console.log("\nWelcome to the secret number guessing game.");
    console.log(`You will have ${TOTAL_ROUNDS} rounds to guess the number \n`);
};
const playARound = async () => {
    const answer = await inquirer.prompt([{
            name: "guess",
            type: "input",
            message: "Your guess: ",
            askAnswered: true,
            validate: (input) => {
                if (isNaN(input)) {
                    return "Pleaee enter a number";
                }
                if (Number(input) > 10) {
                    return "Pleaee enter a number less than 10";
                }
                return true;
            }
        }]);
    rounds--;
    if (Number(answer.guess) === secretNumber) {
        record.total++;
        record.won++;
        await askIfWantsToPlayAgain(true);
    }
    else if (rounds >= 1) {
        console.log(`Wrong guess. You have ${rounds} left. Try Again`);
    }
    else {
        record.total++;
        record.lost++;
        await askIfWantsToPlayAgain(false);
    }
};
do {
    if (rounds === TOTAL_ROUNDS) {
        welcomeMessage();
    }
    await playARound();
} while (rounds > 0 || wantToContinue);
