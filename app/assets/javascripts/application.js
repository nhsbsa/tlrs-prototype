/* global $ */
/* global GOVUK */

console.log("here");

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}    

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
  
  if(document.getElementById('hasmail')) {
    var hasMail = document.getElementById('hasmail').innerHTML;
    var mailAddress = document.getElementById('mailaddress');
    if(hasMail == "No") {
      mailAddress.style.display = 'none';
    }
  }
  
  // DONE - The email needs to be removed when the user doesnt have one
  
  if (document.getElementById('usermail')) {
    var hasMail = document.getElementById('usermail').innerHTML;
    var email = document.getElementById('email');
    if (hasmail == "true") {
      email.style.display = 'block';
    } else {
      email.style.display = 'none';
    }
  }
    
      //checkbox contact
  if (document.getElementById("contact-boxes")) {
    var textBox = document.getElementById("text");
    var emailBox = document.getElementById("email");
    var postBox = document.getElementById("post");
    postBox.addEventListener('change', cancelPrefs);
    function cancelPrefs() {
       emailBox.checked = false;
       textBox.checked = false;
    }
    emailBox.addEventListener('change', changePrefs);
    textBox.addEventListener('change', changePrefs);
    function changePrefs() {
       postBox.checked = false;
    }
  }
  
})
