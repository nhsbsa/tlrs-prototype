var defaults = {
  charge : 0,
  penalty : 0,
  instalments : 1,
  paymentsMade : 0,
  startingBalance : 0,
  currentBalance : 0
};

var account = {
  resetAccount : function () {
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        account[key] = defaults[key];
      }
    }
  },
  populate : function (charge, penalty) {
    this.charge = charge;
    this.penalty = penalty;
    this.startingBalance = (charge + penalty).toFixed(2);
    this.currentBalance = this.startingBalance;
  },
  instalmentAmount : function (instalments) {
    if (instalments === undefined) {
      instalments = this.instalments;
    }
    return (this.startingBalance / instalments).toFixed(2);
  },
  updateBalance : function (amount) {
    console.log( typeof(amount) )
    this.currentBalance = (this.currentBalance - amount);
    console.log("Account Balance = " + this.currentBalance);
  }
};

account.resetAccount();
module.exports.account = account;