var express = require('express');
var router = express.Router();
module.exports = router;

//import the users info
var Users = require('./allUsers.js');
var users = Users.users;
var findUser = Users.findUser;

//import the user functions
var User = require('./user.js');
var currentUser = User.user;

//import the account functions
var Account = require('./account.js');
var account = Account.account;
account.populate(currentUser.charge, currentUser.penalty);

//import the content
var Content = require('./content.js');
var content = Content.content;

// pay journey
var payer = {
  name : "Jane Doe",
  email : "mrssmith@gmail.com",
  text : "0757894577878",
  hasEmail : false,
  hasText : false,
  auth : false,
  exemption : "mat",
  //Amount of payment per month
  plan : 344,
  followup : 0,
  remainder: 0,
resetAll : function () {
  this.name = "Jane Doe";
  this.email = "mrssmith@gmail.com";
  this.hasEmail = false;
  this.hasText = false;
  this.auth = false;
  this.exemption = "mat";
  this.plan = 344;
    this.followup = 0;
    this.remainder = 0;
  }
};

var resetAll = function () {
  currentUser.resetUser();
  content.updateContent("D");
  account.resetAccount();
  account.populate(currentUser.charge, currentUser.penalty);
};

function findAndUpdate(user) {
  var newUser = findUser(user);
  currentUser.update(newUser);
  content.updateContent(currentUser.ticked);
  account.populate(currentUser.charge, currentUser.penalty);
};

var pcn = {
  pcnNumber : "314159265",
  resetAll : function () {
    console.log("Resetting...");
    this.originalBalance = 68.00;
    this.payment = 0;
    this.totalPayments = 0;
    this.newBalance = 68.00;
  },
  reduce : function () {
    this.newBalance = (this.newBalance - this.payment);
    this.totalPayments = (this.totalPayments + this.payment);
  }
};

var resetPayer = function() {
  pcn.resetAll();
  payer.resetAll();
};

boolToString = ((b) => {
  return (b ? 'Yes' : 'No');
});

// Route index page
router.get('/', function (req, res) {
  resetPayer();
  resetAll();
  res.render('index');
});

router.get(/index/, function (req, res) {
  resetPayer();
  resetAll();
  res.render('index');
});

router.get(/num-handler/, function (req, res) {
  if (req.query.pcnnumber != "") {
    pcn.pcnNumber = req.query.pcnnumber;
  }
  res.redirect('summary');
});

router.get(/summary/, function (req, res) {
  res.render('pay/summary', {
    pcnnumber : pcn.pcnNumber,
    originalbalance : pcn.originalBalance,
    payment : pcn.payment,
    newbalance : pcn.newBalance
  });
});

//router.get('pay-a-penalty/amount-to-pay', function (req, res) {
//  res.render('/pay-a-penalty/amount-to-pay', {
//    pcnnumber : pcn.pcnNumber,
//    originalbalance : pcn.originalBalance,
//    payment : pcn.payment,
//    newbalance : pcn.newBalance
//  });
//});

router.get(/payment-handler/, function (req, res) {
  pcn.payment = parseInt(req.query.amount);
  pcn.reduce();
  res.render('pay/email');
});

router.get(/mail-handler/, function (req, res) {
  if (req.query.email == "yes") {
    payer.hasEmail = true;
      res.redirect('mail-value');
  } else {
    payer.hasEmail = false;
    res.redirect('check');
  }
});

router.get(/m-handler/, function (req, res) {
  if (req.query.email != "") {
    payer.email = req.query.email;
  }
  res.redirect('check');
});

router.get('/pay/check/', function (req, res) {
  res.render('pay/check', {
    pcnnumber : pcn.pcnNumber,
    amount : pcn.payment,
    email : payer.email,
    hasmail : boolToString(payer.hasEmail)
  });
});

router.get(/payment/, function (req, res) {
  res.render('pay/payment', {
    pcnnumber : pcn.pcnNumber,
    payment : pcn.payment
  });
});

router.get(/confirm/, function (req, res) {
  res.render('pay/confirm', {
    payment : pcn.payment
  });
});

router.get(/done/, function (req, res) {
  res.render('pay/done', {
    pcnnumber : pcn.pcnNumber,
    originalbalance : pcn.originalBalance,
    totalpayments : pcn.totalPayments,
    payment : pcn.payment,
    newbalance : pcn.newBalance,
    hasmail : payer.hasEmail,
    email : payer.email
  });
});

router.get(/final/, function (req, res) {
  res.render('pay/final', {
    originalbalance : pcn.originalBalance,
    payment : pcn.payment,
    totalpayments : pcn.totalPayments,
    newbalance : pcn.newBalance
  });
});

router.get(/reduce-handler/, function (req, res) {
  res.redirect('confirm');
});

