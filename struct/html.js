
import {Modal} from '../modules/modal.js'
import Swal from "sweetalert2";

export class Html{
    constructor(){

    }

    //export test = 'Just testing';
    containerApp = document.querySelector('.app');
    containerMovements = document.querySelector('.movements');

    btnLogin = document.querySelector('.login__btn');
    btnTransfer = document.querySelector('.form__btn--transfer');
    btnLoan = document.querySelector('.form__btn--loan');
    btnClose = document.querySelector('.form__btn--close');
    btnSort = document.querySelector('.btn--sort');
    btnLoginOpenModal = document.querySelector('.open_login-modal');
    btnSignupOpenModal = document.querySelector('.open_signup-modal');
    btnLogOut = document.querySelector('.logout');

    inputLoginUsername = document.querySelector('.login__input--user');
    inputLoginPin = document.querySelector('.login__input--pin');
    inputTransferTo = document.querySelector('.form__input--to');
    inputTransferAmount = document.querySelector('.form__input--amount');

    inputLoanAmount = document.querySelector('.form__input--loan-amount');
    inputCloseUsername = document.querySelector('.form__input--user');
    inputClosePin = document.querySelector('.form__input--pin');

    labelWelcome = document.querySelector('.welcome');
    labelBVN = document.querySelector('.bvn_label');
    labelACC = document.querySelector('.acc_label');
    labelAccType = document.querySelector('.acc-type_label');

    // Elements
    labelBalance = document.querySelector('.balance__value');
    labelSumIn = document.querySelector('.summary__value--in');
    labelSumOut = document.querySelector('.summary__value--out');
    labelSumInterest = document.querySelector('.summary__value--interest');
    labelTimer = document.querySelector('.timer');
    labelDate = document.querySelector('.date');

    loginModal = document.querySelector('.login_modal');
    signupModal = document.querySelector('.signup_modal');
    overlay = document.querySelector('.overlay');
    loginCloseModal = document.querySelector('.login_btn--close-modal');
    signupCloseModal = document.querySelector('.signup_btn--close-modal');

    //BTNs
    btnLoginOpenModal = document.querySelector('.open_login-modal');
    btnSignupOpenModal = document.querySelector('.open_signup-modal');//Duplicate
    btnRegister = document.querySelector('.register_button'); //'.register_form'

    // input fields
    fullNameField = document.querySelector('.fullname');
    mobileField = document.querySelector('.mobile');
    userNameField = document.querySelector('.user_name');
    amountField = document.querySelector('.amount');
    passwordField = document.querySelector('.password');
    bvnField = document.querySelector('.bvn');
    accountTypeField = document.querySelector('#account_type');
    idTypeField = document.querySelector('.id_type');
    idNumberField = document.querySelector('.id_number');

    // Others
    labelBVN = document.querySelector('.bvn_labell');
    idTypeSpan = document.querySelector('.id_type-span');
    idNumberSpan = document.querySelector('.id_number-span');
};

 let html = new Html();
 let modal = new Modal(html.btnSignupOpenModal,html.btnLoginOpenModal);

export class UI {
    constructor(){
      
    }

    // method to display Logout button after user login
    disPlayLogoutBtn() {
        html.btnLoginOpenModal.classList.add('hidden');
        html.btnSignupOpenModal.classList.add('hidden');
        html.btnLogOut.classList.remove('hidden');
    };

    logUserInfo(user){
        // Make UI visible
        html.containerApp.style.opacity = 1;
        // Display welome message
        // let fName = user.owner.split(' ')[0]
        html.labelWelcome.textContent = `Welcome here ${user.userFullName}`;
        html.labelWelcome.classList.add('highlight');
        // Setting User BVN
        // labelBVN.textContent = `BVN : ${user.bvn}`;
        // labelBVN.classList.remove('hidden');

        // Setting User ACC
        let aza = user.acc.map(accT => accT.accNumber);
        html.labelACC.textContent = ` ACC: ${aza[0]}`;
        html.labelACC.classList.remove('hidden');
        html.labelACC.style.paddingLeft = '15px';

        // Setting User Account Type
        let accType = user.acc.map(accT => accT.accType);
        html.labelAccType.textContent = `Type: ${accType[0]}`;
        html.labelAccType.classList.remove('hidden');
        html.labelAccType.style.paddingLeft = '10px';

        // Clear input field and let it loose focus
        html.inputLoginUsername.value = '';
        html.inputLoginPin.value = '';
        html.inputLoginPin.blur;

        // Close Modal
        modal.hideModal();
        this.disPlayLogoutBtn();
    };

    appendMovement(user, sorted = false) {
      html.containerMovements.innerHTML = '';

      let movements = user.acc.map(accT => accT.mov);
      let movemenetDate = user.acc.map(accT => accT.movementsDate);
      const movs = sorted ? movements[0].sort((a,d) => d-a) : movements[0];

      //let dateTime = this.timeStamp();
      let movRow;

      movs.map((mov, index) =>{
        // Create Html element to insert the movements to
        const type = mov > 0 ? 'credit' : 'debit';
        let currentDate = movemenetDate[0][index];

        // Create all elements with javascript
        movRow = document.createElement('div');
        movRow.classList.add('movements__row');
  
        const movType = document.createElement('div');
        movType.classList.add(`movements__type`, `movements__type--${type}`);
        movType.textContent = `${index + 1} ${type}`;
  
        let movDate = document.createElement('div');
        movDate.classList.add('movements__date');
        movDate.textContent = `${currentDate}`;
  
        const movValue = document.createElement('div');
        movValue.classList.add('movements__value');
        movValue.textContent = `${mov}€`;
  
        // Append them inside each other
        movRow.appendChild(movType);
        movRow.appendChild(movDate);
        movRow.appendChild(movValue);
  
        // Append movRow to parent container
        html.containerMovements.insertAdjacentElement('afterbegin', movRow);
      });
    }
    
    balance(user) {
      let move = user.acc.map(accT => accT.mov);

      move[0].accBalance = move[0].reduce((acc,cur)=>{
          return acc + cur;
      },0)

      html.labelBalance.textContent = `${move[0].accBalance}€`;
    }

    calcSumary(user) {
      let movements = user.acc.map(accT => accT.mov);
      let accInterests = user.acc.map(accT => accT.accInterest);

      const income = movements
        .filter(mov => mov > 0)
        .reduce((acc, cur) => acc + cur, 0);
      html.labelSumIn.textContent = `${income}€`;

      const outcome = movements
        .filter(mov => mov < 0)
        .reduce((acc, cur) => acc + cur, 0);
      html.labelSumOut.textContent = `${Math.abs(outcome)}€`;
      
      const interest = movements
        .filter(mov => mov > 0)
        .map(int => (int * accInterests[0]) / 100)
        .filter(int => int >= 1)
        .reduce((acc, cur) => acc + cur, 0);
      html.labelSumInterest.textContent = `${interest.toFixed(1)}€`;
    }

    // Update Ui
    updateUI(user){
      // Calculate CurrentUser Movements
      this.appendMovement(user);
      //appendMovement(user.movements);

      // Calculate user Ballance
      this.balance(user);

      // Calculate user Summary
      this.calcSumary(user);
    }

    calcDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      //return `${day}/${month}/${year}`;

      let todayDate = `${day}/${month}/${year}`;
      labelDate.textContent = todayDate;
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
}