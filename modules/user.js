
/*This Class will handle everything functionality perform by the user
eg user login, Transfer, Loan and closing account or sorting their transaction*/ 

const {Modal,signUp} = await import('./modal.js');
const {Account} = await import('./account.js');

// Data
// Check if there is any registered user.
let registeredUsers;
if(signUp?.accounts){
  registeredUsers = JSON.parse(localStorage.getItem('Users')) || [];
};

const accounts = [...registeredUsers];

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
  // Get registered users from local storage.
  #userFromLS = JSON.parse(localStorage.getItem('Users')) || [];

    constructor(accounts){

    // Initiate all method 
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
        
        const disPlayLogoutBtn = function(){
          btnLoginOpenModal.classList.add('hidden');
          btnSignupOpenModal.classList.add('hidden');
          btnLogOut.classList.remove('hidden');
        }
  
        if(currentUser?.pin === inputLoginPin.value){
          
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
        }else{
          // Sweet Alart here.
        }
      });
    }
  
    userTransfer(){
      btnTransfer.addEventListener('click',(e)=>{
        e.preventDefault();
        let transferAmount = Number(inputTransferAmount.value);
        let receiverAcc = inputTransferTo.value;
      
        //let receiverDetail = this.accounts.find(acc => acc.userName === receiverAcc);
        let receiverDetail = this.#userFromLS.find(acc => acc.owner === receiverAcc);
      
        // check if currentUser have enough money and if the receiver acc exist and if the transferAmount is possitive
        let transferCondition = currentUser.balance >= transferAmount && 
              receiverAcc && receiverAcc !== currentUser.owner && transferAmount > 0;
        
        if(transferCondition){

          this.#userFromLS.forEach(user =>{
            if(user.owner === currentUser.owner){
              user.movements.push(-transferAmount);
              
              receiverDetail.movements.push(transferAmount);
            }
          });

          currentUser.movements.push(-transferAmount);

          localStorage.setItem('Users',JSON.stringify(this.#userFromLS));
      
          // update UI
          newAccount.updateUI(currentUser);
        }else{
          // Sweet Alert here
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
          console.log(this.#userFromLS);

          this.#userFromLS.forEach(element => {
            if(element.owner === currentUser.owner){
              element.movements.push(loanAmount)
            }
          });

          localStorage.setItem('Users', JSON.stringify(this.#userFromLS));

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
        }else{
          // Sweet Alart here
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