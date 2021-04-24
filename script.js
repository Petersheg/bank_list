'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
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

const appendMovement = function(movements,sorted= false){
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

function createUserName(accs) {
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
createUserName(accounts)

const balance = function(acc){
  acc.balance = acc.movements.reduce((acc,cur)=>{
    return acc + cur;
  },0);

  labelBalance.textContent = `${acc.balance}€`;
}

const calcSumary = (acct)=>{

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
const updateUI = (user)=>{

   // Calculate CurrentUser Movements
   appendMovement(user.movements);

   // Calculate user Ballance
   balance(user);

   // Calculate user Summary
   calcSumary(user);
}

// Login Functionality
let currentUser;
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
    updateUI(currentUser);
  }
});

// Transfer Functiuonality
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
    updateUI(currentUser);
  }
   
  // clearField
  inputTransferAmount.value = ""; inputTransferTo.value = "";
  transferAmount.blur;
});

// Loan Functionality
btnLoan.addEventListener('click',(e)=>{
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if(loanAmount > 0 && currentUser.movements.some(mov => mov >= loanAmount * 0.1)){
    // Push requested amount to movement
    currentUser.movements.push(loanAmount);
    // Update UI
    updateUI(currentUser);
    // clear field
    inputLoanAmount.value = "";
  }
})

// Close Account functionality
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

// Sort functionality
let sorted = false;
btnSort.addEventListener('click',(e)=>{
  e.preventDefault();
  appendMovement(currentUser.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
