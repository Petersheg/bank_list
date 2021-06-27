/*This Class will handle everything functionality perform by the user
eg user login, Transfer, Loan and closing account or sorting their transaction*/

const { Modal, signUp } = await import('./modal.js');
const { Account } = await import('./account.js');
import Swal from '../node_modules/sweetalert2/src/sweetalert2.js';

// Data
// Check if there is any registered user.
let registeredUsers;
if (signUp?.accounts) {
  registeredUsers = JSON.parse(localStorage.getItem('Users')) || [];
}

// Spread registered User to array
const accounts = [...registeredUsers];

// Instantiate all classes
const newAccount = new Account();

//export const test = 'Just testing';
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
// const btnLoan = document.querySelector('.form__btn--loan');
// const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLoginOpenModal = document.querySelector('.open_login-modal');
const btnSignupOpenModal = document.querySelector('.open_signup-modal');
const btnLogOut = document.querySelector('.logout');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
// const inputLoanAmount = document.querySelector('.form__input--loan-amount');
// const inputCloseUsername = document.querySelector('.form__input--user');
// const inputClosePin = document.querySelector('.form__input--pin');

const labelWelcome = document.querySelector('.welcome');
const labelBVN = document.querySelector('.bvn_label');
const labelACC = document.querySelector('.acc_label');
const labelAccType = document.querySelector('.acc-type_label');
const containerApp = document.querySelector('.app');

// CREATE INSTANCE OF CLASS
const modal = new Modal(btnSignupOpenModal, btnLoginOpenModal);

let currentUser,
  sorted = false;

class Auser {
  // Get registered users from local storage.
  #userFromLS = JSON.parse(localStorage.getItem('Users')) || [];

  constructor(accounts) {
    // Initiate all method
    this.accounts = accounts;
    // Login Functionality
    this.userLogin();

    // Transfer Functiuonality
    this.userTransfer();

    // Loan Functionality
    // this.userLoan();

    // Close Account functionality
    // this.closAcc();

    // Sort functionality
    this.transactionSort();

    // Log user out
    this.logout();
  }