router.get(/con-handler/, function (req, res) {
  if (pcn.newBalance != 0) {
      res.redirect('done');
  } else {
      res.redirect('final');
  }
});

//Pay
router.get(/pay-handler/, function (req, res) {
  if (payer.auth == true) {
      res.redirect('summary');
  } else {
      res.redirect('number');
  }
});

/* 
******************
***** PAY V4 *****
******************
*/

//router.get(/followup-handler/, function (req, res) {
//  res.redirect('../pay-penalty/card-details')
//    if (payer.plan == 86) {
//          payer.followup = 1;
//      } else if (payer.plan == 172){
//          payer.followup = 2;
//      }; 
//});

//router.get('/overview/', function (req, res) {
//  res.render('pay-penalty/overview', {
//    plan : payer.plan
//  });
//});

router.get('/pay-penalty/options/', function (req, res) {
  res.render('pay-penalty/options', {
    totaldue : account.currentBalance,
    twopayments : account.instalmentAmount(2),
    fourpayments : account.instalmentAmount(4)
  });
});

router.get('/pay-penalty/account-handler/', function (req, res) {
  account.updateBalance(account.instalmentAmount());
  res.redirect('end');
});

router.get(/instalment-handler/, function (req, res) {
  if (req.query.plan == "2") {
    account.instalments = 2;
    payer.plan = 172;
  } else {
    account.instalments = 4;
    payer.plan = 86;
  }
  res.redirect('yourplan');
});

router.get('/pay-penalty/end/', function (req, res) {
  res.render('pay-penalty/end', {
    pcn : currentUser.pcn,
    instalments : account.instalments,
    paymentamount : account.instalmentAmount(),
    hasmail : payer.hasEmail,
    hastext : boolToString(payer.hasText),
    text : payer.text,
    email : payer.email,
    plan : payer.plan,
    followup : payer.followup,
    remainder : payer.remainder
  })
})

router.get('/pay-penalty/yourplan', function (req, res) {
  res.render('pay-penalty/yourplan', {
    plan : payer.plan,
    instalments : account.instalments,
    amount : account.instalmentAmount(),
  })
})

router.get('/pay-penalty/accept/', function (req, res) {
  res.render('pay-penalty/accept', {
    pcnnumber : currentUser.pcn,
    amount : account.instalmentAmount(),
    hastext : boolToString(payer.hasText),
    text : payer.text,
    hasmail : boolToString(payer.hasEmail),
    email : payer.email
  })
})

router.get('/pay-penalty/card-details/', function (req, res) {
  res.render('pay-penalty/card-details', {
    pcnnumber : currentUser.pcn,
    amount : account.instalmentAmount()
  })
})

router.get('/pay-penalty/contact-handler/', function (req, res) {
  payer.hasText = false;
  payer.hasEmail = false;
  if (req.query.text == 'true') {
    payer.hasText = true;
  }
  if (req.query.email == 'true') {
    payer.hasEmail = true;
  }
  if (payer.hasText) {
    res.redirect('text-value');
  } else if (payer.hasEmail) {
     res.redirect('mail-value');
  } else {
    payer.hasText = false;
    payer.hasEmail = false;
    res.redirect('accept');
  }
});

router.get(/haha-handler/, function (req, res) {
  if (payer.hasEmail) {
    res.redirect('mail-value');
  } else {
     res.redirect('accept');
  }
});

router.get(/nocomms-handler/, function (req, res) {
  payer.hasText = false;
  payer.hasEmail = false;
  res.redirect('accept')
});


router.get('/pay-penalty/recap/', function (req, res) {
 res.render('pay-penalty/recap', {
   pcnnumber : pcn.pcnNumber,
   hastext : boolToString(payer.hasText),
   text : payer.text,
   hasmail : boolToString(payer.hasEmail),
   email : payer.email,
   plan : payer.plan
  });
});

router.get(/payfull-handler/, function (req, res) {
  payer.plan = 344;
  res.redirect('../pay-penalty/card-details')
});

router.get(/remainder-handler/, function (req, res) {
  payer.followup = 1;
  res.redirect('../pay-penalty/card-details')
});

router.get('/pay-penalty/contact-option-full/', function (req, res) {
  res.render('pay-penalty/contact-option-full', {
    instalments : currentUser.instalments,
  })
})


/* 
*********************
***** Challenge *****
*********************
*/

// Ask for ref number
router.get('challenge/enter-pcn-number/', function (req, res) {
  currentUser.resetUser();
  res.render('challenge/enter-pcn-number');
});

// find the user
router.get(/lookup-handler/, function (req, res) {
  var entry = parseInt(req.query.ref);
  findAndUpdate(entry);
  res.redirect('validate-dob');
});

