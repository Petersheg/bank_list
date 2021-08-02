export class Html{
    //export test = 'Just testing';
    containerApp = document.querySelector('.app');
    containerMovements = document.querySelector('.movements');

    btnLogin = document.querySelector('.login__btn');
    btnTransfer = document.querySelector('.form__btn--transfer');
    btnLoan = document.querySelector('.form__btn--loan');
    btnClose = document.querySelector('.form__btn--close');
    btnSort = document.querySelector('.btn--sort');
    btnLoginOpenModal = document.querySelector('.open_login-modal');
    btnSignupOpenModal = document.querySelector('.open_signup-modal');
    btnLogOut = document.querySelector('.logout');

    inputLoginUsername = document.querySelector('.login__input--user');
    inputLoginPin = document.querySelector('.login__input--pin');
    inputTransferTo = document.querySelector('.form__input--to');
    inputTransferAmount = document.querySelector('.form__input--amount');

    inputLoanAmount = document.querySelector('.form__input--loan-amount');
    inputCloseUsername = document.querySelector('.form__input--user');
    inputClosePin = document.querySelector('.form__input--pin');

    labelWelcome = document.querySelector('.welcome');
    labelBVN = document.querySelector('.bvn_label');
    labelACC = document.querySelector('.acc_label');
    labelAccType = document.querySelector('.acc-type_label');

    // Elements
    labelBalance = document.querySelector('.balance__value');
    labelSumIn = document.querySelector('.summary__value--in');
    labelSumOut = document.querySelector('.summary__value--out');
    labelSumInterest = document.querySelector('.summary__value--interest');
    labelTimer = document.querySelector('.timer');
    labelDate = document.querySelector('.date');

    loginModal = document.querySelector('.login_modal');
    signupModal = document.querySelector('.signup_modal');
    overlay = document.querySelector('.overlay');
    loginCloseModal = document.querySelector('.login_btn--close-modal');
    signupCloseModal = document.querySelector('.signup_btn--close-modal');

    //BTNs
    btnLoginOpenModal = document.querySelector('.open_login-modal');
    btnSignupOpenModal = document.querySelector('.open_signup-modal');//Duplicate
    btnRegister = document.querySelector('.register_button'); //'.register_form'

    // input fields
    fullNameField = document.querySelector('.fullname');
    mobileField = document.querySelector('.mobile');
    userNameField = document.querySelector('.user_name');
    amountField = document.querySelector('.amount');
    passwordField = document.querySelector('.password');
    bvnField = document.querySelector('.bvn');
    accountTypeField = document.querySelector('#account_type');
    idTypeField = document.querySelector('.id_type');
    idNumberField = document.querySelector('.id_number');

    // Others
    labelBVN = document.querySelector('.bvn_labell');
    idTypeSpan = document.querySelector('.id_type-span');
    idNumberSpan = document.querySelector('.id_number-span');
};