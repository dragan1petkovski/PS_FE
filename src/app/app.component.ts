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
import { iStatusMessage,iStatus,StatusMessage } from './utility/iStatusMessage';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LoginComponent, RouterOutlet, RouterLink,NgIf,ReactiveFormsModule],
  providers: [JwtService]
})
export class AppComponent {
  flag: boolean = false
  RequestStatus: iStatusMessage = {status: "",statusMessage: ""}

  ChangePasswordFormGroup = new FormGroup({
    newpassword: new FormControl('',Validators.minLength(8)),
    oldpassword: new FormControl('',Validators.required),
    confirmpassword: new FormControl('',Validators.minLength(8)),
    verificationCode: new FormControl('',Validators.pattern("^[0-9]{8}$"))
  })

  constructor(private jwtService: JwtService, private router: Router, private connectionService: ConnectionService, private statusMessage: StatusMessage) {
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
      
      this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.POST(api_endpoints.changePassword,changePassword) as iStatus)
    }

  }

  async GetVerificationCode()
  {
    this.connectionService.GET(api_endpoints.verificationcode)
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
