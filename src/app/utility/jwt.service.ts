import {  Injectable } from '@angular/core';
import { ClaimType } from '../StaticObjects/ClaimType';

@Injectable({
    providedIn: "root",
})

export class JwtService
{
    constructor() {}
    GetRole(jwtToken:string)
    {
        let jwtTokenList = jwtToken.split(".")
        if(jwtTokenList.length === 3)
        {
            let jwtDecodedPayload = JSON.parse(atob(jwtTokenList[1]))
            if(jwtDecodedPayload.hasOwnProperty(ClaimType.role))
            {
                return jwtDecodedPayload[ClaimType.role]
            }
            return undefined
        }
        return undefined
    }

    GetUserId(jwtToken:string)
    {
        let jwtTokenList = jwtToken.split(".")
        if(jwtTokenList.length === 3)
        {
            let jwtDecodedPayload = JSON.parse(atob(jwtTokenList[1]))
            if(jwtDecodedPayload.hasOwnProperty(ClaimType.userid))
            {
                return jwtDecodedPayload[ClaimType.userid]
            }
            return undefined
        }
        return undefined
    }

    HasRole(jwtToken:string)
    {
        let jwtTokenList = jwtToken.split(".")
        if(jwtTokenList.length === 3)
        {
            let jwtDecodedPayload = JSON.parse(atob(jwtTokenList[1]))
            if(jwtDecodedPayload.hasOwnProperty(ClaimType.role))
            {
                return jwtDecodedPayload[ClaimType.role] != null? true : false
            }
            return undefined
        }
        return undefined
    }

    GetJwtPayloadItem(jwtToken:string,item: string)
    {
        let jwtTokenList = jwtToken.split(".")
        if(jwtTokenList.length === 3)
        {
            let jwtDecodedPayload = JSON.parse(atob(jwtTokenList[1]))
            if(jwtDecodedPayload.hasOwnProperty(item))
            {
                return jwtDecodedPayload[item]
            }
            return undefined
        }
        return undefined
    }

}