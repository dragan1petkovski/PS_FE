import {  Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteItem } from '../interfaces/Services/DeleteItem';

@Injectable({
    providedIn: "root",
})

export class ConnectionService{

    route: Router
    constructor() {
        this.route = inject(Router)
    }

    async getItems(url: string)
    {
        try {
            let dataObj = await fetch(url,
                {
                    
                    headers: {
                        "Content-Type":"application/json",
                        "Cache-Control":"no-store",
                        "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
                    }
                }).then(resolve => {
                if(resolve.status === 401)
                {
                    sessionStorage.removeItem("jwt")
                    this.route.navigate(["/"])
                    return null
                }
                else
                {
                    return resolve.json()
                }
            })
            return dataObj
        }
        catch(error) {
            console.error(error)
            console.error(`Server is not accessible - ${url}`)
        }
        
    }

    async postItem(url: string, data: any)
    {

        let response = await fetch(url, {
            method: "POST",
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
                return null;
            }
            else if(response.status === 403)
            {
                return null;
            }
            else
            {
                return response.json()
            }
        }
        );
        return response
    }
    
    async PostSignIn(url: string, data: any)
    {
        return  fetch(url, {
            method: "POST",
            mode: "cors",
            //cache: "no-store",
            headers: {
                "Content-Type":"application/json",
                "Cache-Control":"no-store"
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        })
    }

    async postUploadCertificate(url: string, data: any)
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
                return null;
            }
            else if(response.status === 403)
            {
                return null;
            }
            else
            {
                return response.json()
            }
        }
        );
        return response
    }

    async DeleteItem(url: string,deleteitem: any)
    {
        let response = await fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type":"application/json",
                "Cache-Control":"no-store",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            },
            body: JSON.stringify(deleteitem)
        }).then(response => {
            if(response.status === 401)
            {
                sessionStorage.removeItem("jwt")
                this.route.navigate(["/"])
                return null;
            }
            else if(response.status === 403)
            {
                return null;
            }
            else
            {
                return response.json()
            }
        }
        );
        return response
    }

    async DeleteURL(url: string)
    {
        let response = await fetch(url, {
            method: "DELETE",
            mode: "cors",
            headers: {
                "Content-Type":"application/json",
                "Cache-Control":"no-store",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            }
        }).then(response => {
            if(response.status === 401)
            {
                sessionStorage.removeItem("jwt")
                this.route.navigate(["/"])
                return null;
            }
            else if(response.status === 403)
            {
                return null;
            }
            else
            {
                return response.json()
            }
        }
        );
        return response
    }
}