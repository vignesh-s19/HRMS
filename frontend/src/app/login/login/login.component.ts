import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/user/shared/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!:FormGroup;
  apiEndpoint: string = environment.API;
  constructor(private router: Router,
    private formBuilder:FormBuilder,
    private http:HttpClient
    ) {}

  ngOnInit():void {
    this.loginForm=this.formBuilder.group({
      userName:[''],
      password:['']
    })
  }

  onLogin() {
    this.http.get<User[]>(`${this.apiEndpoint}/users`)
    .subscribe(res=>{
      const user=res.find((a:any)=>{
        return a.fullName === this.loginForm.value.userName && a.password === this.loginForm.value.password
      });
      if(user){
        alert("Login success!");

        localStorage.setItem("currentUser",JSON.stringify(user));
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      }else{
        alert("user not found")
      }
    })
    
  }
}
