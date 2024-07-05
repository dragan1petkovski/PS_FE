import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from './login.service';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: 'login.component.html',
    imports: [ReactiveFormsModule],
    providers: [AuthService]
  })
  export class LoginComponent {
    loginGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    })
    constructor(private authService: AuthService) {}

    ngOnInit()
    {
      let body = document.getElementById("body")
      if(body?.getAttribute("style") != null)
      {
        body.removeAttribute("style")
      }
      
    }

    TestLogin()
    {
        this.authService.DummyLogin(this.loginGroup)
    }
  }