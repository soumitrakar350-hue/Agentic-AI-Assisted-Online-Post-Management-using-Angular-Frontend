import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import UserModel from './UserMode';
import { UserService } from '../user-service';
import User from './User';
import { R3SelectorScopeMode } from '@angular/compiler';

@Component({
  imports: [FormsModule],
  selector: 'app-users',
  styleUrl: './users.css',
  templateUrl: './users.html',
})
export class Users {
    private userService = inject(UserService);
    public myUser = new UserModel("","","","","");
    public loginUser = new UserModel("","","","","");
    onSignup(event:SubmitEvent){
    event.preventDefault();
    console.log(this.myUser);
    let dataToSubmit = {
      name : this.myUser.firstName+" "+this.myUser.lastName,
      email: this.myUser.email,
      pass1: this.myUser.pass1
    };
    console.log(dataToSubmit);
    this.userService.addUser(dataToSubmit)
    .subscribe((res:User)=>{
       if(!res) alert("Unable to Add new User");
       else {
        alert("User Successfully signup");
       }
    })
   }

   onLogin(event:SubmitEvent){
       event.preventDefault();
       console.log(this.loginUser);
       this.userService.loginUser(this.loginUser.email,this.loginUser.pass1)
       .subscribe((res:User[])=>{
            console.log(res[0]);
            
            if(!res[0]){
              alert("Invalid Username or Password \n Try again");
            }else{
                //we will save some information to localStorage.
                localStorage.setItem("USER-ID",res[0].id);
                localStorage.setItem("NAME",res[0].name);
                alert("Login Successfull");
                //redirect to /posts
                window.location.href='/posts';
            }
       })
   }
}
