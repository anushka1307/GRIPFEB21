/**
 * @jest-environment jsdom
 */

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

let bal;
let bal2;
let amountInput=0;
let numberToInput;
let numberFromInput;
let numberToInput1;
let numberFromInput1;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bankDB", {useNewUrlParser: true, useUnifiedTopology: true})

const accountsSchema = {
  name: {
    type: String,
    required: [true, "No name specified"]
  },
  accNumber: {
    type: Number,
    required:[true, "No account number specified"]
  },
  balance: {
    type: Number,
    required: [true, " Please add balance"]
  }
};

const Account = mongoose.model("Account", accountsSchema);


const account1 = new Account({
  name: "Maria Anders",
  accNumber: 6022764829,
  balance: 2000
});

const account2 = new Account({
  name: "Christina Berglund",
  accNumber: 6022764828,
  balance: 2000
});

const account3 = new Account({
  name: "Francisco Chang",
  accNumber: 6022764827,
  balance: 2000
});

const account4 = new Account({
  name: "Roland Mendel",
  accNumber: 6022764826,
  balance: 2000
});

const account5 = new Account({
  name: "Helen Bennett",
  accNumber: 6022764825,
  balance: 2000
});

const account6 = new Account({
  name: "Philip Cramer",
  accNumber: 6022764824,
  balance: 2000
});

const account7 = new Account({
  name: "Yoshi Tannamuri",
  accNumber: 6022764823,
  balance: 2000
});

const account8 = new Account({
  name: "Giovanni Rovelli",
  accNumber: 6022764822,
  balance: 2000
});

const account9 = new Account({
  name: "Simon Crowther",
  accNumber: 6022764821,
  balance: 2000
});

const account10 = new Account({
  name: "Marie Bertrand",
  accNumber: 6022764820,
  balance: 2000
});
const account11 = new Account({
  name: "Anushka Gangal",
  accNumber: 6022764819,
  balance: 10000
});

const defaultAccounts = [account1, account2, account3, account4, account5, account6, account7, account8, account9, account10, account11];

const transactionsSchema = {
  statement: Number,
  state: String
};

const Transaction = mongoose.model("Transaction", transactionsSchema);




app.get("/", function(req, res) {
  Account.find(function(err, foundAccounts) {
    if(foundAccounts.length===0) {
      Account.insertMany(defaultAccounts, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("home", {accounts: foundAccounts});
    }
  });
});
app.get("/transferMoney", function(req, res) {
  Account.find(function(err, foundAccounts) {
    if(foundAccounts.length===0) {
      Account.insertMany(defaultAccounts, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/transferMoney");
    }
    else {
      res.render("transfer", {accounts: foundAccounts});
    }
  });
});
app.get("/transactionHistory", function(req, res) {
  const statement1 = new Transaction({
    statement: amountInput,
    state: "debited from"
  });
  const statement2 = new Transaction({
    statement: amountInput,
    state: "credited to"
  });
  Account.find(function(err, foundAccounts) {
    Transaction.find(function(err, statements) {


      if(numberFromInput1===foundAccounts[10].accNumber) {
        Transaction.insertMany(statement1, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Successfully logged");
          }
        });
        res.redirect("/transactionHistory");
      }
      else if(numberToInput1===foundAccounts[10].accNumber) {
        Transaction.insertMany(statement2, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Successfully logged");
          }
        });
        res.redirect("/transactionHistory");
      }
      if(foundAccounts.length===0) {
        Account.insertMany(defaultAccounts, function(err) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("Successfully inserted");
          }
        });
        res.redirect("/transactionHistory");
      }
      else {
        res.render("history", {accounts: foundAccounts, transaction: statements});
        numberFromInput1=0;
        numberToInput1=0;
      }
    });
  });
});
app.get("/accounts", function(req, res) {
  Account.find(function(err, foundAccounts) {
    if(foundAccounts.length===0) {
      Account.insertMany(defaultAccounts, function(err) {
        if(err) {
          console.log(err);
        }
        else {
          console.log("Successfully inserted");
        }
      });
      res.redirect("/accounts");
    }
    else {
      res.render("accounts", {accounts: foundAccounts});
    }
      for(let i=0; i<foundAccounts.length; i++) {
        if(foundAccounts[i].accNumber === numberToInput) {
          bal2 = foundAccounts[i].balance + amountInput;
          Account.updateOne({accNumber:numberToInput}, {balance: bal2}, function(err) {
            if(err) {
              console.log(err);
              res.redirect("/accounts");
            }
            else {
              console.log("success");
            }
          });
        }
      }
      numberToInput=0;
  });
});

app.post("/transferMoney", function(req, res) {
  amountInput = parseInt(req.body.amount);
  numberFromInput = parseInt(req.body.fromAccountNumber);
  numberToInput = parseInt(req.body.toAccountNumber);
  numberFromInput1 = parseInt(req.body.fromAccountNumber);
  numberToInput1 = parseInt(req.body.toAccountNumber);
  Account.find(function(err, foundAccounts) {
    for (let i = 0; i < foundAccounts.length; i++) {
      if(foundAccounts[i].accNumber===numberFromInput) {
        bal = foundAccounts[i].balance-amountInput;
        Account.updateOne({accNumber: numberFromInput}, {balance: bal}, function(err) {
          if(err) {
            console.log(err);
            res.redirect("/transferMoney");
          }
          else {
            console.log("success");
          }
        });
      }
    }
    numberFromInput=0;
  });
  res.redirect("/");
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
