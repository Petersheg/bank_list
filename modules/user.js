
/*This Class will handle everything functionality perform by the user
eg user login, Transfer, Loan and closing account or sorting their transaction*/ 

const {Modal} =await import('./modal.js');
const {Account} = await import('./account.js');

// Data
const account1 = {
  owner: 'Peter Oluwase',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Olawotin Joshua',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Adekunle Kolapo',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Instantiate all classes
const newAccount = new Account;
newAccount.createUserName(accounts);

console.log(newAccount);
//export const test = 'Just testing';
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLoginOpenModal = document.querySelector('.open_login-modal');
const btnSignupOpenModal = document.querySelector('.open_signup-modal');
const btnLogOut = document.querySelector('.logout');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const containerApp = document.querySelector('.app');

// CREATE INSTANCE OF CLASS
  const modal = new Modal(btnSignupOpenModal,btnLoginOpenModal);

let currentUser, sorted = false;

class Auser{

    constructor(accounts){
      this.accounts = accounts;
      // Login Functionality
      this.userLogin();
  
      // Transfer Functiuonality
      this.userTransfer();
  
      // Loan Functionality
      this.userLoan();
  
      // Close Account functionality
      this.closAcc();
  
      // Sort functionality
      this.transactionSort()
  
      // Log user out
      this.logout();
    }
  
    userLogin(){
      btnLogin.addEventListener('click',(e)=>{
        e.preventDefault();
        currentUser = this.accounts.find(acc => acc.userName === inputLoginUsername.value);
        console.log(currentUser);
        
        const disPlayLogoutBtn = function(){
          btnLoginOpenModal.classList.add('hidden');
          btnSignupOpenModal.classList.add('hidden');
          btnLogOut.classList.remove('hidden');
        }
  
        if(currentUser?.pin === Number(inputLoginPin.value)){
      
          // Make UI visible
          containerApp.style.opacity = 1;
          // Display welome message
          let fName = currentUser.owner.split(' ')[0]
          labelWelcome.textContent=`Welcome here ${fName}`;
      
          // Clear input field and let it loose focus
            inputLoginUsername.value = "";
            inputLoginPin.value = "";
            inputLoginPin.blur;
         
          // Close Modal
          modal.hideModal();
          disPlayLogoutBtn();
          // update UI
          newAccount.updateUI(currentUser);
        }
      });
    }
  
    userTransfer(){
      btnTransfer.addEventListener('click',(e)=>{
        e.preventDefault();
        let transferAmount = inputTransferAmount.value;
        let receiverAcc = inputTransferTo.value;
      
        let receiverDetail = this.accounts.find(acc => acc.userName === receiverAcc);
      
        // check if currentUser have enough money and if the receiver acc exist and if the transferAmount is possitive
        let transferCondition = currentUser.balance >= transferAmount && 
              receiverAcc && receiverAcc !== currentUser.userName && transferAmount > 0;
        
        if(transferCondition){
          currentUser.movements.push(-transferAmount);
          receiverDetail.movements.push(transferAmount);
      
          // update UI
          newAccount.updateUI(currentUser);
        }
         
        // clearField
        inputTransferAmount.value = ""; inputTransferTo.value = "";
        transferAmount.blur;
      });
    }
  
    userLoan(){
      btnLoan.addEventListener('click',(e)=>{
        e.preventDefault();
        const loanAmount = Number(inputLoanAmount.value);
        if(loanAmount > 0 && currentUser.movements.some(mov => mov >= loanAmount * 0.1)){
          // Push requested amount to movement
          currentUser.movements.push(loanAmount);
          // Update UI
          newAccount.updateUI(currentUser);
          // clear field
          inputLoanAmount.value = "";
        }
      })
    }
  
    closAcc(){
      btnClose.addEventListener('click',(e)=>{
        e.preventDefault();
        let closeUser = inputCloseUsername.value;
        let closePin = Number(inputClosePin.value);
        console.log(closeUser,closePin);
        if(closeUser === currentUser.userName && closePin === currentUser.pin){
          // Delete currentUser from accounts array;
          
          // get currentUser Index
          const index = this.accounts.findIndex(acc => acc.userName === currentUser.userName);
          // Remove it from the accounts array;
          this.accounts.splice(index,1);
          // Remove UI
          containerApp.style.opacity = 0;
        }
        //console.log('Deleted');
      });
    }
  
    transactionSort(){
      btnSort.addEventListener('click',(e)=>{
        e.preventDefault();
        newAccount.appendMovement(currentUser.movements, !sorted)
        //appendMovement(currentUser.movements, !sorted);
        sorted = !sorted;
      });
    }
  
    logout(){
      btnLogOut.addEventListener('click',()=>{
  
  
        containerApp.style.opacity = 0;
        btnLogOut.classList.add('hidden');
        btnLoginOpenModal.classList.remove('hidden');
        btnSignupOpenModal.classList.remove('hidden');
  
        let userToLogOut =  this.accounts.findIndex(user => user.owner === currentUser.owner);
        this.accounts.splice(userToLogOut,1);
      })
    }
}

export {Auser, accounts}
// export const user = new User