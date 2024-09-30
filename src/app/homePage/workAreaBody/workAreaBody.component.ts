import { Component,Input,inject } from "@angular/core";
import { NgFor,NgIf,CommonModule } from "@angular/common";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { ConnectionService } from "../../utility/connection.service";
import { ClipboardModule } from '@angular/cdk/clipboard'
import { api_endpoints } from '../../StaticObjects/api_endpoints'
import { JwtService } from "../../utility/jwt.service";
import { iDeleteCredential,iGetCredential,iGetPersonalCredentials,iPostUpdateCredential,iDeletePersonalCredential,iPostUpdatePersonalCredential } from "../../interfaces/Credential/credential";
import { iDeleteCertificate,iGetCertificate } from "../../interfaces/Certificate/certificate"
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormsModule} from '@angular/forms';
import { ValidationMessages } from "../../ValidationMessages";
import { iPostRequestStatus} from "../../interfaces/PostRequestStatus"
import { iGetPasswordString } from "../../interfaces/Password/password"
import { iPersonalFolder } from "../../interfaces/DTOModel/PersonalFolderDTO";

@Component({
    selector: 'workAreaBody',
    templateUrl: './workAreaBody.component.html',
    standalone: true,
    imports: [NgFor,NgIf,ClipboardModule,CommonModule,ReactiveFormsModule],
    
})
export class WorkAreaBody extends ValidationMessages {
    @Input() certificates: iGetCertificate[] = [];
    @Input() credentials: iGetCredential[] = []
    @Input() personalcredentials: iGetPersonalCredentials[]=[]

    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
    
    deleteModalName: string = ""
    responseStatus: iPostRequestStatus = {status: "", errorMessage: ""}
    deleteCertificateItem: iDeleteCertificate = {teamid: "", id:""}
    deleteCredentialItem: iDeleteCredential = {teamid: "", id:""}
    deletePersonalItem: iDeletePersonalCredential = {id: "", personalfolderid: null}
    deleteType: string = ""
    updateCredential: iGetCredential = {domain:"",username:"",email:"",id:"",note:"",remote:"",password:"",teamid:"",teamname:""}
    updatePersonalCredential: iGetPersonalCredentials = {domain:"",username:"",email:"",id:"",note:"",remote:"",password:"",personalfolderid:""}
    personalFolderList: iPersonalFolder[] = []

    updateCredentialForm = new FormGroup({
        id: new FormControl(""),
        username: new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        domain: new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        email: new FormControl("",[Validators.email]),
        password: new FormControl(""),
        remote: new FormControl(""),
        note: new FormControl("")
    })

    updatePersonalCredentialForm = new FormGroup({
        id: new FormControl(""),
        username: new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        domain: new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        email: new FormControl("",[Validators.email]),
        personalFolderId: new FormControl(""),
        originalpersonalFolderId: new FormControl(""),
        password: new FormControl(""),
        remote: new FormControl(""),
        note: new FormControl("")
    })

    constructor(private connectionService: ConnectionService, private jwtService: JwtService) {
        super();
     }
    ShowPassword(type:string, id: string, teamid?:string)
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
                        this.ShowPasswordString(type, id, teamid)
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
                        this.ShowPasswordString(type,id, teamid)
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

    async ShowPasswordString(type: string, id: string,parentid?: string)
    {
        switch(type)
        {
            case "cert":
                let cert = document.getElementById(id)
                cert != undefined? cert.innerText = await this.GetCertificatePasswordById(id,parentid): null
                break;
            case "cred":
                let cred = document.getElementById(id)
                cred != undefined ? cred.innerText = await this.GetCredentialPasswordById(id,parentid): null
                break;
            case "personalCred":
                let personalcred = document.getElementById(id)
                personalcred != undefined ? personalcred.innerText = await this.GetPersonalCredentialPasswordById(id,parentid): null
                break;
            default:
                break;
        }
    }

    async GetCredentialPasswordById(id:string, teamid?:string) {
        
        let postpasswordRequest:iGetPasswordString ={parentid: '',id: ''}
        if(teamid != null && teamid != undefined)
        {
            postpasswordRequest.id = id
            postpasswordRequest.parentid = teamid
        }
        const password = await this.connectionService.postItem(api_endpoints.GetCredentialPasswordById,postpasswordRequest)
        return password.password
    }