router.get('/challenge/validate-charge/', function (req, res) {
  res.render('challenge/validate-charge', {
    ref : currentUser.pcn
  });
});


// display the users's PCN
router.get('/challenge/penalty-view/', function (req, res) {
  res.render('challenge/penalty-view', {
    ref : currentUser.pcn,
    name : currentUser.firstName + " " + currentUser.lastName,
    address: currentUser.addressLineOne + ", " + currentUser.addressTown + ", " + currentUser.addressPostCode,
    ticked : currentUser.ticked,
    cat : content.description,
    checkdate : content.checkDate,
    challengeDate : content.challengeDate,
    charge : account.charge.toFixed(2),
    penalty : account.penalty.toFixed(2),
    totaldue : account.startingBalance,
    plan : payer.plan,
    followup : payer.followup
  });
});

// Ask if they have the exemption they ticked
router.get(/did-you-have/, function (req, res) {
  res.render('challenge/did-you-have', {
    title : content.title,
    description : content.description,
    cat : currentUser.ticked,
    checkdate : content.checkDate,
      certNo : currentUser.certNo
  });
});

router.get(/did-you-handler/, function (req, res) {
  if (req.query.exemption == 'no') {
    currentUser.removeCat();
    currentUser.showCats();
      currentUser.certNo = 4;
    res.redirect('bsa-exemptions');
  } else {
    if ( currentUser.benefitTest() ) {
      res.redirect('bsa-exemptions');
    } else {
      res.redirect('cert-number');
    }
  }
});

router.get('/medical/', function (req, res) {
  res.render('challenge/medical', {
    certNo : currentUser.certNo,
      ticked : currentUser.ticked,
      gender : currentUser.gender,
      hasBen : currentUser.hasBen
  });
});

// Ask for a cert number
router.get(/cert-number/, function (req, res) {
  res.render('challenge/cert-number', {
    title : content.title,
      certNo : currentUser.certNo,
      ticked : currentUser.ticked

  });
});



     //check cert number
router.get(/cert-handler/, function (req, res) {
 if (req.query.cert === "2") {
    currentUser.certNo = 2;
    res.redirect('update-contact');
  } else if (req.query.cert === "3" && currentUser.ticked === "K") {
    res.redirect('medical');
      currentUser.certNo = 3;
} else if (req.query.cert === "3" && currentUser.ticked === "H") {
    res.redirect('medical');
      currentUser.certNo = 3;
} else if (req.query.cert === "4" && currentUser.ticked === "K") {
    res.redirect('medical');
      currentUser.certNo = 4;
} else if (req.query.cert === "4" && currentUser.ticked === "H") {
    res.redirect('medical');
      currentUser.certNo = 4;
  } else if (req.query.cert === "3") {
    res.redirect('dwp-exemptions');
      currentUser.certNo = 3;
    }else if (req.query.cert === "4") {
    currentUser.certNo = 4;
      res.redirect('dwp-exemptions');
    } else {
    res.redirect('found');
    }
  });

     //check cert number
//router.get(/cert-handler/, function (req, res) {
// if (req.query.cert === "2") {
//    currentUser.certNo = 2;
//    res.redirect('update-contact');
//  } else if (req.query.cert === "3" && currentUser.originalBen === 1) {
//    res.redirect('medical');
//      currentUser.certNo = 3;
//} else if (req.query.cert === "3") {
//    res.redirect('dwp-exemptions');
//      currentUser.certNo = 3;
//  } else if (req.query.cert === "4") {
//    currentUser.certNo = 4;
//      res.redirect('dwp-exemptions');
//    } else {
//    res.redirect('found');
//    }
//  });

// check cert number
//router.get(/cert-handler/, function (req, res) {
// if (req.query.cert === "2") {
//    currentUser.certNo = 2;
//    res.redirect('update-contact');
//  } else if (req.query.cert === "3") {
//    res.redirect('dwp-exemptions');
//      currentUser.certNo = 3;
//  } else if (req.query.cert === "4") {
//    currentUser.certNo = 4;
//    if (currentUser.matD == true) {
//      res.redirect('dwp-exemptions');
//    } else if (currentUser.medE == true) {
//      res.redirect('dwp-exemptions');
//    } else if (currentUser.medE == true) {
//      res.redirect('dwp-exemptions');
//  } else {
//    res.redirect('found');
//  }
//});
    
