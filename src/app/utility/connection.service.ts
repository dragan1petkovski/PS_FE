import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';

@Injectable({
    providedIn: "root",
})

export class ConnectionService{

    constructor() {}
    async getItems(url: string)
    {
        try {
            let dataObj = await fetch(url)
            let jsonData =  await dataObj.json()
            return jsonData
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
            cache: "no-cache",
            headers: {
                "Content-Type":"application/json"
            },
            // redirect: "follow",
            // referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });
        return response.json()
    }
    
    async deleteItem(url: string)
    {
        let response = await fetch(url, {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type":"application/json"
            }
        });
        return response.json()
    }
}