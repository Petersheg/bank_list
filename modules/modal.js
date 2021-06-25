import Swal from '../node_modules/sweetalert2/src/sweetalert2.js'

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
const accountTypeField = document.querySelector('#account_type');
const idTypeField = document.querySelector('.id_type');
const idNumberField = document.querySelector('.id_number');

// Others
const labelBVN =document.querySelector('.bvn_labell');
const idTypeSpan = document.querySelector('.id_type-span');
const idNumberSpan = document.querySelector('.id_number-span');

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

    // Auto Add Minimum Amount for each account type
    amountField.addEventListener('focus',(e)=>{

      if(this.#accType === 'Tier One'){
        e.target.value = 1000
      }
      if(this.#accType === 'Tier Two'){
        e.target.value = 5000
      }
      if(this.#accType === 'Tier Three'){
        e.target.value = 20000
      }
      console.log(e.target);
    }); 

    accountTypeField.addEventListener('change',(e)=>{
      let select = e.target.value

      // Hide bvn field if Account type is Tier One
      if(select === 'Tier One'){
        bvnField.value = "";
        bvnField.style.display = 'none';
        labelBVN.style.display = 'none';
      }else{
        bvnField.style.display = 'block';
        labelBVN.style.display = 'block';
      }

      // Display identity fields if account type is Tier three
      if(select === 'Tier Three'){
        idTypeSpan.classList.remove('display_none');
        idNumberSpan.classList.remove('display_none');
      }else{
        idTypeSpan.classList.add('display_none');
        idNumberSpan.classList.add('display_none');
      }

      // Set #accType to whatever is been selected.
      this.#accType = select;
    })

    btnRegister.addEventListener('click', (e)=>{
      e.preventDefault();
      // Get the value for all input fields
      let fullName = fullNameField.value;
      let mobile = mobileField.value;
      let userName = userNameField.value;
      let amount = Number(amountField.value)//Value Converted to number;;
      let password = passwordField.value;
      let bvn, idenType, idenNumber;

      // No BVN for Tier One acount
      this.#accType === 'Tier One' ? bvn = null : bvn = bvnField.value;

      // Set identity type and number for Tier Three
      if(this.#accType === 'Tier Three'){
        idenType = idTypeField.value;
        idenNumber = idNumberField.value
      }

      // Check if amount match the minimum amount for each account type.

      if(this.#accType === 'Tier One' && amount !== 1000){
        Swal.fire({
          title : "Error",
          text : "Minimum amount for Tier One is 1000",
          icon : 'error',
        })

        return;
      }

      if( this.#accType === 'Tier Two' && amount !== 5000){
        Swal.fire({
          title : "Error",
          text : "Minimum amount for Tier Two is 5000",
          icon : 'error',
        })
        return;
      }

      if(this.#accType === 'Tier Three' && amount !== 20000){
        Swal.fire({
          title : "Error",
          text : "Minimum amount for Tier Three is 20000",
          icon : 'error',
        })
      }

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
            idenType,
            idenNumber,
            userName,
            mobile,
          }
  
          this.setItem()
          // Clear input fields
          fullNameField.value = mobileField.value =
          userNameField.value = amountField.value = passwordField.value = bvnField.value = "";
  
          modal.hideModal(signupModal);
  
          // After Successful Registration, Load Login Modal Automatically.
          Swal.fire({
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
        Swal.fire({
          title: "Error",
          text: "Username Alredy exist!",
          icon: 'error'
        })
      }else{
        // Check if no user at all or all field are filled

        if(this.accounts.length <= 0 && required || required){
          authUser();
          //console.log('User Auth');
        }else{
          // Sweet Alart here.
          Swal.fire({
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