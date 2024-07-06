import { Component,Input } from "@angular/core";
import { NgFor,NgIf } from "@angular/common";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { ConnectionService } from "../../utility/connection.service";
import { iPassword } from "../../interfaces/password";
import {ClipboardModule} from '@angular/cdk/clipboard'
import { api_endpoints, session_id } from '../../api_endpoints'

@Component({
    selector: 'workAreaBody',
    templateUrl: './workAreaBody.component.html',
    standalone: true,
    imports: [NgFor,NgIf,ClipboardModule]
    
})
export class WorkAreaBody {
    @Input() items: any;
    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}

    deleteModalName: string = ""
    private deleteItemURL: string = ""
    responseStatus: string = ""


    constructor(private connectionService: ConnectionService) {}
    async ShowPassword(type:string, id: string)
    {
        const eye = document.getElementById(`${id}-eye`)
        if(eye != null)
        {
            if(eye.getAttribute("type") === "cred")
            {
                if(eye.className === "bi bi-eye-slash")
                    {
                        this.HidePasswordString(id)
                        eye.className = "bi bi-eye"
                    }
                    else if(eye.className === "bi bi-eye")
                    {
                        this.ShowPasswordString(type,id)
                        eye.className = "bi bi-eye-slash"
                        this.ShowpasswordTimer(eye,id)
                    }
            }
            else if(eye.getAttribute("type") === "cert")
            {
                if(eye.className === "bi bi-eye-slash")
                    {
                        this.HidePasswordString(id)
                        eye.className = "bi bi-eye"
                    }
                    else if(eye.className === "bi bi-eye")
                    {
                        this.ShowPasswordString(type,id)
                        eye.className = "bi bi-eye-slash"
                        this.ShowpasswordTimer(eye,id)
                    }
            }

        }       
    }

    HidePasswordString(id: string)
    {
        let passwordElement = document.getElementById(id)
        if( passwordElement != undefined)
            {
                passwordElement.innerText = ""
            }
       
    }
    async ShowPasswordString(type: string, id: string)
    {
        
        if(type === 'cert')
        {
            let t = await this.GetCertificatePasswordById(id)
            let element = document.getElementById(id)
            if(element != undefined)
                {
                    element.innerText = t
                }
        }
        else if(type === 'cred')
        {
            let t = await this.GetCredentialPasswordById(id)
            let element = document.getElementById(id)
            if(element != undefined)
                {
                    element.innerText = t
                }
        }


    }

    async GetCredentialPasswordById(id:string) {
       const password = await this.connectionService.getItems(api_endpoints.GetCredentialPasswordById.concat(id))
       return password.password
    }

    async GetCertificatePasswordById(id:string) {
        const password = await this.connectionService.getItems(api_endpoints.GetCertificatePasswordById.concat(id))
        return password.password
     }

    async ShowpasswordTimer(element:HTMLElement, id: string)
    {
        new Promise(() => setTimeout(() => {
            this.HidePasswordString(id)
            element.className = "bi bi-eye"
            
        }
            ,10000))
    }

    async CopyPassword(type:string, id:string)
    {
        if(type === "cert")
        {
            const password = await this.GetCertificatePasswordById(id)
            navigator.clipboard.writeText(password.trim()) 
        }
        else if(type === "cred")
        {
            const password = await this.GetCredentialPasswordById(id)
            navigator.clipboard.writeText(password.trim()) 
        }
  
    }

    DeleteCredentialLink(teamid:string,credentialid:string)
    {
        return api_endpoints.deleteCredential.concat(session_id,"/",teamid,"/",credentialid)
    }

    async DeleteCredential()
    {
        this.responseStatus = (await this.connectionService.deleteItem(this.deleteItemURL)).status 
    }

    OpenDeleteCredentialModal(modalid: string,credentialid: string, username: string, domain: string, teamid: string)
    {
        this.deleteModalName = domain+"\\"+username;
        ($(`#${modalid}`) as any).modal('show');
        this.deleteItemURL =  this.DeleteCredentialLink(teamid,credentialid)
    }

}