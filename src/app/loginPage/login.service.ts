import {  Injectable } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { Router  } from '@angular/router';
import { ConnectionService } from '../utility/connection.service';
import { iUser } from '../interfaces/user';


@Injectable({
    providedIn: "root",
})
export class AuthService{

    constructor(private router: Router, private connectionService: ConnectionService )
    {
    }

    async DummyLogin(loginGroup: FormGroup)
    {
        let users: iUser[]
        let usersObj = await this.connectionService.getItems("/api/userDB.json")
        users = usersObj as iUser[]

        if(users.find(user => user.username === loginGroup.value.username.toLowerCase() && user.password === loginGroup.value.password) != undefined)
            {
                this.router.navigate(["/home"])
            }
        else
        {
            console.error("Login failed")
        }
        
    }
}