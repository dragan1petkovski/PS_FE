import {  Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { iStatusMessage } from './iStatusMessage';
import { StatusMessages } from '../StaticObjects/StatusMessages';

@Injectable({
    providedIn: "root",
})

export class ConnectionService{

    route: Router
    constructor() {
        this.route = inject(Router)
    }

    async GET(url: string)
    {
        try {
            let dataObj = await fetch(url,
                {
                    
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
                    }
                }).then(response => {
                if(response.status === 401)
                {
                    sessionStorage.removeItem("jwt")
                    this.route.navigate(["/"])
                    return {status: "NOTOK", statusMessage: response.json()}
                }
                else if(response.status === 403)
                {
                    return {status: "NOTOK", statusMessage: response.json()}
                }
                else if(response.status === 200)
                {
                    return response.json()
                }
                else
                {
                    return {status: "NOTOK", statusMessage: response.json()}
                }
            })
            return dataObj
        }
        catch(error) {
            console.error(error)
            console.error(`Server is not accessible - ${url}`)
        }
        
    }

    async POST(url: string, data: any)
    {

        let response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        }).then(response => {
            if(response.status === 401)
            {
                sessionStorage.removeItem("jwt")
                this.route.navigate(["/"])
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 403)
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 201)
            {
                return {status: "OK", statusMessage: response.json()}
            }
            else if(response.status === 200)
            {
                return {status: "OK", statusMessage: response.json()}
            }
            else
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
        }
        );
        return response
    }
    
    async POSTLogin(url: string, data: any)
    {
        return  fetch(url, {
            method: "POST",
            mode: "cors",
            //cache: "no-store",
            headers: {
                "Content-Type":"application/json",
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        })
    }

    async POSTUpload(url: string, data: any)
    {

        let response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Cache-Control":"no-store",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: data
        }).then(response => {
            if(response.status === 401)
            {
                sessionStorage.removeItem("jwt")
                this.route.navigate(["/"])
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 403)
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 201)
            {
                return {status: "OK", statusMessage: response.json()}
            }
            else
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
        }
        );
        return response
    }

    async PUT(url: string, data: any)
    {

        let response = await fetch(url, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type":"application/json",
                "Cache-Control":"no-store",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        }).then(response => {
            if(response.status === 401)
            {
                sessionStorage.removeItem("jwt")
                this.route.navigate(["/"])
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 403)
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 200)
            {
                return {status: "OK", statusMessage: response.json()}
            }
            else
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
        }
        );
        return response
    }

    async DELETE(url: string)
    {
        let response = await fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            }
        }).then(response => {
            if(response.status === 401)
            {
                sessionStorage.removeItem("jwt")
                this.route.navigate(["/"])
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status === 403)
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
            else if(response.status == 204)
            {

                if(url.toLowerCase().includes("client"))
                {
                    return {status: "OK", statusMessage: StatusMessages.DeleteClient.GetMessage()}
                }
                else if(url.toLowerCase().includes("team"))
                {
                    return {status: "OK", statusMessage: StatusMessages.DeleteTeam.GetMessage()}
                }
                else if(url.toLowerCase().includes("user"))
                {
                    return {status: "OK", statusMessage: StatusMessages.DeleteUser.GetMessage()}
                }
                else if(url.toLowerCase().includes("credential"))
                {
                    return {status: "OK", statusMessage: StatusMessages.DeleteCredential.GetMessage()}
                }
                else if(url.toLowerCase().includes("certificate"))
                {
                    return {status: "OK", statusMessage: StatusMessages.DeleteCertificate.GetMessage()}
                }
                else if(url.toLowerCase().includes("personalfolder"))
                {
                    return {status: "OK", statusMessage: StatusMessages.DeletePersonalFolder.GetMessage()}
                }
                else
                {
                    return {status: "OK", statusMessage: "Item is successfully deleted"}
                }
            }
            else
            {
                return {status: "NOTOK", statusMessage: response.json()}
            }
        }
        );
        return response
    }
}