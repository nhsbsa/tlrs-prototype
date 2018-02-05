//users.js
var users = [

      {
    firstName : "Bill",
    lastName : "Smith",
    pcn : 123456789,
    ticked: "E",
    gender : 'M',
    medE : true,
    charge : 8.60,
    penalty : 43.00,
    addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD",
          hasBen : 0
  },
  {
    firstName : "Michelle",
    lastName : "Doe",
    pcn : 234567891,
    ticked: "D",
    gender : 'F',
    matD : true,
    charge : 8.60,
    penalty : 43.00,
          addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD",
      hasBen : 0
  },
  {
    firstName : "Imran",
    lastName : "Eid",
    pcn : 345678910,
    ticked: "F",
    gender : 'M',
    ppcF : true,
    charge : 8.60,
    penalty : 43.00,
          addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD",
      hasBen : 0
  },
      {
    firstName : "Max",
    lastName : "Payne",
    pcn : 825478319,
    ticked: "M",
    gender : 'M',
    ppcF : true,
    charge : 8.60,
    penalty : 43.00,
          addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD"
  },
  {
    firstName : "Karren",
    lastName : "Jones",
    pcn : 567891011,
    ticked: "K",
    gender : 'F',
    jsaK : true,
    charge : 244,
    penalty : 100,
          addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD",
      chosenBen: "income-based Jobseekers Allowance",
      hasBen : 1
  },
  {
    firstName : "Larry",
    lastName : "Hat",
    pcn : 901011121,
    ticked: "H",
    gender : 'M',
    esaH : true,
    charge : 8.60,
    penalty : 43.00,
          addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD",
      chosenBen: "Income Support or income-related Employment and Support Allowance",
      hasBen : 1
  },
  {
    firstName : "Mary",
    lastName : "Smith",
    pcn : 101112131,
    ticked: "K",
    gender : 'F',
    esaH : true,
    charge : 16.60,
    penalty : 43.00,
          addressLineOne : "12 Old Oak Road",
      addressLineTwo : null,
      addressTown : "Throckley",
      addressPostCode : "NE67 9AD"
  }

];



function findUser(user) {
  return getUser( parseInt(user) );
};

function getUser(noKey) {
  var found, user;
  for (var i=0; i < users.length; i++) {
    if (users[i].pcn === noKey) {
      found = true;
      user = users[i];
    }
  }
  if (found === true) {
    return user;
  } else {
    return users[1];  
  }
}

module.exports.users = users;
module.exports.findUser = findUser;