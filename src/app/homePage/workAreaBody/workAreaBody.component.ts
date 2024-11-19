import { Component,Input,inject } from "@angular/core";
import { NgFor,NgIf,CommonModule } from "@angular/common";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { ConnectionService } from "../../utility/connection.service";
import { ClipboardModule } from '@angular/cdk/clipboard'
import { api_endpoints } from '../../StaticObjects/api_endpoints'
import { iDeleteCredential,iGetCredential,iGetPersonalCredentials,iPostUpdateCredential,iDeletePersonalCredential,iPostUpdatePersonalCredential } from "../../interfaces/Credential/credential";
import { iDeleteCertificate,iGetCertificate } from "../../interfaces/Certificate/certificate"
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormsModule} from '@angular/forms';
import { iGetPasswordString } from "../../interfaces/Password/password"
import { iPersonalFolder } from "../../interfaces/DTOModel/PersonalFolderDTO";
import { iStatusMessage,iStatus,StatusMessage } from "../../utility/iStatusMessage";
import { ValidationMessages } from "../../StaticObjects/ValidationMessages";
import { SignalRService } from "../../SignalR/signalR";

@Component({
    selector: 'workAreaBody',
    templateUrl: './workAreaBody.component.html',
    standalone: true,
    imports: [NgFor,NgIf,ClipboardModule,CommonModule,ReactiveFormsModule],
    
})
export class WorkAreaBody {
    @Input() signalR: SignalRService = new SignalRService()
    @Input() certificates: iGetCertificate[] = [];
    @Input() credentials: iGetCredential[] = []
    @Input() personalcredentials: iGetPersonalCredentials[]=[]

    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
    
    deleteModalName: string = ""
    RequestStatus: iStatusMessage = {status: "", statusMessage: ""}
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
        note: new FormControl(""),
        teamid: new FormControl("",[Validators.required])
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

    ngOnInit(): void
    {
        this.GetSignalRUpdate()
    }

    constructor(private connectionService: ConnectionService, public validationMessage: ValidationMessages, private statusMessage: StatusMessage) {}
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
        
