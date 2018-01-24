var getOutcome : function (user) {
  if(user.hasCert) {
    if(user.validCertNumber == false) {
      return "cert-not-found";
    } else if (user.certDateValid == false) {
      return "cert-out-of-date";
    } else if (user.certMatches == false) {
      return "cert-doesnt-match"; //contact
    } else if(user.hasCert && user.validCertNumber && user.certDateValid && user.certMatches) {
      return "found";
    }
  } else if (user.udatedDetails) {
    if (user.udatedDetails > 1) {
      return "cert-doesnt-match"; //contact
    } else {
      return "found";
    }
  } else if (user.hasBenefit) {
    if (user.wasPregnant) {
      return "mat-ben"
    } else if (user.hasIllness) {
      return "med-ben"
    } else {
      return "proof-of-benefit";
    }
  } else if (user.wasPregnant) {
      return "mat"
  } else if (user.hasIllness) {
      return "med"
  }
};

//var defaults = {
//  hasCert : false,
//  validCertNumber : false,
//  certDateValid : false,
//  certMatches  : false,
//  hasBenefit : false,
//  wasPregnant : false,
//  hasIllness : false,
//  updatedDetails : false
//};