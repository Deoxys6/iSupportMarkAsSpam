// ==UserScript==
// @name         Isupport mark as Spam - Dev
// @namespace    http://tampermonkey.net/
// @version      2024-09-20
// @description  Creates a button to mark tickets as spam automatically
// @author       Weston Wingo
// @match        https://isupport.okstate.edu/Rep/Incident/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okstate.edu
// @grant        none
// ==/UserScript==
/* global $, __doPostBack*/


/*
let styleSheet = `
.SpamButton {
    background-color: red;
    padding: 5px;
}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appenedChild(s);

*/

(function() {
    'use strict';

    function categoryUpdated() {
        let category = document.getElementById("uxDetailsSection_uxCategorySelect_uxLabel_Category");
        return category.textContent == 'OKC-IT  zOther'
    }


    //Function for pressing the "Save and Exit" button
    function saveExit() {
        let saveButton = document.getElementsByClassName("rrbButtonOut rrbLargeButton rrbDualImage");
        setTimeout(10);
        saveButton[1].click();
    }

    //Function for pressing the OK button after everything is done
    function okButton () {
        document.getElementById("uxIncidentSaveDialog_btnOK").click();
    }

    function tryToSave() {
        if (categoryUpdated()) {
           saveExit();
           console.log("page Updated")
         }
         else {
           window.setTimeout(tryToSave, 200);
         }
    }

     function tryToOK() {
         if (document.getElementById("uxIncidentSaveDialog_btnOK").checkVisibility()) {
             okButton();
             console.log("OK button visible")
         }
         else {
             window.setTimeout(tryToOK, 200);
         }

    }

    //Function to make an individual ticket as spam
    function markAsSpam () {
        //Status of the Ticket
        //select the status dropdown
        var dropdown = document.getElementById("uxDropDownList_IncidentStatus");
        //set the status to closed
        dropdown.selectedIndex = 1;

        //Category of the ticket
        //get the ID of the category and set it to zOther
        document.getElementById("uxDetailsSection_uxCategorySelect_CategorySelect_uxHiddenFieldCategoryID").value = 723;
        //get the Name of the category and set it to zOther OKC-IT
        document.getElementById("uxDetailsSection_uxCategorySelect_CategorySelect_uxHiddenFieldCategoryName").value = "OKC-IT <br /> zOther";
        //updates categories
        __doPostBack('uxDetailsSection$uxCategorySelect$uxLinkButton_Category','');
        //Resolution of the ticket
        let resolutionBody = document.getElementById("uxTabsSection_uxEditor_Resolution_RadEditor2_contentIframe");
        resolutionBody.contentWindow.document.getElementsByTagName("body")[0].innerHTML += "Spam";

        //Press save and exit after a small delay
        let category = document.getElementById("uxDetailsSection_uxCategorySelect_uxLabel_Category");

        tryToSave();
        setTimeout(10);
        tryToOK();

    }

    let btn = document.createElement("button");
    btn.innerHTML = "Spam";
    btn.className = "SpamButton";
    btn.onclick = () => {
        markAsSpam();
    }
    let p = document.getElementsByClassName("rrbButtonAreaIn")[0];
    p.append(btn);
})();