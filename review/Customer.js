import { Account } from "./Account.js";
import DataStore from "./DataStore.js";
export default class Customer {
    constructor(fullname, mobilenumber, bvn){
       this.fullName = fullname;
       this.mobileNumber = mobilenumber;
       this.bvn = bvn;
       this.accounts = [];
    }

    AddFunds(amount){
        var account = this.accounts[0];
        account.balance = amount;
        this.accounts[0] = account;
    }
    TransferFunds(amount, bvn){
        var recipientCustomer = DataStore.GetCustomerByBVN(bvn);
        var recipientAccount = recipientCustomer.accounts[0];

        var sourceAccount = this.accounts[0];
        sourceAccount.balance -= amount;
        this.accounts[0] = sourceAccount;

        recipientAccount.balance += amount;
        recipientCustomer.accounts[0] = recipientAccount;
        DataStore.AddCustomer(this);
        DataStore.AddCustomer(recipientCustomer)
        console.log(`Transferred ${amount} to ${account}`)
    }

    CreateAccount(balance){
        let account = new Account(balance, this.bvn);
        this.accounts.push(account);
    }
}