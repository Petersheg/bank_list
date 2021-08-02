import {Html} from "./html.js";
import { Helper } from "./helper/helperfunc.js";
import Store from './store';
import { Maintier, Tier3} from "./accounts.js";
import {register} from './controller/register.js';
import {login} from './controller/login.js';
import transfer from "./controller/transfer.js";
import logout from './controller/logout';

const html = new Html();
let store = new Store();
const helperFunc = new Helper();
let allUsers = store.getAllUsers();

let currentUser;

export default allUsers;

export class User{

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

    userLogin(){
        
      html.btnLogin.addEventListener('click', e=> {
        e.preventDefault();
        currentUser = login(html.inputLoginUsername.value,html.inputLoginPin.value);
      });
    }

    makeTransfer(){

      html.btnTransfer.addEventListener('click', e =>{
        
        e.preventDefault();
        transfer(Number(html.inputTransferAmount.value),Number(html.inputTransferTo.value));
        
      });

    }

    logOut(){
      html.btnLogOut.addEventListener('click', logout);
    }

};

export {currentUser};