//    // check cert number
//router.get(/cert-handler/, function (req, res) {
// if (req.query.cert === "2") {
//    currentUser.certNo = 2;
//    res.redirect('update-contact');
//  } else if (req.query.cert === "3") {
//    res.redirect('dwp-exemptions');
//      currentUser.certNo = 3;
//  } else if (req.query.cert === "4") {
//    currentUser.certNo = 4;
//    if (currentUser.matD == true) {
//      res.redirect('dwp-exemptions');
//    } else if (currentUser.medE == true) {
//      res.redirect('dwp-exemptions');
//    } else if (currentUser.medE == true) {
//      res.redirect('dwp-exemptions');
//  } else {
//    res.redirect('found');
//  }
//});


// check cert number
//router.get(/cert-handler/, function (req, res) {
// if (req.query.cert === "2") {
//    currentUser.certNo = 2;
//    res.redirect('update-contact');
//  } else if (req.query.cert === "3") {
//    res.redirect('out-of-date');
//  } else if (req.query.cert === "4") {
//    currentUser.certNo = 4;
//    if (currentUser.matD == true) {
//      res.redirect('pregnant');
//    } else if (currentUser.medE == true) {
//      res.redirect('medical');
//    } else {
//      res.redirect('cant-find-cert');
//    }
//  } else {
//    res.redirect('found');
//  }
//});

// ask if they had a BSA exemption
router.get(/bsa-exemptions/, function (req, res) {
  res.render('challenge/bsa-exemptions', {
    ticked : currentUser.ticked,
    checkdate : content.checkDate,
    gender : currentUser.gender
  });
});

router.get(/bsa-handler/, function (req, res) {
  var next = 'cert-number';
  var topCat;
  var bsa = req.query.bsa;
  if (bsa != "no") {
    if (bsa == 'mat') {
      currentUser.matD = true;
      topCat = "D";
    } else if (bsa == 'med') {
      currentUser.medE = true;
      topCat = "E";
    } else if (bsa == 'ppc') {
      currentUser.ppcF = true;
      topCat = "F";
    } else if (bsa == 'hc2') {
      currentUser.hc2L = true;
      topCat = "L";
    } else if (bsa == 'tc') {
      currentUser.tcM = true;
      topCat = "M";
    }
    content.updateContent(topCat);
  } else {
    if ( currentUser.benefitTest()) {
      next = 'medical';
    }  else {
      next = 'dwp-exemptions';
    }
  }
  res.redirect(next);
});

//router.get('/challenge/dwp-exemptions-handler', function (req, res) {
//  var bens = req.query.benefits;
//  var nextBens = "medical";
//  var topCat;
//  if (bens != "no") {
//    if (bens == "is" || bens == "esa") {
//      currentUser.esaH = true;
//      topCat = "H";
//        currentUser.hasBen = 1;
//    } else if (bens == "jsa") {
//      currentUser.jsaK = true;
//      topCat = "K";
//        currentUser.hasBen = 1;
//    } else if (bens == "pc") {
//      currentUser.pcS = true;
//      topCat = "S";
//        currentUser.hasBen = 1;
//    } else if (bens == "uc") {
//      currentUser.uc = true;
//      topCat = "U";
//        currentUser.hasBen = 1;
//    }
//    content.updateContent(topCat);
//  }
//    currentUser.hasBen = 0;
//  if (currentUser.ticked == "D") {
//    nextBens = 'pregnant';
//  }
//  if (currentUser.uc === true) {
//    nextBens = 'uc-includes';
//  }
//  res.redirect(nextBens);
//});

router.get('/challenge/dwp-exemptions-handler', function (req, res) {
  var bens = req.query.benefits;
  var nextBens = "medical";
  var topCat;
  if (bens != "no") {
    if (bens == "is" || bens == "esa") {
      currentUser.esaH = true;
      topCat = "H";
        currentUser.hasBen = 1;
    } else if (bens == "jsa") {
      currentUser.jsaK = true;
      topCat = "K";
        currentUser.hasBen = 1;
    } else if (bens == "pc") {
      currentUser.pcS = true;
      topCat = "S";
        currentUser.hasBen = 1;
    } else if (bens == "uc") {
      currentUser.uc = true;
      topCat = "U";
        currentUser.hasBen = 1;
    }
    content.updateContent(topCat);
  }
    currentUser.hasBen = 0;
  if (currentUser.uc === true) {
    nextBens = 'uc-includes';
  }
  res.redirect(nextBens);
});


//new
//router.get(/pregnancy-handler/, function (req, res) {
//  if (req.query.pregnant == 'yes') {
//    currentUser.pregnant = true;
//    res.redirect(outcomeRedirect());
//  } else {
//    currentUser.pregnant = false;
//    if (currentUser.illness == null) {
//      res.redirect('medical');
//    } else {
//      res.redirect(outcomeRedirect());
//    }
//  }
//});

