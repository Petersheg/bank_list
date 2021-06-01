
const loginModal = document.querySelector('.login_modal');
const signupModal = document.querySelector('.signup_modal');
const overlay = document.querySelector('.overlay');
const loginCloseModal = document.querySelector('.login_btn--close-modal');
const signupCloseModal = document.querySelector('.signup_btn--close-modal');

//BTNs
const btnLoginOpenModal = document.querySelector('.open_login-modal');
const btnSignupOpenModal = document.querySelector('.open_signup-modal');

// input fields
const fullNameField = document.querySelector('.fullname');
const mobileField = document.querySelector('.mobile');
const userNameField = document.querySelector('.user_name');
const amountField = document.querySelector('.amount');
const passwordField = document.querySelector('.password');

const btnRegister = document.querySelector('.register_form');

class Modal{
  
    constructor(btnSignupOpenModal ,btnLoginOpenModal){

      this.btnSignupOpenModal = btnSignupOpenModal;
      this.btnLoginOpenModal = btnLoginOpenModal;
        
      this._openModal(this.btnLoginOpenModal,loginModal);
      this._openModal(this.btnSignupOpenModal,signupModal);
      this._closeModal(loginCloseModal,loginModal);
      this._closeModal(signupCloseModal,signupModal);
    }
    
    showModal(modal = loginModal){
      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');
    }
    _openModal(btn = btnLoginOpenModal,modal){
      btn.addEventListener('click', ()=>{
        this.showModal(modal);
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

const modal = new Modal(btnSignupOpenModal,btnLoginOpenModal);

//const Swal = await import('../sweetalert.js');
class Register{
  accounts = JSON.parse(localStorage.getItem('Users')) || [];
  #user
  constructor(){
    btnRegister.addEventListener('submit', this._register.bind(this));
    this._generateBVN();
  }

  // Calculate Interest rate 
  _calcInterest(){
    let intRate = Date.now();
    let newrate = Number(intRate.toString().split('').slice(11,14).join(''))/10
    return newrate
  }

  _generateBVN(){
    let newDate = Date.now();
    let newBVN = Number(newDate.toString().split('').slice(3,14).join(''))
    return newBVN;
  }

  _register(e){
    e.preventDefault();
      // Get the value fo all input fields
      let fullName = fullNameField.value;
      let mobile = mobileField.value;
      let userName = userNameField.value;
      let amount = Number(amountField.value)//Value Converted to number;
      let password = passwordField.value;

      let interest = this._calcInterest();
      const required = fullName !== '' && 
      mobile !== '' && userName !== '' && amount !== '' && password !== '';

      const authUser = ()=>{
        if(required){
          console.log(this);
          // create an object base on the values 
        this.#user = {
          owner : fullName,
          movements:[amount],
          interestRate : interest,
          pin: password,
          bvn: this._generateBVN(),
          
          userName,
          mobile,
        }

        //this.setItem()
        // Clear input fields
        fullNameField.value = mobileField.value =
        userNameField.value = amountField.value = passwordField.value = "";

        modal.hideModal(signupModal);

        // After Successful Registration, Load Login Modal Automatically.
        new swal({
          title: "Success",
          text: "Registration Successful, Kindly Login",
          icon: "success",
        }).then((fulfilled)=>{
          if(fulfilled){
            // Reload Page for login to take effect.
            location.reload();
          }
        })

      }else{
        // Sweet Alart here.
        new swal({
          title:"Error",
          text: 'All fields are require',
          icon : 'error'
        })
      }
      }

      // Check if User Already exist
      this.accounts
      .map(acc=> acc.userName)
      .forEach(userName =>{
       
        if(userNameField.value === userName){
          // if yes Alart Error
          new swal({
            title: "Error",
            text: "Username Alredy exist!",
            icon: 'error'
          })
        }else{
          // Else Authenticate User.
          authUser()
        }
      })
      
  }

  setItem(){
    // Push the object into an array
    this.accounts.push(this.#user);

    // Store the data inside local storage  
    localStorage.setItem('Users', JSON.stringify(this.accounts));
  }
}
const signUp = new Register;
export {Modal,signUp}