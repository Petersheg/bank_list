//import Swal from '../node_modules/sweetalert2/src/sweetalert2.js';

//import Swal from "sweetalert2";

const loginModal = document.querySelector('.login_modal');
const signupModal = document.querySelector('.signup_modal');
const overlay = document.querySelector('.overlay');
const loginCloseModal = document.querySelector('.login_btn--close-modal');
const signupCloseModal = document.querySelector('.signup_btn--close-modal');

//BTNs
const btnLoginOpenModal = document.querySelector('.open_login-modal');
const btnSignupOpenModal = document.querySelector('.open_signup-modal');
const btnRegister = document.querySelector('.register_button'); //'.register_form'

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
const labelBVN = document.querySelector('.bvn_labell');
const idTypeSpan = document.querySelector('.id_type-span');
const idNumberSpan = document.querySelector('.id_number-span');

class Modal {
  constructor(btnSignupOpenModal, btnLoginOpenModal) {

    // Set Paramenter to Open Modal
    this.btnSignupOpenModal = btnSignupOpenModal;
    this.btnLoginOpenModal = btnLoginOpenModal;

    this._openModal(this.btnLoginOpenModal, loginModal);
    this._openModal(this.btnSignupOpenModal, signupModal);
    this._closeModal(loginCloseModal, loginModal);
    this._closeModal(signupCloseModal, signupModal);
  }

  // This method will show modal on button click
  showModal(modal = loginModal){
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  // This method invoke showModal method but it's a private method
  _openModal(btn = btnLoginOpenModal, modal) {
    btn.addEventListener('click', () => {
      this.showModal(modal);
    });
  }

  // Method to hide modal.
  hideModal(modal = loginModal) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  }

  _closeModal(btn, modal) {
    // Add event listener to the btn passed in
    btn.addEventListener('click', () => {
      this.hideModal(modal);
    });

    // Add evebt listener to overlay to close modal
    overlay.addEventListener('click', () => {
      this.hideModal(modal);
    });
  }
}

export { Modal };
