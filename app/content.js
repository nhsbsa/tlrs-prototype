var content = {
  description : 'Box "D" (has a valid maternity exemption certificate)',
  title : 'NHS maternity exemption certificate',
  checkDate : "1 November and 30 November 2017",
  challengeDate : "9 February 2018",
  ucAmount : 435,
  // paymentTwo : "18 November 2017,
  // paymentThree : "19 December 2017,
  // paymentFour : "19 January 2017,
  updateContent : function (cat) {
    switch(cat) {
      case "D":
        this.title = 'NHS maternity exemption certificate';
        this.description = 'Has a valid maternity exemption certificate (Box "D")';
        break;
      case "E":
        this.title = 'NHS medical exemption certificate';
        this.description = 'has a valid medical exemption certificate (Box "E")';
        break;
      case "F":
        this.title = 'prescription prepayment certificate';
        this.description = 'has a valid prescription prepayment certificate (Box "F")';
        break;
      case "L":
        this.title = 'Help with health costs (HC2) certificate';
        this.description = 'has a valid Help with health costs (HC2) certificate (Box "L")';
        break;
      case "M":
        this.title = 'Tax credit certificate';
        this.description = 'is entitled to, or named on, a valid NHS Tax Credit Exemption certificate (Box "M")';
        break;
      case "H":
        this.title = 'Income Support or income-related Employment and Support Allowance';
        this.description = 'gets Income Support or income-related Employment and Support Allowance (Box "H")';
        break;
      case "I":
        this.title = 'Income related Employment Support Allowance';
        this.description = 'gets Income Support or income-related Employment and Support Allowance (Box "I")';
        break;
      case "K":
        this.title = 'Income based Jobseekers Allowance';
        this.description = 'gets income-based Jobseekers Allowance (Box "K")';
        break;
      case "S":
        this.title = "Your partner's Pension Credit guarantee credit award";
        this.description = 'has a partner who gets Pension Credit guarantee credit (PCGC) (Box "S")';
        break;
      case "U":
        this.title = "Universal Credit";
        this.description = 'gets Income Support or income-related Employment and Support Allowance (Box "U")';
        break;
      default:
        this.title = "none";
        this.description = "none";
    }
  },
  createAdate : function (day, month, year) {
    return day + " " + monthToText(month) + " " + year;
  }
};

function monthToText(month) {
  month = month.toString();
  if (month.length > 1) {
    if (month.charAt(0) === '0') {
      month = month.substring(1);
    }
  }
  switch (month) {
    case '0':
      return "January";
    case '1':
      return "January";
    case '2':
      return "February";
    case '3':
      return "March";
    case '4':
      return "April";
    case '5':
      return "May";
    case '6':
      return "June";
    case '7':
      return "July";
    case '8':
      return "August";
    case '9':
      return "September";
    case '10':
      return "October";
    case '11':
      return "November";
    case '12':
      return "December";
  }
};

module.exports.content = content;