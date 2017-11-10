"use strict";

const Client = require("coinbase").Client;
const async = require("async");
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;

// Globals
const OKTA_ISSUER_URI = process.env.OKTA_ISSUER_URI;
const OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID;
const OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || "3000";
const SECRET = process.env.SECRET;
const client = new Client({
  apiKey: process.env.COINBASE_APIKEY_ID,
  apiSecret: process.env.COINBASE_APIKEY_SECRET
});

let account;
let transactions;

let app = express();

// App settings
app.set("view engine", "pug");

// App middleware
app.use("/static", express.static("static"));

app.use(session({
  cookie: { httpOnly: true },
  secret: SECRET
}));

// Authentication
let oidc = new ExpressOIDC({
  issuer: OKTA_ISSUER_URI,
  client_id: OKTA_CLIENT_ID,
  client_secret: OKTA_CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  routes: { callback: { defaultRedirect: "/dashboard" } },
  scope: "openid profile"
});

app.use(oidc.router);

// App routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", oidc.ensureAuthenticated(), (req, res) => {
  res.render("dashboard", { transactions: transactions });
});

app.post("/dashboard", bodyParser.urlencoded(), (req, res) => {
  account.requestMoney({
    to: req.body.email,
    amount: req.body.amount,
    currency: "USD",
    description: req.body.description
  }, (err, txn) => {
    if (err) {
      console.error(err);
      return res.render("dashboard", { error: err });
    }

    updateTransactions((err, transactions) => {
      if (err) {
        console.error(err);
        return res.render("dashboard", { error: err.message });
      }

      return res.render("dashboard", { transactions: transactions })
    });
  });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Helpers
function updateTransactions(cb) {
  transactions = [];
  let pagination = null;

  async.doWhilst(
    function(callback) {
      account.getTransactions(pagination, (err, txns, page) => {
        if (err) {
          return callback(err);
        }

        pagination = page.next_uri ? page : false;

        txns.forEach(txn => {
          if (txn.type === "request") {
            transactions.push(txn);
          }
        });

        callback();
      });
    },
    function() {
      return pagination ? true: false;
    },
    function(err) {
      if (err) {
        return cb(err);
      }

      cb(null, transactions);
    }
  );
}

// Startup jobs
client.getAccounts({}, (err, accounts) => {
  if (err) {
    console.error(err);
  }

  accounts.forEach(acct => {
    if (acct.primary) {
      account = acct;
      console.log("Found primary account: " + account.name + ". Current balance: " + account.balance.amount + " " + account.currency + ".");

      console.log("Downloading initial list of transactions.");
      updateTransactions(err => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
});

// Cron jobs
setInterval(() => {
  updateTransactions(err => {
    if (err) {
      console.error(err);
    }
  })
}, 1000 * 60 * 60);

// Server management
oidc.on("ready", () => {
  app.listen(PORT);
});

oidc.on("error", err => {
  console.error(err);
});