router.get(/pregnancy-handler/, function (req, res) {
  if (req.query.pregnant == 'yes') {
    res.redirect('matex');
  } else if (req.query.pregnant == 'no' && currentUser.ticked === "K" && currentUser.certNo != 4){ 
    res.redirect('proof-of-benefit');
    }
   else if (req.query.pregnant == 'no' && currentUser.ticked === "H" && currentUser.certNo != 4){ 
    res.redirect('proof-of-benefit');
      }
               else if (req.query.pregnant == 'no' && currentUser.esaH  === true){ 
    res.redirect('proof-of-benefit');
      }
               else if (req.query.pregnant == 'no' && currentUser.jsaK  === true){ 
    res.redirect('proof-of-benefit');
      }
                   else if (req.query.pregnant == 'no' && currentUser.pcS  === true){ 
    res.redirect('proof-of-benefit');
      } 
                   else if (req.query.pregnant == 'no' && currentUser.uc  === true){ 
    res.redirect('proof-of-benefit');
      } 
   else if (req.query.pregnant == 'no' && currentUser.certNo === 3){ 
    res.redirect('out-of-date');
    }
                else if (req.query.pregnant == 'no' && currentUser.certNo === 4 && currentUser.ticked === "D"){ 
    res.redirect('cant-find-mat');           
   } 
   else if (req.query.pregnant == 'no' && currentUser.certNo === 4){
    res.redirect('cant-find');           
   } else {
       
       res.redirect('cant-find');
   }
});

router.get(/medical-handler/, function (req, res) {
  if (req.query.medical == 'yes') {
    res.redirect('illnesses');
  } else if (req.query.medical == 'no' && currentUser.gender === 'F'){ 
    res.redirect('pregnant');
    }
       else if (req.query.medical == 'no' && currentUser.ticked === "H"){ 
    res.redirect('proof-of-benefit');
      }
           else if (req.query.medical == 'no' && currentUser.esaH  === true){ 
    res.redirect('proof-of-benefit');
      }
               else if (req.query.medical == 'no' && currentUser.jsaK  === true){ 
    res.redirect('proof-of-benefit');
      }
                   else if (req.query.medical == 'no' && currentUser.pcS  === true){ 
    res.redirect('proof-of-benefit');
      } 
                   else if (req.query.medical == 'no' && currentUser.uc  === true){ 
    res.redirect('proof-of-benefit');
      } 
   else if (req.query.medical == 'no' && currentUser.certNo === 3){ 
    res.redirect('out-of-date');
    }

        else if (req.query.medical == 'no' && currentUser.certNo === 4 && currentUser.ticked === "E"){ 
    res.redirect('/challenge/end-pages/cannot-find/cant-find-cert');           
   } 
   else if (req.query.medical == 'no' && currentUser.certNo === 4){ 
    res.redirect('cant-find');           
   }    

    
    else {
       res.redirect('cant-find');
   }
});

//router.get(/medical-handler/, function (req, res) {
//  if (req.query.medical == 'yes') {
//    res.redirect('illnesses');
//  } else if (req.query.medical == 'no' && currentUser.ticked === "K"){ 
//    res.redirect('proof-of-benefit');
//    }
//   else if (req.query.medical == 'no' && currentUser.ticked === "H"){ 
//    res.redirect('proof-of-benefit');
//      }  
//   else if (req.query.medical == 'no' && currentUser.certNo === 3){ 
//    res.redirect('out-of-date');
//    }
//   else if (req.query.medical == 'no' && currentUser.certNo === 4){ 
//    res.redirect('cant-find');           
//   } else {
//       res.redirect('cant-find');
//   }
//});

//router.get(/medical-handler/, function (req, res) {
//  if (req.query.medical == 'yes') {
//    res.redirect('illnesses');
//  } if (req.query.medical == 'no' && currentUser.ticked === "K"){ 
//    res.redirect('proof-of-benefit');
//  } if (req.query.medical == 'no' && currentUser.ticked === "H"){ 
//    res.redirect('proof-of-benefit');
//  } if (req.query.medical == 'no' && currentUser.certNo === 3){ 
//    res.redirect('out-of-date');
//  } if (req.query.medical == 'no' && currentUser.certNo === 4){ 
//    res.redirect('cant-find');
//  }
//});


//new
router.get(/illnesses-handler/, function (req, res) {
  if (req.query.medical == 'yes') {
    currentUser.illness = true;
  } else {
    currentUser.illness = false;
  }
  if (req.query.medical == 'no' && currentUser.gender === 'F') {
    res.redirect('pregnant');
  } else {
    res.redirect(outcomeRedirect());
  }
});

//router.get(/illnesses-handler/, function (req, res) {
//  if (req.query.medical == 'yes') {
//    currentUser.illness = true;
//  } else {
//    currentUser.illness = false;
//  }
//  if (currentUser.pregnant == null && currentUser.gender === 'F') {
//    res.redirect('pregnant');
//  } else {
//    res.redirect(outcomeRedirect());
//  }
//});


