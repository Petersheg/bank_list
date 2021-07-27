import {Html,UI} from "../html.js";
import Swal from "sweetalert2";
import Store from '../store.js';

const html = new Html;
const ui = new UI;
const store = new Store;
allUsers = store.getAllUsers();

export function login(userName,userPin){

    let currentUser = store.getCurrentUser(allUsers,html.inputLoginUsername.value);

    // Log User in if credentials are correct! else display error message.
    // const loginDetails = this.currentUser?.userPin === html.inputLoginPin.value &&
    //               this.currentUser?.userName == html.inputLoginUsername.value;
    const loginDetails = 
                currentUser?.userPin === userPin &&
                currentUser?.userName == userName;
    
    if (loginDetails) {
      //   Log User Information
      ui.logUserInfo(currentUser);//Amend this
      // display Logout button after user login
      ui.disPlayLogoutBtn();
      // update UI
      ui.updateUI(currentUser);

    } else {
      // Sweet Alart here.
      Swal.fire('Warning', 'Wrong Log in details', 'error');
    }
    console.log(allUsers);
    return currentUser;
}