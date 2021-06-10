
const loginModal = document.querySelector('.login_modal');
const signupModal = document.querySelector('.signup_modal');
const overlay = document.querySelector('.overlay');
const loginCloseModal = document.querySelector('.login_btn--close-modal');
const signupCloseModal = document.querySelector('.signup_btn--close-modal');

//BTNs
const btnLoginOpenModal = document.querySelector('.open_login-modal');
const btnSignupOpenModal = document.querySelector('.open_signup-modal');
const btnRegister = document.querySelector('.register_button');//'.register_form'

// input fields
const fullNameField = document.querySelector('.fullname');
const mobileField = document.querySelector('.mobile');
const userNameField = document.querySelector('.user_name');
const amountField = document.querySelector('.amount');
const passwordField = document.querySelector('.password');
const bvnField = document.querySelector('.bvn');
const accountTypeField = document.querySelector('#account_type')

const labelBVN =document.querySelector('.bvn_labell');

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
  #user;
  #accType;
  constructor(){
    //btnRegister.addEventListener('click', this._register.bind(this));
    this._generateBVN();
    this._register();
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

  _generateAccountNumber(){
    return this._generateBVN() - 1111000000;
  }

  _register(){
    console.log(this.accounts.length);

    // Suggest BVN for User
    bvnField.addEventListener('focus',(e)=>{
      e.target.value = this._generateBVN();
    })

    accountTypeField.addEventListener('change',(e)=>{
      let select = e.target.value
      if(select === 'Tier One'){

        bvnField.value = "";
        bvnField.style.display = 'none';
        labelBVN.style.display = 'none';
      }else{
        bvnField.style.display = 'block';
        labelBVN.style.display = 'block';
      }

      this.#accType = select;
      console.log(select);
    })

    btnRegister.addEventListener('click', (e)=>{
      e.preventDefault();
      // Get the value for all input fields
      let fullName = fullNameField.value;
      let mobile = mobileField.value;
      let userName = userNameField.value;
      let amount = Number(amountField.value)//Value Converted to number;
      let password = passwordField.value;
      let bvn;

      // Auto generate BVN for Tier One acount
      this.#accType === 'Tier One' ? bvn = this._generateBVN() : bvn = bvnField.value;

      let interest = this._calcInterest();
      const required = fullName !== '' && 
      mobile !== '' && userName !== '' && amount !== '' && password !== '';

      const authUser = ()=>{
           // create an object base on the values 
           this.#user = {
            owner : fullName,
            movements:[amount],
            interestRate : interest,
            pin: password,
            bvn: bvn,
            accountNumber: this._generateAccountNumber(),
            accType : this.#accType,
            
            userName,
            mobile,
          }
  
          this.setItem()
          // Clear input fields
          fullNameField.value = mobileField.value =
          userNameField.value = amountField.value = passwordField.value = bvnField.value = "";
  
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
      }

      let userNameExist;

      // If there is registered user if yes then check if userName user try to register does not exist.
      if(this.accounts.length > 0){
        userNameExist = 
        this.accounts
        .map(acc => acc.userName)
        .some(user => userNameField.value === user)
      }
     
      if(userNameExist){
        // if yes Alart Error
        new swal({
          title: "Error",
          text: "Username Alredy exist!",
          icon: 'error'
        })
      }else{
        // Check if no user at all or all field are filled
        if(this.accounts.length <= 0 && required || required){
          authUser()
        }else{
          // Sweet Alart here.
          new swal({
            title:"Error",
            text: 'All fields are require',
            icon : 'error'
          })
        }
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