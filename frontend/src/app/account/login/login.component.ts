import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/core/authentication/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  apiEndpoint: string = environment.API;
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      userName: [""],
      password: [""],
    });
  }

  onLogin() {
    this._authService.login();
  }
}
