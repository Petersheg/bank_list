import {Html} from './html';
const html = new Html;

class Modal {

  constructor(btnSignupOpenModal, btnLoginOpenModal) {

    // Set Paramenter to Open Modal
    this.btnSignupOpenModal = btnSignupOpenModal;
    this.btnLoginOpenModal = btnLoginOpenModal;

    this._openModal(this.btnLoginOpenModal, html.loginModal);
    this._openModal(this.btnSignupOpenModal, html.signupModal);
    this._closeModal(html.loginCloseModal, html.loginModal);
    this._closeModal(html.signupCloseModal, html.signupModal);
  }

  //This method will show modal on button click
  showModal(modal = html.loginModal){
    modal.classList.remove('hidden');
    html.overlay.classList.remove('hidden');
  }

  // This method invoke showModal method but it's a private method
  _openModal(btn =html.btnLoginOpenModal, modal) {
    btn.addEventListener('click', () => {
      this.showModal(modal);
    });
  }

  // Method to hide modal.
  hideModal(modal =html.loginModal) {
    modal.classList.add('hidden');
    html.overlay.classList.add('hidden');
  }

  _closeModal(btn, modal) {
    // Add event listener to the btn passed in
    btn.addEventListener('click', () => {
      this.hideModal(modal);
    });

    // Add evebt listener to overlay to close modal
    html.overlay.addEventListener('click', () => {
      this.hideModal(modal);
    });
  }
  
}

export { Modal };