    async GetCertificatePasswordById(id:string, teamid?:string) {
        let postpasswordRequest:iGetPasswordString ={parentid: '',id: ''}
        if(teamid != null && teamid != undefined)
        {

            postpasswordRequest.id = id
            postpasswordRequest.parentid = teamid
        }
        const password = await this.connectionService.postItem(api_endpoints.GetCertificatePasswordById,postpasswordRequest)
        return password.password
     }

    async GetPersonalCredentialPasswordById(id: string, personalFolder?: string)
    {
        let postpasswordRequest: iGetPasswordString = {parentid: null,id: ""}
        if(personalFolder != null && personalFolder != undefined)
        {
            postpasswordRequest.id = id
            postpasswordRequest.parentid = personalFolder
            const password = await this.connectionService.postItem(api_endpoints.GetPersonalPasswordById,postpasswordRequest)
            return password.password
        }
        else
        {
            postpasswordRequest.id = id
            const password = await this.connectionService.postItem(api_endpoints.GetPersonalPasswordById,postpasswordRequest)
            return password.password
        }
    }

    async ShowpasswordTimer(element:HTMLElement, id: string)
    {
        new Promise(() => setTimeout(() => {
            this.HidePasswordString(id)
            element.className = "bi bi-eye"
            
        }
            ,10000))
    }

    async OpenUpdateCredentialModal(modalid: string, credid: string)
    {

        this.updateCredential = await this.connectionService.getItems(api_endpoints.GetCredentialById.concat(credid)).then(resolve => resolve as iGetCredential)
        this.updateCredentialForm.controls.id.setValue(this.updateCredential.id)
        this.updateCredentialForm.controls.domain.setValue(this.updateCredential.domain)
        this.updateCredentialForm.controls.username.setValue(this.updateCredential.username)
        this.updateCredentialForm.controls.email.setValue(this.updateCredential.email)
        this.updateCredentialForm.controls.remote.setValue(this.updateCredential.remote)
        this.updateCredentialForm.controls.note.setValue(this.updateCredential.note);
        ($(`#${modalid}`) as any).modal('show');
    }

    async OpenUpdatePersonalCredentialModal(modalid: string, personalFolder: string = "",credid: string)
    {
        await Promise.allSettled([
            this.connectionService.postItem(api_endpoints.GetPersonalCredentialById,{id: credid, personalfolderid: personalFolder}),
            this.connectionService.getItems(api_endpoints.getPersonalCredentialsFoldersByUserID)
        ]).then((resolve) =>{
            if(resolve[0].status == 'fulfilled' && resolve[1].status == 'fulfilled' )
            {
                this.updatePersonalCredential = resolve[0].value as iGetPersonalCredentials
                this.personalFolderList = resolve[1].value as iPersonalFolder[]
            }
        })
        this.updatePersonalCredentialForm.controls.id.setValue(this.updatePersonalCredential.id)
        this.updatePersonalCredentialForm.controls.domain.setValue(this.updatePersonalCredential.domain)
        this.updatePersonalCredentialForm.controls.username.setValue(this.updatePersonalCredential.username)
        this.updatePersonalCredentialForm.controls.email.setValue(this.updatePersonalCredential.email)
        this.updatePersonalCredentialForm.controls.remote.setValue(this.updatePersonalCredential.remote)
        this.updatePersonalCredentialForm.controls.personalFolderId.setValue(this.updatePersonalCredential.personalfolderid)
        this.updatePersonalCredentialForm.controls.originalpersonalFolderId.setValue(this.updatePersonalCredential.personalfolderid)
        this.updatePersonalCredentialForm.controls.note.setValue(this.updatePersonalCredential.note);

        ($(`#${modalid}`) as any).modal('show');
    }


    
    async UpdatePersonalCredential()
    {
        

        let postUpdateCredential: iPostUpdatePersonalCredential = {
            id: this.updatePersonalCredentialForm.value.id||"",
            domain: this.updatePersonalCredentialForm.value.domain||"",
            username: this.updatePersonalCredentialForm.value.username||"",
            email: this.updatePersonalCredentialForm.value.email||"",
            remote: this.updatePersonalCredentialForm.value.remote||"",
            note: this.updatePersonalCredentialForm.value.note||"",
            password: this.updatePersonalCredentialForm.value.password||"",
            personalfolderid: this.updatePersonalCredentialForm.value.personalFolderId||"",
            originalpersonalfolderid: this.updatePersonalCredentialForm.value.originalpersonalFolderId||""
        }

        let radiobuttons = document.getElementsByClassName("persoanlFolderList") as HTMLCollectionOf<HTMLInputElement>;
        for(let radiobutton of radiobuttons)
        {
            if(radiobutton.checked)
            {
                postUpdateCredential.personalfolderid = radiobutton.value
            }
        }

        this.responseStatus = (await this.connectionService.postItem(api_endpoints.UpdatePersonal,postUpdateCredential) as iPostRequestStatus)
    }

