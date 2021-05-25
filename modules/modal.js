const loginModal = document.querySelector('.login_modal');
const signupModal = document.querySelector('.signup_modal');
const overlay = document.querySelector('.overlay');
const loginCloseModal = document.querySelector('.login_btn--close-modal');
const signupCloseModal = document.querySelector('.signup_btn--close-modal');

// input fields
const fullNameField = document.querySelector('.fullname');
const mobileField = document.querySelector('.mobile');
const bvnField = document.querySelector('.bvn');
const amountField = document.querySelector('.amount');
const passwordField = document.querySelector('.password');

const btnRegister = document.querySelector('.register_form');

export class Modal{
  
    constructor(btnSignupOpenModal,btnLoginOpenModal){

      this.btnSignupOpenModal = btnSignupOpenModal;
      this.btnLoginOpenModal = btnLoginOpenModal;
        
      this._openModal(this.btnLoginOpenModal,loginModal);
      this._openModal(this.btnSignupOpenModal,signupModal);
      this._closeModal(loginCloseModal,loginModal);
      this._closeModal(signupCloseModal,signupModal);
    }
  
    _openModal(btn,modal){
      btn.addEventListener('click', ()=>{
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
      })
    }
  
    hideModal(modal = loginModal){
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
    }
  
    _closeModal(btn,modal){
  
      // Add event listener to the btn passed in
      btn.addEventListener('click', ()=>{
        this.hideModal(modal);
      })
  
      // Add evebt listener to overlay to close modal
      overlay.addEventListener('click',()=>{
        this.hideModal(modal);
      })
    }
}
class Register{
  accounts = JSON.parse(localStorage.getItem('Users')) || [];
  #user
  constructor(){
    btnRegister.addEventListener('submit', this._register.bind(this) );
  }

  // Calculate Interest rate 
  _calInterest(){
    let intRate = Date.now();
    let newrate = Number(intRate.toString().split('').slice(11,14).join(''))/10
    return newrate
  }

  _register(e){

    e.preventDefault();
      // Get the value fo all input fields
      let fullName = fullNameField.value;
      let mobile = mobileField.value;
      let bvn = bvnField.value; 
      let amount = Number(amountField.value)//Value Converted to number;
      let password = passwordField.value;

      let interest = this._calInterest();
      console.log(this);
      // create an object base on the values 
      this.#user = {
        owner : fullName,
        movements:[amount],
        interestRate : interest,
        pin: password,
        
        mobile,
        bvn,
      }
      console.log(this.#user);

      this.setItem()
      // Clear input fields
      fullNameField.value = mobileField.value =
      bvnField.value = amountField.value = passwordField.value = "";
  }

  setItem(){
    // Push the object into an array
    this.accounts.push(this.#user);

    // Store the data inside local storage  
    localStorage.setItem('Users', JSON.stringify(this.accounts));
  }
}

const signUp = new Register;
export {signUp}