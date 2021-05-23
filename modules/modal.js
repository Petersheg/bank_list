const loginModal = document.querySelector('.login_modal');
const signupModal = document.querySelector('.signup_modal');
const overlay = document.querySelector('.overlay');
const loginCloseModal = document.querySelector('.login_btn--close-modal');
const signupCloseModal = document.querySelector('.signup_btn--close-modal');


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