import { Component,Input } from '@angular/core';
import { LoginComponent } from './loginPage/login.component';
import { RouterLink, RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { JwtService } from './utility/jwt.service';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule, FormControl, FormGroup} from '@angular/forms';
import { iChangePassword } from './interfaces/ChangePassword';
import { ConnectionService } from './utility/connection.service';
import { api_endpoints } from './StaticObjects/api_endpoints';
import { iPostRequestStatus } from './interfaces/PostRequestStatus';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LoginComponent, RouterOutlet, RouterLink,NgIf,ReactiveFormsModule],
  providers: [JwtService]
})
export class AppComponent {
  flag: boolean = false
  responseStatus: string = ""

  ChangePasswordFormGroup = new FormGroup({
    newpassword: new FormControl('',Validators.minLength(8)),
    oldpassword: new FormControl('',Validators.required),
    confirmpassword: new FormControl('',Validators.minLength(8)),
    verificationCode: new FormControl('',Validators.pattern("^[0-9]{8}$"))
  })

  constructor(private jwtService: JwtService, private router: Router, private connectionService: ConnectionService) {
    router.events.subscribe((event: Event) => {
      
      if(event instanceof NavigationEnd)
      {
        if(event.url !== "/")
        {
          this.flag = this.jwtService.HasRole(sessionStorage.getItem("jwt")||"") || false
        }
        else
        {
          this.flag = false
        }
      }
    })
  }

  
  ngOnInit()
  {
    this.flag = false
  }

  async ChangePassword()
  {
    let _currentPassword = this.ChangePasswordFormGroup.value.oldpassword
    let _newPassword = this.ChangePasswordFormGroup.value.newpassword
    let _confirmPassword = this.ChangePasswordFormGroup.value.confirmpassword
    let _verificationCode = this.ChangePasswordFormGroup.value.verificationCode
    if(_newPassword === _confirmPassword)
    {
      let changePassword: iChangePassword = {oldPassword: _currentPassword||"", newPassword: _newPassword||"", confirmPassword: _confirmPassword||"", verificationcode: _verificationCode||"0"}
      
      console.log(changePassword)
      let status = (await this.connectionService.postItem(api_endpoints.ChangePassword,changePassword)) as iPostRequestStatus
      this.responseStatus = status.status;
    }

  }

  async GetVerificationCode()
  {
    this.connectionService.getItems(api_endpoints.GetVerificationCode)
  }

  SignOut()
  {
    sessionStorage.removeItem("jwt")
    this.router.navigate(["/"])
  }

  async ShowModal()
  {
    ($(`#ChangePassword`) as any).modal('show');
  }
}