  userLogin() {
    btnLogin.addEventListener('click', e => {
      e.preventDefault();
      // Look up for current user!
      currentUser =
        this.#userFromLS.find(
          acc => acc.userName === inputLoginUsername.value
        ) || [];

      // method to display Logout button after user login
      const disPlayLogoutBtn = function () {
        btnLoginOpenModal.classList.add('hidden');
        btnSignupOpenModal.classList.add('hidden');
        btnLogOut.classList.remove('hidden');
      };

      // Log User in if creadebtials are correct! else dispalay error message.
      if (
        currentUser?.pin === inputLoginPin.value &&
        currentUser?.userName == inputLoginUsername.value
      ) {
        // Make UI visible
        containerApp.style.opacity = 1;
        // Display welome message
        // let fName = currentUser.owner.split(' ')[0]
        labelWelcome.textContent = `Welcome here ${currentUser.owner}`;
        labelWelcome.classList.add('highlight');
        // Setting User BVN
        // labelBVN.textContent = `BVN : ${currentUser.bvn}`;
        // labelBVN.classList.remove('hidden');

        // Setting User ACC
        labelACC.textContent = ` ACC: ${currentUser.accountNumber}`;
        labelACC.classList.remove('hidden');
        labelACC.style.paddingLeft = '15px';

        // Setting User Account Type
        labelAccType.textContent = `Type: ${currentUser.accType}`;
        labelAccType.classList.remove('hidden');
        labelAccType.style.paddingLeft = '10px';

        // Clear input field and let it loose focus
        inputLoginUsername.value = '';
        inputLoginPin.value = '';
        inputLoginPin.blur;

        // Close Modal
        modal.hideModal();
        disPlayLogoutBtn();
        // update UI
        newAccount.updateUI(currentUser);
      } else {
        // Sweet Alart here.
        Swal.fire('Warning', 'Wrong Log in details', 'error');
      }
    });
  }

  generateOTP() {
    let otp = Date.now();
    otp = String(otp).split('').slice(8, 13).join('');
    return otp;
  }

  // For SweetAlert Toast
  toast(icon, msg) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: msg,
    });
  }

  userTransfer() {
    btnTransfer.addEventListener('click', e => {
      e.preventDefault();

      let transactionOTP = this.generateOTP();

      let transferAmount = Number(inputTransferAmount.value);
      let receiverAcc = inputTransferTo.value;

      //find where receiver accountNo is equal to sender input
      let receiverDetail = this.#userFromLS.find(
        acc => String(acc.accountNumber) === receiverAcc
      );

      //console.log(receiverDetail);
      // check if currentUser have enough money and if the receiver acc exist and if the transferAmount is possitive
      let transferCondition =
        currentUser.balance >= transferAmount &&
        receiverAcc &&
        receiverAcc !== String(currentUser.accountNumber) &&
        transferAmount > 0;

      if (transferCondition && receiverDetail) {
        //console.log(receiverDetail.balance + transferAmount);
        const total = receiverDetail?.movements.reduce((a, b) => a + b, 0);

        this.#userFromLS.forEach(user => {

          if (user.owner === currentUser.owner) {

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
                  const dateAndTime = signUp.timeStamp();
                  user.movementsDate.push(dateAndTime);
                  receiverDetail.movementsDate.push(dateAndTime);

                  // Debit the sender
                  user.movements.push(-transferAmount);
                  // Credit the Receiver
                  receiverDetail.movements.push(transferAmount);
                  
                  localStorage.setItem(
                    'Users',
                    JSON.stringify(this.#userFromLS)
                  );

                  // update UI
                  newAccount.updateUI(currentUser);
                  // clearField
                  inputTransferAmount.value = '';
                  inputTransferTo.value = '';
                  transferAmount.blur;
                  // Toast a successful message
                  this.toast('success', 'Transfer Successful');
                } else {
                  this.toast('error', 'Wrong OTP');
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

  // userLoan(){
  //   btnLoan.addEventListener('click',(e)=>{
  //     e.preventDefault();
  //     const loanAmount = Number(inputLoanAmount.value);
  //     if(loanAmount > 0 && currentUser.movements.some(mov => mov >= loanAmount * 0.1)){

  //       this.#userFromLS.forEach(element => {
  //         if(element.owner === currentUser.owner){
  //           element.movements.push(loanAmount);
  //         }
  //       });

  //       localStorage.setItem('Users', JSON.stringify(this.#userFromLS));
  //       // Update UI
  //       newAccount.updateUI(currentUser);
  //       // clear field
  //       inputLoanAmount.value = "";
  //     }else{
  //       Swal.fire('Warning','Wrong Input','error');
  //     }
  //   })
  // }

  // closAcc(){
  //   btnClose.addEventListener('click',(e)=>{
  //     e.preventDefault();
  //     let closeUser = inputCloseUsername.value;
  //     let closePin = inputClosePin.value;

  //     if(closeUser === currentUser.owner && closePin === currentUser.pin){
  //       // Delete currentUser from Local storage;

  //       // LookUp user from Local Storage
  //       const index = this.#userFromLS.findIndex(acc => acc.owner === currentUser.owner);
  //       // Delete user from array.
  //       this.#userFromLS.splice(index,1);
  //       // Set Local storage with remaining users.
  //       localStorage.setItem('Users',JSON.stringify(this.#userFromLS));
  //       // Reload page.
  //       location.reload();
  //       // Remove UI.
  //       containerApp.style.opacity = 0;

  //     }else{
  //       // Sweet Alart here
  //       Swal.fire('Warning','Wrong details','error');
  //     }
  //   });
  // }

  transactionSort() {
    btnSort.addEventListener('click', e => {
      e.preventDefault();
      newAccount.appendMovement(currentUser.movements, !sorted);
      //appendMovement(currentUser.movements, !sorted);
      sorted = !sorted;
    });
  }

  logout() {
    btnLogOut.addEventListener('click', () => {
      containerApp.style.opacity = 0;
      btnLogOut.classList.add('hidden');
      btnLoginOpenModal.classList.remove('hidden');
      btnSignupOpenModal.classList.remove('hidden');

      // reload the page
      location.reload();
    });
  }
}

export { Auser, accounts };
// export const user = new User
