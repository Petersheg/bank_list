import {Html} from "../html.js";
import UI from "../ui.js";
import Swal from "sweetalert2";
import Store from '../store.js';
import allUsers from '../user';

const html = new Html;
const ui = new UI;
const store = new Store;

export function login(userName,userPin){

    let currentUser = store.getCurrentUser(allUsers,html.inputLoginUsername.value);

    const loginDetails = 
                currentUser?.userPin === userPin &&
                currentUser?.userName == userName;
    
    if (loginDetails) {
      //   Log User Information
      ui.logUserInfo(currentUser);
      // display Logout button after user login
      ui.disPlayLogoutBtn();
      // update UI
      ui.updateUI(currentUser);

    } else {
      // Sweet Alart here.
      Swal.fire('Warning', 'Wrong Log in details', 'error');
    }
    store.saveAllUsers(allUsers);
    //console.log(allUsers);
    return currentUser;
}