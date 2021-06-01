/*This class will handle everything that is not trigger by the user but specific to the system
  eg appending user action(Deposit or Credit), Creating Username, Calculating Balance after every
  action,
*/

// Elements
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerMovements = document.querySelector('.movements');
const {signUp} = await import('./modal.js')

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
  
    // createUserName(accs) {
    //   let allUsers = [];
    //   accs.forEach(acc=>{
    //     acc.userName = acc.owner.split(' ')
    //     .map(val=> val[0])
    //     .join('')
    //     .toLowerCase()
    //     allUsers.push(acc);
    //   });
    // };
  
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
                      labelSumInterest.textContent = `${interest.toFixed(1)}€`;
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

  export {Account}