import {Helper} from '../helper/helperfunc';
import {Html} from '../html';
import UI from '../ui.js';
import allUsers,{ currentUser } from '../user';
import Swal from 'sweetalert2';
import Store from '../store';

const html = new Html;
const helperFunc = new Helper;
const ui = new UI;
const store = new Store;

export default function transfer(transferAmount,receiverAcc) {

    let transactionOTP = helperFunc.generateOTP();

    //find where receiver accountNo is equal to sender input;
    let receiverDetail = allUsers.map(user => user.acc).flat().find(acc => acc.accNumber === receiverAcc);
    
    console.log(receiverDetail);

    // check if currentUser have enough money and if the receiver acc exist and if the transferAmount is possitive
    let currentUserAcc = currentUser.acc.find(acc => acc.mov);

    let transferCondition =
      currentUserAcc.accBalance >= transferAmount &&
      receiverAcc &&
      receiverAcc !== String(currentUserAcc.accNumber) &&
      transferAmount > 0;

    if (transferCondition && receiverDetail) {
      const total = receiverDetail?.mov.reduce((a, b) => a + b, 0);

      allUsers.forEach(user => {

        if (user.userFullName === currentUser.userFullName) {

          // Check for Maximum balance for each account type
          let maxBalanceCheck =
            (receiverDetail.accType === 'Tier One' &&
              total + transferAmount <= 100000) ||
            (receiverDetail.accType === 'Tier Two' &&
              total + transferAmount <= 1000000) ||
            (receiverDetail.accType === 'Tier Three' &&
              total + transferAmount <= 5000000);

          if (maxBalanceCheck && transactionOTP) {

            // Prompt User to Supply OTP
            Swal.fire({
              title: 'supply OTP',
              text: `input this OTP code (${transactionOTP}) to conplete this transaction`,
              icon: 'info',
              input: 'text',
            }).then(fulfiled => {

              if (fulfiled.isConfirmed && fulfiled.value === transactionOTP) {

                // Generate time and date and push it to movementsDate
                const dateAndTime = helperFunc.timeStamp();

                currentUserAcc.movementsDate.push(dateAndTime);
                receiverDetail.movementsDate.push(dateAndTime);

                // Debit the sender
                currentUserAcc.mov.push(-transferAmount);
                // Credit the Receiver
                receiverDetail.mov.push(transferAmount);


                store.saveAllUsers(allUsers);
                console.log(allUsers);
                console.log(currentUserAcc);
                // update UI
                ui.updateUI(currentUser);
                // clearField
                html.inputTransferAmount.value = '';
                html.inputTransferTo.value = '';
                transferAmount.blur;
                // Toast a successful message
                ui.toast('success', 'Transfer Successful');
              } else {
                ui.toast('error', 'Wrong OTP');
              }
            });
          } else {
            Swal.fire({
              title: 'Warning',
              text: 'Maximum amount for the receiver exceeded',
              icon: 'error',
            });
          }
        }
      });

    } else {
      // Sweet Alert here
      Swal.fire('Warning', 'Wrong Receiver info.', 'error');
    }
}