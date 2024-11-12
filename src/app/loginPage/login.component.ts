import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthService } from './login.service';
import { Router  } from '@angular/router';
import { JwtService } from '../utility/jwt.service';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: 'login.component.html',
    imports: [ReactiveFormsModule],
    providers: [AuthService, JwtService]
  })
  export class LoginComponent {
    loginGroup = new FormGroup({
        username: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        password: new FormControl('',[Validators.required])
    })

    loginStatusFailure: string = ""

    constructor(private authService: AuthService, private router: Router, private jwtService: JwtService) {}
    
    ngOnInit()
    {
      let body = document.getElementById("body")
      if(body?.getAttribute("style") != null)
      {
        body.removeAttribute("style")
      }
      
    }

    async SignIn()
    {
        let token = await this.authService.SignIn(this.loginGroup)
        if(token != undefined && token != null)
        {
          let role = this.jwtService.GetRole(token)
          sessionStorage.setItem("jwt",token)
          if(role === "Administrator")
          {

            this.router.navigate(['/admin'])
          }
          else if(role === "User")
          {

            this.router.navigate(['/home'])
          }
          else if(role == undefined)
          {
            this.loginStatusFailure = "Fail";
          }
          //
        }
        this.loginStatusFailure = "Fail";
    }
  }