    async UpdateCredentail()
    {
        let postUpdateCredential: iPostUpdateCredential = {
            id: this.updateCredentialForm.value.id||"",
            domain: this.updateCredentialForm.value.domain||"",
            username: this.updateCredentialForm.value.username||"",
            email: this.updateCredentialForm.value.email||"",
            remote: this.updateCredentialForm.value.remote||"",
            note: this.updateCredentialForm.value.note||"",
            password: this.updateCredentialForm.value.password||""

        }
        this.responseStatus = (await this.connectionService.postItem(api_endpoints.UpdateCredential,postUpdateCredential) as iPostRequestStatus)
    }

    async CopyPassword(type:string, id:string)
    {
        switch (type)
        {
            case "cert":
                navigator.clipboard.writeText((await this.GetCertificatePasswordById(id)).trim())
                break;
            case "cred":
                navigator.clipboard.writeText((await this.GetCredentialPasswordById(id) as string).trim())
                break;
            case "personalCred":
                //navigator.clipboard.writeText((await this.GetPersonalCredentialPasswordById(id) as string).trim())
                break;
        }

  
    }

    async DeleteCredential(type: string)
    {
        switch(type)
        {
            case "personal":
                this.responseStatus = (await this.connectionService.DeleteItem(api_endpoints.DeletePersonalCredential, this.deletePersonalItem))
                break;
            case "team":
                this.responseStatus = (await this.connectionService.DeleteItem(api_endpoints.DeleteCredential, this.deleteCredentialItem))
                break;
        }
        
    }

    async DeleteCertificate()
    {
        this.responseStatus = (await this.connectionService.DeleteItem(api_endpoints.DeleteCertificate, this.deleteCertificateItem))
    }

    OpenDeleteCredentialModal(modalid: string, type:string, domain: string, username: string, parentid: string,credentialid: string)
    {
        switch(type)
        {
            case "personal":
                this.responseStatus = {status: "", errorMessage: ""}
                this.deletePersonalItem = {personalfolderid: parentid, id:credentialid}
                this.deleteModalName = domain+"\\"+username;
                this.deleteType = type;
                ($(`#${modalid}`) as any).modal('show');
                break;
            case "team":
                this.responseStatus = {status: "", errorMessage: ""}
                this.deleteCredentialItem = {teamid: parentid, id:credentialid}
                this.deleteModalName = domain+"\\"+username;
                this.deleteType = type;
                ($(`#${modalid}`) as any).modal('show');
                break;
        }

    }

    OpenDeleteCertificateModal(modalid: string, subjectname: string, teamid: string,credentialid: string)
    {
        this.deleteCertificateItem = {teamid: teamid, id:credentialid}
        this.deleteModalName = subjectname;
        ($(`#${modalid}`) as any).modal('show');
    }   

    CloseModal(modalid: string)
    {
        ($(`#${modalid}`) as any).modal('hide')
        this.responseStatus = {status: "",errorMessage:""}
    }

    async DownloadCertificate(_certificateId: string, _teamId: string)
    {
        let url = api_endpoints.DownloadCertificate.concat(_teamId).concat("/").concat(_certificateId)
        let test = ""
        await fetch(url,{
            headers: {
                "Content-Type":"application/zip",
                "Cache-Control":"no-store",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            }
        }).then(resp => {
            test = resp.headers.get("content-Disposition")||""
            return resp.blob()
        })
          .then(blob => {{
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            // the filename you want
            a.download = test;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }

          })
        
    }


    async DownloadCertificateKey(_certificateId: string, _teamId: string)
    {
        let url = api_endpoints.DownloadKey.concat(_teamId).concat("/").concat(_certificateId)
        let test = ""
        await fetch(url,{
            headers: {
                "Content-Type":"application/zip",
                "Cache-Control":"no-store",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            }
        }).then(resp => {
            test = resp.headers.get("content-Disposition")||""
            return resp.blob()
        })
          .then(blob => {{
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            // the filename you want
            a.download = test;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }

          })
        
    }

}