//router.get(/medical-handler/, function (req, res) {
//  if (req.query.medical == 'yes') {
//    res.redirect('illnesses');
//  } else {
//    res.redirect(outcomeRedirect() );
//  }
//});

//new
outcomeRedirect = function() {
  var page = 'cant-find';
  //pregnant
  if (currentUser.pregnant) {
    if (currentUser.benefitTest()) {
      if (currentUser.underUCThreshold == false) {
        //over UC threashold but pregnant - need page - should go to /matex for now
        console.log('hit-1');
        return 'matex';
      }
      console.log('hit-2');
      return 'mat-ben';
    }
    //is pregant only - /matex
    console.log('hit-3');
    return 'matex';
  }
  //illness
  if (currentUser.illness) {
    if (currentUser.benefitTest()) {
      if (currentUser.underUCThreshold == false) {
        //over UC threashold but illness - need page - should go to /medex for now
        console.log('hit-4');
        return 'medex';
      }
      console.log('hit-5');
      return 'med-ben';
    }
    //is illness only - /medex
    console.log('hit-6');
    return 'medex';
  }
  //benefit including universal credit
  if (currentUser.benefitTest()) {
    if (currentUser.underUCThreshold == false) {
      //over UC threashold - /over-uc
      console.log('hit-7');
      return 'over-uc';
    } else {
      //has a benefit only - /proof-of-benefit
      console.log('hit-8');
      return 'proof-of-benefit';
    }
  }
  //nothing - 'cant-find'
  console.log('hit-9');
  return page;
};

router.get(/details-handler/, function (req, res) {
  if (req.query.details == 'no') {
    res.redirect('mistake');
  } else {
    if (currentUser.matD === true) {
      res.redirect('pregnant');
    } else if (currentUser.medE === true) {
      res.redirect('medical');
    } else if ( currentUser.benefitTest() ) {
      res.redirect('proof-of-benefit');
    } else {
      res.redirect('cant-find');
    }
  }
});

router.get(/benefits-handler/, function (req, res) {
  if (req.query.details == 'yes') {
    res.redirect('proof-of-benefit');
  } else {
    res.redirect('mistake');
  }
});

// display the users's personal details
router.get(/personal-details/, function (req, res) {
  res.render('challenge/personal-details', {
    name : currentUser.firstName + " " + currentUser.lastName,
    ref : currentUser.pcn,
    title : content.title,
    address : currentUser.fullAddress,
    checkdate : content.checkDate
  });
});

// Where we find their details
router.get(/found/, function (req, res) {
  res.render('challenge/found', {
    ref : currentUser.pcn,
    title : content.title
  });
});

// we cant find your certificate
router.get(/out-of-date/, function (req, res) {
  res.render('challenge/out-of-date', {
    title : content.title,
    checkdate : content.checkDate,
      ticked : currentUser.ticked
  });
});

router.get('/challenge/contact/', function (req, res) {
  res.render('challenge/contact', {
    ref : currentUser.pcn,
    name : currentUser.firstName + " " + currentUser.lastName,
          hasemail : currentUser.hasEmail,
    hastext : currentUser.hasText
  });
});

// was this your address?
router.get('/challenge/check-address/', function (req, res) {
  res.render('challenge/check-address', {
    checkdate : content.checkDate,
    title : content.title,
    address : currentUser.fullAddress
  });
});


router.get('/challenge/check-address-handler/', function (req, res) {
  if (req.query.details == 'no') {
    res.redirect('/challenge/update-address');
  } else {
    if (currentUser.updated > 1) {
      res.redirect('update-contact');
    } else if (currentUser.updated > 0) {
      res.redirect('check-your-answers');
        currentUser.certNo = 6;
    } else {
      res.redirect('check-your-answers');
        currentUser.certNo = 6;
    }
  }
});

//router.get('/challenge/check-address-handler/', function (req, res) {
//  if (req.query.details == 'no') {
//    res.redirect('/challenge/update-address');
//  } else {
//    if (currentUser.updated > 1) {
//      res.redirect('update-contact');
//    } else if (currentUser.updated > 0) {
//      res.redirect('check-your-answers');
//    } else if (currentUser.matD === true) {
//      res.redirect('pregnant');
//    } else if (currentUser.medE === true) {
//      res.redirect('medical');
//    } else if ( currentUser.benefitTest() ) {
//      res.redirect('proof-of-benefit');
//    } else {
//      res.redirect('check-your-answers');
//    }
//  }
//});

// update address
router.get('/challenge/update-address/', function (req, res) {
  res.render('challenge/update-address', {
    title : content.title
  });
});

