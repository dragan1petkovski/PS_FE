import { Injectable } from "@angular/core";

export interface iStatusMessage
{
    status: string,
    statusMessage: string
}

export interface iStatus
{
    status: string,
    statusMessage: Promise<any>|string
}

@Injectable(
    {
        providedIn: "any"
    }
)
export class StatusMessage
{

    async GetResponse(status: iStatus)
    {
        if(typeof status.statusMessage === 'string')
        {
            let statusMessage: iStatusMessage = {status: status.status, statusMessage: status.statusMessage}
            return statusMessage
        }
        else
        {
            let statusMessage: iStatusMessage = {status: status.status, statusMessage: (await status.statusMessage).message}
            return statusMessage           
        }

    }
    
}