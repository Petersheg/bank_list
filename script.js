'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

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

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

/*This class will handle everything that is not trigger by the user but specific to the system
  eg appending user action(Deposit or Credit), Creating Username, Calculating Balance after every
  action,
*/ 
class Account{

  appendMovement(movements,sorted= false){
    containerMovements.innerHTML = '';
    const movs = sorted ? movements.slice().sort((a,b)=> a-b) : movements;
  
    movs.forEach((mov,index) => {
  
      // Create Html element to insert the movements to
      const type = mov > 0 ? 'deposit' : 'withdrawal';
  
      // Create all elements with javascript
      const movRow = document.createElement('div');
            movRow.classList.add('movements__row');
      const movType = document.createElement('div');
            movType.classList.add(`movements__type`,`movements__type--${type}`);
            movType.textContent = `${index+1} ${type}`
      const movValue = document.createElement('div');
            movValue.classList.add('movements__value');
            movValue.textContent = `${mov}€`
  
      // Append them inside each other
      movRow.appendChild(movType);
      movRow.appendChild(movValue);
  
      // Append movRow to parent container
      containerMovements.insertAdjacentElement('afterbegin',movRow);
    });
  }

  createUserName(accs) {
    let allUsers = [];
    accs.forEach(acc=>{
      acc.userName = acc.owner.split(' ')
      .map(val=> val[0])
      .join('')
      .toLowerCase()
      allUsers.push(acc);
    });
    console.log(allUsers);
  };

  balance(acc){
    acc.balance = acc.movements.reduce((acc,cur)=>{
      return acc + cur;
    },0);
  
    labelBalance.textContent = `${acc.balance}€`;
  }

  calcSumary(acct){

    const income = acct.movements.filter(mov => mov > 0)
                  .reduce((acc,cur)=> acc + cur,0)
                  labelSumIn.textContent = `${income}€`;
    const outcome = acct.movements.filter(mov => mov < 0)
                  .reduce((acc,cur)=> acc + cur,0)
                  labelSumOut.textContent = `${Math.abs(outcome)}€`;
    const interest = acct.movements.filter(mov => mov > 0)
                    .map(int => (int * acct.interestRate)/100)
                    .filter(int => int >= 1)
                    .reduce((acc,cur)=> acc+cur,0);
                    labelSumInterest.textContent = `${interest}€`;
  }
  // Update Ui
  updateUI(user){

    // Calculate CurrentUser Movements
    this.appendMovement(user.movements)
    //appendMovement(user.movements);

    // Calculate user Ballance
    this.balance(user);

    // Calculate user Summary
    this.calcSumary(user);
  }
}

const newAccount  = new Account;

newAccount.createUserName(accounts);

/*This Class will handle everything functionality perform by the user
  eg user login, Transfer, Loan and closing account or sorting their transaction*/ 
let currentUser, sorted = false;

class User{

  constructor(){
    console.log(this);
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
  }
  
  userLogin(){
    btnLogin.addEventListener('click',(e)=>{
      e.preventDefault();
      currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);
      console.log(currentUser);
    
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
    
      let receiverDetail = accounts.find(acc => acc.userName === receiverAcc);
    
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
        const index = accounts.findIndex(acc => acc.userName === currentUser.userName);
        // Remove it from the accounts array;
        accounts.splice(index,1);
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
}

const user = new User

/////////////////////////////////////////////////