// update contact
router.get('/challenge/update-contact/', function (req, res) {
  res.render('challenge/update-contact', {
    title : content.title
  });
});

// update address
router.get('/challenge/update-address-handler/', function (req, res) {
  currentUser.addressLineOne = req.query.lineone;
  currentUser.addressLineTwo = req.query.linetwo;
  currentUser.addressTown = req.query.town;
  currentUser.addressPostCode = req.query.postcode;
  currentUser.updateAddress();
  currentUser.updated++;
    currentUser.certNo = 6;
//  if (currentUser.updated > 1) {
//    res.redirect('update-contact');
//  } else {
    res.redirect('check-your-answers');
//  }
});

router.get('/challenge/check-name/', function (req, res) {
  res.render('challenge/check-name', {
    checkdate : content.checkDate,
    title : content.title,
    name : currentUser.firstName + " " + currentUser.lastName
  });
});

router.get('/challenge/name-handler/', function (req, res) {
  if (req.query.details === "yes") {
    res.redirect('/challenge/check-dob');
  } else {
    res.redirect('/challenge/update-name');
  } 
});

router.get('/challenge/update-name/', function (req, res) {
  res.render('challenge/update-name', {
    ref : currentUser.pcn,
    title : content.title,
      certNo : currentUser.certNo
  });
});

router.get('/challenge/update-name-handler/', function (req, res) {
  currentUser.firstName = req.query.firstname;
  currentUser.lastName = req.query.lastname;
  currentUser.updated++;
    if (currentUser.certNo == 6){
        res.redirect('/challenge/check-your-answers');
    } else {
        res.redirect('/challenge/check-dob');
    }
  
});

router.get('/challenge/check-dob', function (req, res) {
  res.render('challenge/check-dob', {
    checkdate : content.checkDate,
    title : content.title,
    dob : content.createAdate(currentUser.dobDay, currentUser.dobMonth, currentUser.dobYear)
  });
});

router.get('/challenge/dob-handler', function (req, res) {
  if (req.query.details == "yes") {
    res.redirect('/challenge/check-address');
  } else {
    res.redirect('/challenge/update-dob');
  }
});

router.get('/challenge/update-dob-handler', function (req, res) {
  currentUser.dobDay = req.query.day;
  currentUser.dobMonth = req.query.month;
  currentUser.dobYear = req.query.year;
  currentUser.updated++;
      if (currentUser.certNo == 6){
        res.redirect('/challenge/check-your-answers');
    } else {
        res.redirect('/challenge/check-address');
    }
});

router.get('/challenge/update-telephone-handler/', function (req, res) {
  currentUser.telephone = req.query.telephone;
  res.redirect('/challenge/check-your-answers');
});

router.get('/challenge/update-e-handler/', function (req, res) {
  console.log("here");
  currentUser.email = req.query.email;
  if (currentUser.hasText) {
    res.redirect('/challenge/update-telephone');
  } else {
    res.redirect('/challenge/check-your-answers');
  }
});

router.get('/challenge/check-your-answers/', function (req, res) {
  res.render('challenge/check-your-answers', {
    cert : currentUser.certNo,
    address : currentUser.fullAddress,
    dob : content.createAdate(currentUser.dobDay, currentUser.dobMonth, currentUser.dobYear),
    name : currentUser.firstName + " " + currentUser.lastName,
    hasemail : currentUser.hasEmail,
    hastext : currentUser.hasText,
    telephone : currentUser.telephone,
    email : currentUser.email,
    title : content.title,
    updated : currentUser.updated, 
    proofrequired : currentUser.benefitTest()
  });
});

// Where the user can prove benefit entitlement or get a medical certificate
router.get('/challenge/med-ben/', function (req, res) {
  res.render('challenge/med-ben', {
    benefit : content.title,
    checkdate : content.checkDate,
    pcn : currentUser.pcn
  });
});

// Where the user can prove benefit entitlement or get a mat certificate
router.get('/challenge/mat-ben/', function (req, res) {
  res.render('challenge/mat-ben', {
    benefit : content.title,
    checkdate : content.checkDate,
    pcn : currentUser.pcn
  });
});

// Where need proof of a benefit
router.get(/proof-of-benefit/, function (req, res) {
  res.render('challenge/proof-of-benefit', {
    ref : currentUser.pcn,
      benefit : content.title,
    certificate : content.title,
    pcn : currentUser.pcn,
    checkdate : content.checkDate,
      exemption : content.exemption,
      title : content.title,
      chosenBen : content.chosenBen
  });
});

// show the DWP categories
router.get('/challenge/dwp-exemptions/', function (req, res) {
  res.render('challenge/dwp-exemptions', {
    ticked : currentUser.ticked,
    checkdate : content.checkDate,
      hasBen : currentUser.hasBen
  });
});

