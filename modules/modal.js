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

const btnRegister = document.querySelector('.register_button') 

export class Modal{

  #accounts = []; 
  
    constructor(btnSignupOpenModal,btnLoginOpenModal){

        this.btnSignupOpenModal = btnSignupOpenModal;
        this.btnLoginOpenModal = btnLoginOpenModal;
        
      this._openModal(this.btnLoginOpenModal,loginModal);
      this._openModal(this.btnSignupOpenModal,signupModal);
      this._closeModal(loginCloseModal,loginModal);
      this._closeModal(signupCloseModal,signupModal);
      this._register();
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

    _register(){
      btnRegister.addEventListener('click',(e)=>{
        e.preventDefault();
        // Get the value fo all input fields
        let fullName = fullNameField.value;
        let mobile = mobileField.value;
        let bvn = bvnField.value; 
        let amount = amountField.value;
        let password = passwordField.value;

        // Calculate Interest rate 
      const calInterest = function(){
        let intRate = Date.now();
        let newrate = Number(intRate.toString().split('').slice(11,14).join(''))/10
        return newrate
      }

      let interest = calInterest();
        // create an object base on the values 
        const account = {
          owner : fullName,
          movements:[amount],
          interestRate : interest,
          password,
          
          mobile,
          bvn,
        }

        // Push the object into an array
        this.#accounts.push(account);

        // Store the data inside local storage
        //localStorage.setItem('Users', JSON.stringify(this.#accounts));

        // Clear input fields
        fullNameField.value = mobileField.value =
        bvnField.value = amountField.value = passwordField.value = "";

        console.log(this.#accounts);
      })
    }
}