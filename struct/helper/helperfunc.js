/*
 All helper function use in the system will reside here
*/
import {Html} from '../html';
import Swal from "sweetalert2";

const html = new Html;

export class Helper{
    // Private Variables
    constructor(){
      this.calcDate();
    }
    _calcInterest() {
        let intRate = Date.now();
        let newrate =
          Number(intRate.toString().split('').slice(11, 14).join('')) / 10;
        
        return newrate;
    }
    
    _generateBVN() {
        let newDate = Date.now();
        let newBVN = Number(newDate.toString().split('').slice(3, 14).join(''));
        return newBVN;
    }
    
    _generateAccountNumber() {
        return this._generateBVN() - 1111000000;
    }
    
    timeStamp() {
        const time = Date.now();
        let date = new Date(time);
    
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
    
        let hour;
    
        if (date.getHours() === 12) {
          hour = date.getHours() + 1;
        } else {
          date.getHours() > 12
            ? (hour = date.getHours() - 12)
            : (hour = date.getHours());
        }
        const minute = date.getMinutes();
        let seconds;
        String(date.getSeconds()).length > 1
          ? (seconds = date.getSeconds())
          : (seconds = `0${date.getSeconds()}`);
    
        return `${day}/${month}/${year}      ${hour}:${minute}:${seconds}`;
    }

    checkMinimumAmount(accType,type,minAmount){

        if (type === accType && Number(html.amountField.value) !== minAmount) {
          Swal.fire({
            title: 'Error',
            text: `Minimum amount for Tier ${type} is ${minAmount}`,
            icon: 'error',
          });
          return;
        }
    };

    suggestBVN(){
      html.bvnField.addEventListener('focus', e => {
        e.target.value = this._generateBVN();
      });
    }

    // Hide BVN field for Tier One & Display identity fields for Tier three
    setAccountType(){
      html.accountTypeField.addEventListener('change', function(e) {
        let accountType = e.target.value;
    
          // Hide bvn field if Account type is Tier One
          if (accountType === "Tier One") {
            html.bvnField.value = '';
            html.bvnField.style.display = 'none';
            html.labelBVN.style.display = 'none';
          } else{
            html.bvnField.style.display = 'block';
            html.labelBVN.style.display = 'block';
          }
    
          // Display identity fields if account type is Tier three
          if (accountType === "Tier Three") {
            html.idTypeSpan.classList.remove('display_none');
            html.idNumberSpan.classList.remove('display_none');
          } else {
            html.idTypeSpan.classList.add('display_none');
            html.idNumberSpan.classList.add('display_none');
          }
      });
    }

    setTier3ID(accType,idtype,idNo){
        if (accType === "Tier Three") {
            idtype = html.idTypeField.value;
            idNo = html.idNumberField.value;
        }
    }

    clearInputFields(){
        // Clear input fields
        html.fullNameField.value =
        html.mobileField.value =
        html.userNameField.value =
        html.amountField.value =
        html.passwordField.value =
        html.bvnField.value ='';
    }

    calcDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
  
      //return `${day}/${month}/${year}`;
  
      let todayDate = `${day}/${month}/${year}`;
      html.labelDate.textContent = todayDate;
    }

    generateOTP() {
      let otp = Date.now();
      otp = String(otp).split('').slice(8, 13).join('');
      return otp;
    }
}