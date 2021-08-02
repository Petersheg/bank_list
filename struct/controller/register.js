import {Html} from "../html.js";
import { Helper } from "../helper/helperfunc.js";
import Store from '../store.js';
import {Modal} from '../modal.js';
import Swal from "sweetalert2";
import { User} from "../user.js";

let store = new Store();
const helperFunc = new Helper();
const html = new Html;
let allUsers = store.getAllUsers();
const modal = new Modal(html.btnSignupOpenModal,html.btnLoginOpenModal);

let accountType = {
    tier1 : "Tier One",
    tier2 : "Tier Two",
    tier3 : "Tier Three",
}
let accType;
html.accountTypeField.addEventListener('change', (e) => accType = e.target.value );

export function register(e){
    e.preventDefault();
    let userNameExist;

    // Get the value for all input fields
    let userFullName = html.fullNameField.value;
    let userMobile = html.mobileField.value;
    let userName = html.userNameField.value;
    let amount = Number(html.amountField.value); //Value Converted to number;;
    let userPin = html.passwordField.value;
    let accNumber = helperFunc._generateAccountNumber();
    let bvn, idenType, idenNumber, minAmount,maxAmount;
    let movementsDate = [helperFunc.timeStamp()]

    let accInterest = helperFunc._calcInterest();

    const required =
        userFullName !== '' &&
        userMobile !== '' &&
        userName !== '' &&
        amount !== '' &&
        userPin !== '';

    // No BVN for Tier One acount
    accType === accountType
    .tier1  ? (bvn = undefined) : (bvn = html.bvnField.value);

    // Set identity type and number for Tier Three
    if (accType === "Tier Three") {
      idenType = html.idTypeField.value;
      idenNumber = html.idNumberField.value;
    }

    // set minimum and maximum amount for each account type
    if(accType === accountType.tier1){
      maxAmount = 500000;
      minAmount = 1000;
    }

    if(accType === accountType.tier2){
      maxAmount = 2000000;
      minAmount = 5000;
    }

    if(accType === accountType.tier3){
      maxAmount = 5000000;
      minAmount = 20000;
    }

    const authUser = ()=>{

      let tier1Range = Number(html.amountField.value) >= 1000 && 
      Number(html.amountField.value) <= 500000;

      if (accType === "Tier One" && !tier1Range) {
        Swal.fire({
          title: 'Error',
          text: `Amount for Tier One is between 1,000 - 500,000`,
          icon: 'error',
        });
        return;
      }

      let tier2Range = Number(html.amountField.value) >= 5000 && 
      Number(html.amountField.value) <= 2000000;

      if (accType === "Tier Two" && !tier2Range) {
        Swal.fire({
          title: 'Error',
          text: `Amount for Tier Two is between 5,000 - 2,000,000`,
          icon: 'error',
        });
        return;
      }

      let tier3Range = Number(html.amountField.value) >= 20000 && 
      Number(html.amountField.value) <= 5000000;
      if (accType === "Tier Three" && !tier3Range) {
        Swal.fire({
          title: 'Error',
          text: `Amount for Tier Three is between 20,000 - 5,000,000`,
          icon: 'error',
        });
        return;
      }

      // create a new user
      const user = new User(userFullName,userName,userPin,userMobile,bvn);
      
      //  Create new account for user;
        user.createAcc(accNumber,amount,movementsDate,accType,accInterest,minAmount,maxAmount,idenType,idenNumber);

      //  Add user info to the store
        store.saveUser(user);

      // Clear input fields
        helperFunc.clearInputFields();

        modal.hideModal(html.signupModal);

        // After Successful Registration, Load Login Modal Automatically.
        Swal.fire({
          title: 'Success',
          text: 'Registration Successful, Kindly Login',
          icon: 'success',
        }).then(fulfilled => {
          if (fulfilled) {
            // Reload Page for login to take effect.
            location.reload();
          }
        });
    }

      // If there is registered user then check if the userName user try to register does not exist.
      if (allUsers.length > 0) {
        userNameExist = allUsers
          .map(acc => acc.userName)
          .some(user => user === html.userNameField.value);
      }

      if (userNameExist) {
        // if yes Alart Error
        Swal.fire({
          title: 'Error',
          text: 'Username Alredy exist!',
          icon: 'error',
        });
      } else {
        // Check if amount match the minimum amount for each account type.
        // Check if no user at all or all field are filled
        if ((allUsers.length === 0 && required) || required) {
          authUser();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'All fields are require',
            icon: 'error',
          });
        }
      }
}