        if(teamid != null && teamid != undefined)
        {
            const password = await this.connectionService.GET(api_endpoints.getcredentialpassword.concat(`${id}/${teamid}`))
            return password.password
        }

    }

    async GetCertificatePasswordById(id:string, teamid?:string) {
        let postpasswordRequest:iGetPasswordString ={parentid: '',id: ''}
        if(teamid != null && teamid != undefined)
        {
            const password = await this.connectionService.GET(api_endpoints.getcertificatepassword.concat(`${id}/${teamid}`))
            return password.password
        }

     }

    async GetPersonalCredentialPasswordById(id: string, personalFolder?: string)
    {

        if(personalFolder != null && personalFolder != undefined)
        {
            const password = await this.connectionService.GET(api_endpoints.getpersonalpassword.concat(`${id}/${personalFolder}`))
            return password.password
        }
        else
        {
            const password = await this.connectionService.GET(api_endpoints.getpersonalpassword.concat(`${id}`))
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

    async OpenUpdateCredentialModal(modalid: string, credid: string, teamid: string)
    {

        this.updateCredential = await this.connectionService.GET(api_endpoints.credential.concat(`?tid=${teamid}&credid=${credid}`)).then(resolve => resolve as iGetCredential)
        this.updateCredentialForm.controls.id.setValue(this.updateCredential.id)
        this.updateCredentialForm.controls.domain.setValue(this.updateCredential.domain)
        this.updateCredentialForm.controls.username.setValue(this.updateCredential.username)
        this.updateCredentialForm.controls.email.setValue(this.updateCredential.email)
        this.updateCredentialForm.controls.remote.setValue(this.updateCredential.remote)
        this.updateCredentialForm.controls.teamid.setValue(teamid)
        this.updateCredentialForm.controls.note.setValue(this.updateCredential.note);
        ($(`#${modalid}`) as any).modal('show');
    }

    async OpenUpdatePersonalCredentialModal(modalid: string, personalFolder: string = "",credid: string)
    {
        await Promise.allSettled([
            this.connectionService.GET(api_endpoints.personalcredential.concat("?pfid=",personalFolder,"&credid=",credid)),
            this.connectionService.GET(api_endpoints.personalfolder)
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
        this.updatePersonalCredentialForm.controls.originalpersonalFolderId.setValue(personalFolder)
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
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.PUT(api_endpoints.personalcredential,postUpdateCredential) as iStatus)
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
            password: this.updateCredentialForm.value.password||"",
            teamid: this.updateCredentialForm.value.teamid||""

        }
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.PUT(api_endpoints.credential,postUpdateCredential) as iStatus)
    }

    async CopyPassword(type:string, id:string, teamid?:string)
    {
        switch (type)
        {
            case "cert":
                navigator.clipboard.writeText((await this.GetCertificatePasswordById(id,teamid)).trim())
                break;
            case "cred":
                navigator.clipboard.writeText((await this.GetCredentialPasswordById(id,teamid)).trim())
                break;
            case "personalCred":
                navigator.clipboard.writeText((await this.GetPersonalCredentialPasswordById(id,teamid)).trim())
                break;
        }

  
    }

    async DeleteCredential(type: string)
    {
        switch(type)
        {
            case "personal":
                this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.DELETE(api_endpoints.personalcredential.concat(`/${this.deletePersonalItem.id}/${this.deletePersonalItem.personalfolderid}`)))
                break;
            case "team":
                this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.DELETE(api_endpoints.credential.concat(`${this.deleteCredentialItem.id}/${this.deleteCredentialItem.teamid}`)))
                break;
        }
        
    }

    async DeleteCertificate()
    {
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.DELETE(api_endpoints.certificate.concat(`${this.deleteCertificateItem.id}/${this.deleteCertificateItem.teamid}`)))
    }

    OpenDeleteCredentialModal(modalid: string, type:string, domain: string, username: string, parentid: string,credentialid: string)
    {
        switch(type)
        {
            case "personal":
                this.RequestStatus = {status: "", statusMessage: ""}
                this.deletePersonalItem = {personalfolderid: parentid, id:credentialid}
                this.deleteModalName = domain+"\\"+username;
                this.deleteType = type;
                ($(`#${modalid}`) as any).modal('show');
                break;
            case "team":
                this.RequestStatus = {status: "", statusMessage: ""}
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
        this.RequestStatus = {status: "",statusMessage:""}
    }

    async DownloadCertificate(_certificateId: string, _teamId: string)
    {
        let url = api_endpoints.certificatedownload.concat(_teamId).concat("/").concat(_certificateId)
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
        let url = api_endpoints.certificatekeydownload.concat(_teamId).concat("/").concat(_certificateId)
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

    async GetSignalRUpdate()
    {
        this.signalR.GetNotification((message) => {
            let notification = JSON.parse(message)
            console.log(notification)
            switch(notification.status)
            {
                case "new":
                    switch(notification.type)
                    {
                        case "credential":
                            this.credentials.push(notification.data)
                            break;
                        case "certificate":
                            this.certificates.push(notification.data)
                            break;
                        case "personal":
                            this.personalcredentials.push(notification.data)
                    }
                    break;
                case "update":
                    switch(notification.type)
                    {
                        case "credential":
                            let index = this.credentials.findIndex(c => c.id != notification.data.id) - 1
                            this.credentials[index].teamid = notification.data.teamid
                            this.credentials[index].teamname = notification.data.teamname
                            this.credentials[index].domain = notification.data.domain
                            this.credentials[index].email = notification.data.email
                            this.credentials[index].note = notification.data.note
                            this.credentials[index].remote = notification.data.remote
                            this.credentials[index].username = notification.data.username
                            break; 
                        case "personal":
                            let pindex = this.personalcredentials.findIndex(c => c.id != notification.data.id) - 1
                            this.personalcredentials[pindex].personalfolderid = notification.data.teamid
                            this.personalcredentials[pindex].domain = notification.data.domain
                            this.personalcredentials[pindex].email = notification.data.email
                            this.personalcredentials[pindex].note = notification.data.note
                            this.personalcredentials[pindex].remote = notification.data.remote
                            this.personalcredentials[pindex].username = notification.data.username
                            break;
                    }

                    break;
                case "delete":
                    switch(notification.type)
                    {
                        case "credential":
                            this.credentials = this.credentials.filter(c => c.id !== notification.data)
                            break;
                        case "certificate":
                            this.certificates = this.certificates.filter(c => c.id !== notification.data)
                            break;
                        case "personal":
                            this.personalcredentials = this.personalcredentials.filter(c => c.id !== notification.data)
                    }
                    break;
            }
        })
    }

}