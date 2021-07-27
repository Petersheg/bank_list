import { Helper } from "./helper/helperfunc.js";
import {Html,UI} from "./html.js";
import Store from './store';
import { Maintier, Tier3} from "./accounts.js";'./accounts'
import {register} from './controller/register.js';
import {login} from './controller/login.js'
import Swal from "sweetalert2";

let store = new Store();
const helperFunc = new Helper();
const html = new Html();
const ui = new UI;

export class User{
    currentUser;

    constructor(userFullName,userName,userPin,userMobile,userBVN){

        this.userFullName = userFullName;
        this.userName = userName;
        this.userPin = userPin;
        this.userMobile = userMobile;
        this.userBVN = userBVN;
        this.acc = [];

        this.register();
        this.userLogin();
        this.makeTransfer();
        this.logOut();
    }

    register(){
      helperFunc.suggestBVN();
      helperFunc.setAccountType();
  
      html.btnRegister.addEventListener('click', register);
    }

    createAcc(accNumber,accBalance,movementsDate,accType,accInterest,minAmount,maxAmount,idenType,idenNumber){
      let newAcc;
      newAcc = accType === 'Tier Three' ?
      new Tier3(accNumber,accBalance,movementsDate,accType,accInterest,minAmount,maxAmount,idenType,idenNumber) :
      new Maintier(accNumber,accBalance,movementsDate,accType,accInterest,minAmount,maxAmount);
      // new AccType()

      this.acc.push(newAcc);
    }

    userLogin() {
        
      html.btnLogin.addEventListener('click', e=> {   
        e.preventDefault();
        this.currentUser = login(html.inputLoginUsername.value,html.inputLoginPin.value);
      });
    }

    makeTransfer() {
        let allUsers = store.getAllUsers();
        
      html.btnTransfer.addEventListener('click', e => {
        e.preventDefault();
  
        let transactionOTP = helperFunc.generateOTP();
  
        let transferAmount = Number(html.inputTransferAmount.value);
        let receiverAcc = html.inputTransferTo.value;
  
        //find where receiver accountNo is equal to sender input
        let receiverDetail = allUsers.map(user => user.acc)
        .flat().find(acc => String(acc.accNumber) === receiverAcc);
  
        // check if currentUser have enough money and if the receiver acc exist and if the transferAmount is possitive
        let currentUserAcc = this.currentUser.acc.find(acc => acc.mov);

        let transferCondition =
          currentUserAcc.accBalance >= transferAmount &&
          receiverAcc &&
          receiverAcc !== String(currentUserAcc.accNumber) &&
          transferAmount > 0;
  
        if (transferCondition && receiverDetail) {
          const total = receiverDetail?.mov.reduce((a, b) => a + b, 0);
  
          allUsers.forEach(user => {
  
            if (user.userFullName === this.currentUser.userFullName) {
  
              // Check for Maximum balance for each account type
              let maxBalanceCheck =
                (receiverDetail.accType === 'Tier One' &&
                  total + transferAmount <= 100000) ||
                (receiverDetail.accType === 'Tier Two' &&
                  total + transferAmount <= 1000000) ||
                (receiverDetail.accType === 'Tier Three' &&
                  total + transferAmount <= 5000000);
  
              if (maxBalanceCheck && transactionOTP) {
  
                // Prompt User to Supply OTP
                Swal.fire({
                  title: 'supply OTP',
                  text: `input this OTP code (${transactionOTP}) to conplete this transaction`,
                  icon: 'info',
                  input: 'text',
                }).then(fulfiled => {
  
                  if (fulfiled.isConfirmed && fulfiled.value === transactionOTP) {
  
                    // Generate time and date and push it to movementsDate
                    const dateAndTime = helperFunc.timeStamp();

                    currentUserAcc.movementsDate.push(dateAndTime);
                    receiverDetail.movementsDate.push(dateAndTime);
  
                    // Debit the sender
                    currentUserAcc.mov.push(-transferAmount);
                    // Credit the Receiver
                    receiverDetail.mov.push(transferAmount);


                    store.saveAllUsers(allUsers);
                    console.log(allUsers);
                    console.log(currentUserAcc);
                    // update UI
                    ui.updateUI(this.currentUser);
                    // clearField
                    html.inputTransferAmount.value = '';
                    html.inputTransferTo.value = '';
                    transferAmount.blur;
                    // Toast a successful message
                    ui.toast('success', 'Transfer Successful');
                  } else {
                    ui.toast('error', 'Wrong OTP');
                  }
                });
              } else {
                Swal.fire({
                  title: 'Warning',
                  text: 'Maximum amount for the receiver exceeded',
                  icon: 'error',
                });
              }
            }
          });
        } else {
          // Sweet Alert here
          Swal.fire('Warning', 'Wrong Receiver info.', 'error');
        }
      });
    }

    logOut(){

      html.btnLogOut.addEventListener('click', () => {
        html.containerApp.style.opacity = 0;
        html.btnLogOut.classList.add('hidden');
        html.btnLoginOpenModal.classList.remove('hidden');
        html.btnSignupOpenModal.classList.remove('hidden');
  
        // reload the page
        location.reload();
      });

    }
};