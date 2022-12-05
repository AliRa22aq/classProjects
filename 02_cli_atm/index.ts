#! /usr/bin/env node

import inquirer from "inquirer";


// Enter the ATM;
let isLoggedIn = false;
let quit = false;
const account = {
    balance: 1_000_000,
    transactionCount: 0,
    userName: "",
    password: "",
}

const welcomeMsg = (loggedIn: boolean = false) => {
    console.clear();
    console.log("*********************************");
    if(loggedIn){
        console.log(`Welcome ${account.userName} to the PIAIC ATM Machine.`);
        console.log(`Balance ${account.balance}. Transaction Count: ${account.transactionCount}`);
    }
    else{
        console.log("Welcome to the PIAIC ATM Machine.");
    }
    console.log("*********************************");
}


const setUsernamePassword = async () => {

    
    const details = await inquirer.prompt([
        {
            name: "userName",
            type: "input",
            message: "Set a username"
        },
        {
            name: "password",
            type: "password",
            mask: true,
            message: "Set a password"
        },
    ])

    account.userName = details.userName;
    account.password = details.password;

}

const login = async () => {

    const tx = await inquirer.prompt([
        {
            name: "userName",
            type: "input",
            message: "Enter User name"
        },
        {
            name: "password",
            type: "input",
            message: "Enter Password"
        }
    ]);



    if (tx.userName === account.userName && tx.password === account.password) {
        isLoggedIn = true;
        console.log("Logged in Successfully");

    }
    else {
        console.log("Incorrect username or password");
    }
}

const accounts = {
    "ABL": ["Zia", "Zeeshan"],
    "HBL": ["Ali", "Umar", "Zeeshan"],
    "IPL": ["Ali", "Zia", "Zeeshan"],
}

const options = async () => {

    const tx = await inquirer.prompt([
        {
            name: "transaction",
            type: "list",
            choices: ["Transfer", "quit"],
            message: "Choose a transaction type"
        }
    ]);

    switch(tx.transaction){
        case "Transfer":
            const bank = await inquirer.prompt([
                {
                    name: "bank",
                    type: "list",
                    choices: ["ABL", "HBL", "IPL"],
                    message: "Choose a bank to transfer",
                },
            ]);
            const transfer = await inquirer.prompt([
                {
                    name: "transfer",
                    type: "list",
                    choices: accounts[bank.bank as "ABL"|"HBL"|"IPL"],
                    message: "Choose an account"
                    },
            ]);
            // console.log("transfer: ", tx2.transfer)
            console.log("Your Balance: ", account.balance + " Rs");
            const amount = await inquirer.prompt([
                {
                    name: "amount",
                    type: "input",
                    message: "Enter an amount",
                    validate: (input) => {
                        if (isNaN(input) || input === "") {
                            return "Please enter a number"
                        }
                        if (Number(input) > account.balance) {
                            return "Insiffucient Balance";
                        }
                        return true;
                    }
                },
            ]);

            console.log("amount: ", amount.amount);
            account.balance -= Number(amount.amount);
            account.transactionCount++;

            console.log("Transaction completed");
        break;

        case "quit":
            quit = true;
            break;
    }


}


const process = async () => {

    welcomeMsg();
    await setUsernamePassword();
    welcomeMsg();
    
    do {
        await login();
    } while (!isLoggedIn)

    do {
        welcomeMsg(true);
        console.log("\n\n");
        await options();
    } while (!quit)

}

process();


