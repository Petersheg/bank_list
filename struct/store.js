export default class Store{
  
    currentUser;
    alluser = JSON.parse(localStorage.getItem('UserData'))||[];

    saveUser(user){
      this.alluser.push(user);
      localStorage.setItem('UserData', JSON.stringify(this.alluser));
    }

    saveAllUsers(users){
      localStorage.setItem('UserData', JSON.stringify(users))
    }

    getAllUsers(){
      return JSON.parse(localStorage.getItem('UserData')) || [];
    }

    getCurrentUser(allUsers,userName){
    
      this.currentUser = allUsers.find(user =>{
        return user.userName === userName;
      })
      return this.currentUser;
    }
    

};