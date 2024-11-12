import {  Injectable } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { Router  } from '@angular/router';
import { ConnectionService } from '../utility/connection.service';
import { api_endpoints } from '../StaticObjects/api_endpoints';


@Injectable({
    providedIn: "root",
})
export class AuthService{

    signInStatus: boolean = false
    constructor(private router: Router, private connectionService: ConnectionService )
    {
    }

    async SignIn(loginGroup: FormGroup)
    {
        return await this.connectionService.POSTLogin(api_endpoints.signin,{username: loginGroup.value.username, password: loginGroup.value.password}).then(response => {
            if(response.status === 401)
            {
                return null
            }
            else
            {
                return response.text()
            }
        })
    }
}