import {Html} from '../html';

const html = new Html;

export default function logout() {
    
    html.containerApp.style.opacity = 0;
    html.btnLogOut.classList.add('hidden');
    html.btnLoginOpenModal.classList.remove('hidden');
    html.btnSignupOpenModal.classList.remove('hidden');

    // reload the page
    location.reload();
}