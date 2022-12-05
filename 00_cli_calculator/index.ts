#! /usr/bin/env node

import inquirer from 'inquirer';

// Weclome users
// take inputs and operation
// validate user input
// compute results and show them
// try again?

let again = false;

function welcomeMsg(msg: string): void {
    console.log(msg + "\n");
}

type Answer = {
    firstNumber: string;
    operation: "+" | "-" | "x" | "/" | "^" | "%";
    secondNumber: string;
}


async function getInputFromUser(): Promise<void> {
    const answers: Answer = await inquirer.prompt([
        {
            name: "firstNumber",
            message: "Enter first number",
            type: "input",
            validate: function (input) {
                if (isNaN(input) || input === "") {
                    return "Not a valid input"
                }
                else {
                    return true;
                }
            }
        },
        {
            name: "operation",
            message: "Choose an operation",
            type: "list",
            choices: ["+", "-", "x", "/", "^", "%"]
        },
        {
            name: "secondNumber",
            message: "Enter second number",
            type: "input",
            validate: function (input) {
                if (isNaN(input) || input === "") {
                    return "Not a valid input"
                }
                else {
                    return true;
                }
            }
        }

    ])

    const firstNumber = Number(answers.firstNumber);
    const secondNumber = Number(answers.secondNumber);

    switch (answers.operation) {
        case "+":
            console.log(`Result: ${firstNumber + secondNumber}`);
            break;
        case "-":
            console.log(`Result: ${firstNumber - secondNumber}`);
            break;
        case "x":
            console.log(`Result: ${firstNumber * secondNumber}`);
            break;
        case "/":
            console.log(`Result: ${firstNumber / secondNumber}`);
            break;
        case "%":
            console.log(`Result: ${firstNumber % secondNumber}`);
            break;
        case "^":
            console.log(`Result: ${firstNumber ** secondNumber}`);
            break;
        default:
            break;
    }


    const { confirm } = await inquirer.prompt([
        {
            name: "confirm",
            message: "Do you want to do another calculation?",
            type: "confirm",
        }
    ])

    again = confirm;
    console.log("\n\n")

}



welcomeMsg("Welcome to the class2 Calculator");

do{
    getInputFromUser();
} while(again)