// Ask if the user was pregnant or gave birth
router.get(/pregnant/, function (req, res) {
  res.render('challenge/pregnant', {
    checkdate : content.checkDate,
      gender : currentUser.gender
  });
});

router.get(/matex/, function (req, res) {
  res.render('challenge/matex', {
    checkdate : content.checkDate,
    certificate : currentUser.matD,
    pcn : currentUser.pcn
  });
});

router.get('/challenge/cant-find/', function (req, res) {
  res.render('challenge/cant-find', {
    checkdate : content.checkDate,
    certificate : currentUser.matD,
    pcn : currentUser.pcn
  });
});

router.get('/challenge/cant-find-med/', function (req, res) {
  res.render('challenge/cant-find-med', {
    checkdate : content.checkDate,
    certificate : currentUser.matD,
    pcn : currentUser.pcn
  });
});

router.get('/challenge/cant-find-mat/', function (req, res) {
  res.render('challenge/cant-find-mat', {
    checkdate : content.checkDate,
    certificate : currentUser.matD,
    pcn : currentUser.pcn
  });
});

router.get(/medex/, function (req, res) {
  res.render('challenge/medex', {
    checkdate : content.checkDate,
    certificate : currentUser.medE,
    pcn : currentUser.pcn
  });
});

router.get('/challenge/cant-find-cert/', function (req, res) {
  res.render('challenge/cant-find-cert', {
    title : content.title,
      checkdate : content.checkDate
  });
});

router.get('/challenge/answers-handler/', function (req, res) {
if (currentUser.updated === 1) {
    res.redirect('/challenge/found');
  } else if (currentUser.certNo == 2){
      res.redirect('contact');
  } else {
    res.redirect('dwp-exemptions');
      currentUser.certNo = 4;
    }
});


//router.get('/challenge/answers-handler/', function (req, res) {
//  if (currentUser.benefitTest()) {
//    res.redirect('/challenge/contact');
//  } else if (currentUser.updated === 1) {
//    res.redirect('/challenge/found');
//  } else {
//    res.redirect('/challenge/contact');
//  }
//});

//router.get('/challenge/answers-handler/', function (req, res) {
//  if (currentUser.benefitTest()) {
//    res.redirect('/challenge/proof-of-benefit');
//  } else if (currentUser.updated === 1) {
//    res.redirect('/challenge/found');
//  } else {
//    res.redirect('/challenge/contact');
//  }
//});

router.get('/challenge/contact-handler/', function (req, res) {
  currentUser.hasText = false;
  currentUser.hasEmail = false;
  if (req.query.text == 'true') {
    currentUser.hasText = true;
  }
  if (req.query.email == 'true') {
    currentUser.hasEmail = true;
  }
  if (currentUser.hasEmail) {
    res.redirect('update-email');
  } else if (currentUser.hasText) {
     res.redirect('update-telephone');
  } else {
    currentUser.hasText = false;
    currentUser.hasEmail = false;
    res.redirect('check-your-answers');
  }
});

router.get('/challenge/uc-includes/', function (req, res) {
  res.render('challenge/uc-includes', {
    checkdate : content.checkDate
  });
});

router.get('/challenge/uc-includes-handler/', function (req, res) {
  if(req.query.details == 'yes') {
    content.ucAmount = 935;
  } else {
    content.ucAmount = 435;
  }
  res.redirect('uc-take-home');
});

router.get('/challenge/uc-take-home/', function (req, res) {
  res.render('challenge/uc-take-home', {
    amount : content.ucAmount,
    checkdate : content.checkDate
  });
});

router.get('/challenge/take-home-handler/', function (req, res) {
  if (req.query.data == 'yes') {
    currentUser.underUCThreshold = true;
  } else {
    currentUser.underUCThreshold = false;
  }
  console.log(currentUser.underUCThreshold);
  if (currentUser.ticked == "D") {
    res.redirect('pregnant');
  } else {
    res.redirect('medical');
  }
});

router.get('/challenge/over-uc/', function (req, res) {
  res.render('challenge/over-uc', {
    amount : content.ucAmount,
    checkdate : content.checkDate
  });
});

router.get('/challenge/exep-circs/', function (req, res) {
  res.render('challenge/exep-circs', {
    title : content.title,
    ticked : currentUser.ticked,
      hasBen : currentUser.hasBen
  });
});

router.get('/challenge/challenge-options/', function (req, res) {
  res.render('challenge/challenge-options', {
    ticked : currentUser.ticked
  });
});

router.get('/challenge/how-review/', function (req, res) {
  res.render('challenge/how-review', {
    ticked : currentUser.ticked,
      ref : currentUser.pcn
  });
});