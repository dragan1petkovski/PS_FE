import { NgFor,NgIf,CommonModule,NgSwitch,NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { Component,Input,Output,EventEmitter } from "@angular/core";
import { GeneratePassword } from '../../passwordGenerator/passwordGenerator';
import { ReactiveFormsModule, FormControl, FormGroup, Validators} from '@angular/forms';
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";

import { ConnectionService } from "../../utility/connection.service";
import { api_endpoints } from "../../StaticObjects/api_endpoints";
import { iClientTeamMapping } from "../../interfaces/Team/Team";
import { iPostRequestStatus } from "../../interfaces/PostRequestStatus";
import { iPersonalFolder, iPostPersonalFolder } from "../../interfaces/DTOModel/PersonalFolderDTO";
import { iGetUserForTeamModal } from "../../interfaces/User/User";
import { iPostGiveCredential,iPostPersonalCredential,iPostCredential } from "../../interfaces/Credential/credential";
import { JwtService } from "../../utility/jwt.service";
import { CertificateTypeInput } from "../../interfaces/Certificate/certtypeinput";
import { ValidationMessages } from "../../ValidationMessages";

@Component({
    selector: 'workAreaHeader',
    templateUrl: './workAreaHeader.component.html',
    standalone: true,
    imports: [NgIf,NgFor,CommonModule,ReactiveFormsModule,NgSwitch,NgSwitchCase, NgSwitchDefault],
    providers: [ConnectionService,JwtService,ValidationMessages]
    
})
export class WorkAreaHeader extends ValidationMessages { 
    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
    itemList: any
    responseStatus: iPostRequestStatus = {status: "",errorMessage: ""}

    searchForm = new FormGroup({
        searchString: new FormControl("",[Validators.pattern("^[a-zA-Z0-9_-]*$")])
    })

    @Output() searchParameter = new EventEmitter<string>()

    EmitSearchString()
    {
        if(this.searchForm.controls.searchString.valid)
        {
            this.searchParameter.emit(this.searchForm.value.searchString||"")
        }
        
    }


    passwordGeneratorFormGroup = new FormGroup(
        {
            passwordlength: new FormControl('',[Validators.required,Validators.pattern("^[0-9]*$")]),
            number: new FormControl(true),
            uppercase: new FormControl(true),
            lowercase: new FormControl(true),
            specialcharacters: new FormControl(false),
            brackets: new FormControl(false),
        }
    )

    warningMessage: string = ""

    addCredentialForm = new FormGroup({
        domain: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        username: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        password: new FormControl('',[Validators.required]),
        remote: new FormControl('',[Validators.pattern("^[a-zA-Z0-9._-]*$")]),
        email: new FormControl('',[Validators.email]),
        note: new FormControl('',[Validators.pattern("^[a-zA-Z0-9._-]*$")]),
    })
    
    addPersonalFolderFormGroup = new FormGroup({
        addPersonalFolder: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")])
    })
    
    allPartUserList: iGetUserForTeamModal[] = []
    clientTeamMappingList: iClientTeamMapping[] = []
    
    giveCredentialInternallyForm =new FormGroup({
        domain: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        username: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        password: new FormControl('',[Validators.required]),
        remote: new FormControl(''),
        email: new FormControl(''),
        note: new FormControl(''),
    })

    giveCredentialExternallyForm =new FormGroup({
        domain: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        username: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        password: new FormControl('',[Validators.required]),
        remote: new FormControl(''),
        email: new FormControl(''),
        note: new FormControl(''),
    })


    constructor(private connectionService: ConnectionService,private jwtService: JwtService) {
        super();
    }


    PasswordGeneratorHideModal()
    {
        let passwordLength = document.getElementById("passwordLength") as HTMLInputElement
        passwordLength.value = ''

        let upperCase = document.getElementById("UpperCase") as HTMLInputElement
        upperCase.checked = false

        let specialCharacter = document.getElementById("SpecialCharacter") as HTMLInputElement
        specialCharacter.checked = false

        let lowerCase = document.getElementById("LowerCase") as HTMLInputElement
        lowerCase.checked = false

        let brackets = document.getElementById("Brackets") as HTMLInputElement
        brackets.checked = false

        let numbers = document.getElementById("Numbers") as HTMLInputElement
        numbers.checked = false

        let passwordObject = document.getElementById("passwordString") as HTMLParagraphElement
        passwordObject.innerText = ""

    }

    async loadUserTeams()
    {
        let json = (await this.connectionService.getItems(api_endpoints.getAllClientTeamMappingsByUserId))
        this.itemList  = json as iClientTeamMapping[]
    }

    async loadPersonalFolders()
    {
        this.itemList = (await this.connectionService.getItems(api_endpoints.getPersonalCredentialsFoldersByUserID)) as iPersonalFolder[] 
    }

    async OpenModalWithData(id: string,datatype: string)
    {
        this.responseStatus = {status:"",errorMessage:""}
        switch(datatype)
        {
            case 'teamList': {
                await this.loadUserTeams();
                ($(`#${id}`) as any).modal('show');
                break;
            }
            case 'personalFolderList': {
                this.warningMessage = "All credential will be removed from the personal Folder"
                await this.loadPersonalFolders();
                ($(`#${id}`) as any).modal('show');
                break;
            }
            default:{
                break;
            }
        }

    }

    async AddCredential()
    {
        let PostCredential  = this.addCredentialForm.value
        let postCredential = PostCredential as iPostCredential
        postCredential.teams = []
        let checkboxes = document.getElementsByClassName("teamList") as HTMLCollectionOf<HTMLInputElement>
        for(let checkbox of checkboxes)
            {
                let temp = checkbox as HTMLInputElement
                if(temp.checked)
                {
                    postCredential.teams.push(JSON.parse(temp.value))
                }
            }
        let postStatus = await this.connectionService.postItem(api_endpoints.setCredentials,PostCredential) as iPostRequestStatus
        this.responseStatus = postStatus
        
    }

    async AddPersonalCredential()
    {
        let PostCredential  = this.addCredentialForm.value
        let postCredential = PostCredential as iPostPersonalCredential
        let radiobuttons = document.getElementsByClassName("persoanlFolderList") as HTMLCollectionOf<HTMLInputElement>
        
        for(let radiobutton of radiobuttons)
        {
            let temp = radiobutton as HTMLInputElement
            if(temp.checked)
            {
                postCredential.personalFolderId =  temp.id
            }
        }
        let postStatus = await this.connectionService.postItem(api_endpoints.setPersonalCredentialByUserID,PostCredential) as iPostRequestStatus
        this.responseStatus = postStatus
    }

    UncheckAllAddCredentialCheckboxes()
    {
        let checkboxes = document.getElementsByClassName("teamList") as HTMLCollectionOf<HTMLInputElement>
        for(let checkbox of checkboxes)
        {
            let temp = checkbox as HTMLInputElement
            if(temp.checked)
            {
                temp.checked = false
            }
        }
    }

    ResetFormGroup(postStatus: string)
    {
        if(postStatus === "OK")
        {
            this.addCredentialForm.reset()
            this.UncheckAllAddCredentialCheckboxes()
            this.uncheckGiveCredentialcheckbox()
            return "OK"
        }
        else if(postStatus === "KO")
        {
            this.addCredentialForm.reset()
            this.UncheckAllAddCredentialCheckboxes()
            this.uncheckGiveCredentialcheckbox()
            return "KO"
        }
        return ""
    }

    GeneratedPassword()
    {
        let passwordObject = document.getElementById("passwordString") as HTMLParagraphElement
        passwordObject.innerText = GeneratePassword()
    }

    CloseModal(modalid: string)
    {
        ($(`#${modalid}`) as any).modal('hide')
        this.responseStatus = {status: "", errorMessage:""}
    }

    async AddPersonalFolderByUserId()
    {
        let addPersonalFolder: iPostPersonalFolder = {name: this.addPersonalFolderFormGroup.controls.addPersonalFolder.value}
        this.responseStatus = (await this.connectionService.postItem(api_endpoints.setPersonalFolderByUserID,addPersonalFolder) as iPostRequestStatus)
    }

    async GiveCredentialInternallyData()
    {
        Promise.allSettled([
            this.connectionService.getItems(api_endpoints.getAllClientTeamMappings),
            this.connectionService.getItems(api_endpoints.GetAllPartUsers)
        ]).then(resolve => {
            if(resolve[0].status == 'fulfilled' && resolve[1].status =='fulfilled')
            {
                this.clientTeamMappingList = resolve[0].value as iClientTeamMapping[]
                this.allPartUserList = resolve[1].value as iGetUserForTeamModal[]
            }
        })
    }

    async ShowGiveCredentialInternallyModal()
    {
        await this.GiveCredentialInternallyData();
        ($('#GiveCredentialInternally') as any).modal('show')
    }

    uncheckGiveCredentialcheckbox()
    {
        let usercheckboxes = document.getElementsByClassName("gc_usercheckbox") as HTMLCollectionOf<HTMLInputElement>
        let teamclientmappingcheckboxes = document.getElementsByClassName("gc_teamclientmappingcheckbox") as HTMLCollectionOf<HTMLInputElement>
        for(let usercheckbox of usercheckboxes)
        {
            let temp = usercheckbox as HTMLInputElement
            temp.checked = false
        }
        for(let teamclientmapping of teamclientmappingcheckboxes)
        {
            let temp = teamclientmapping as HTMLInputElement
            temp.checked = false
        }
    }

    async GiveCredentialInternally()
    {
        let postGiveCredential: iPostGiveCredential = {
            domain: this.giveCredentialInternallyForm.value.domain,
            username: this.giveCredentialInternallyForm.value.username,
            password: this.giveCredentialInternallyForm.value.password,
            email: this.giveCredentialInternallyForm.value.email,
            remote: this.giveCredentialInternallyForm.value.remote,
            note: this.giveCredentialInternallyForm.value.note,
            teamids: [],
            userids: []
        }

        let usercheckboxes = document.getElementsByClassName("gc_usercheckbox") as HTMLCollectionOf<HTMLInputElement>
        let teamclientmappingcheckboxes = document.getElementsByClassName("gc_teamclientmappingcheckbox") as HTMLCollectionOf<HTMLInputElement>
        for(let usercheckbox of usercheckboxes)
        {
            let temp = usercheckbox as HTMLInputElement
            if(temp.checked)
            {
                postGiveCredential.userids?.push(temp.value)
            }
        }
        for(let teamclientmapping of teamclientmappingcheckboxes)
        {
            let temp = teamclientmapping as HTMLInputElement
            if(temp.checked)
            {
                postGiveCredential.teamids?.push(temp.value)
            }
        }

        let postStatus = (await this.connectionService.postItem(api_endpoints.giveCredential,postGiveCredential)) as iPostRequestStatus
        this.responseStatus = postStatus
    }

    async UploadCertificate()
    {
        let form = document.getElementById("_uploadCertificate") as HTMLFormElement
        let data = new FormData(form)
        
        switch (data.get("certtype"))
        {
            case 'privatekey':
                this.privatekeycertificateuploadvalidation(data) ? this.responseStatus= await this.connectionService.postUploadCertificate(api_endpoints.uploadcertificate,data) as iPostRequestStatus: null
                break;
            case 'publicprivatekey':
                this.publicprivatekeycertificateuploadvalidation(data) ? this.responseStatus= await this.connectionService.postUploadCertificate(api_endpoints.uploadcertificate,data) as iPostRequestStatus : null
                break;
            default:
                break;
        }

        this.CloseModal("UploadCertificate")
    }

    ChooseUploadCertificateType()
    {

        let privatekey = document.getElementById("privatekey") as HTMLInputElement
        let publicprivatekey = document.getElementById("publicprivatekey") as HTMLInputElement
        let input = document.getElementById("certtypeinput")


        if(input != null)
        {
            if(privatekey.checked)
            {
                input.innerHTML = CertificateTypeInput.privatekey

            }
            if(publicprivatekey.checked)
            {
                input.innerHTML = CertificateTypeInput.pemcert
            }
        }
        


    }

    privatekeycertificateuploadvalidation(formdata: FormData)
    {
        let certfile = formdata.get('certfile') as File
        let teams = formdata.get('team')
        let certpass = formdata.get('certpass') as string


        if(certfile != null && certfile != undefined && certfile.size > 0 && this.certificatenamevalidation(certfile.name,'privatekey'))
        {
            console.log(certfile.size)
            if(teams != null && teams != undefined)
            {
                if(certpass != null && certfile != undefined && (certpass.length > 0) )
                {
                    return true
                }
                return false
            }
            return false
        }
        return false
    }

    publicprivatekeycertificateuploadvalidation(formdata: FormData)
    {
        let certfile = formdata.get('certfile') as File
        let certkey = formdata.get('certkey') as File
        let teams = formdata.get('team')


        if(certfile != null && certfile != undefined && certfile.size > 0 && this.certificatenamevalidation(certfile.name,'publicprivatekey'))
        {
            if(certkey != null && certkey != undefined && certkey.size > 0 && this.certificatenamevalidation(certfile.name,'publicprivatekey'))
            {
                if(teams != null && teams != undefined)
                {
                        return true
                }
                return false
            }
            return false
        }
        return false
    }

    certificatenamevalidation(certname:string,type:string)
    {
        let temp = certname.split(".")
        let postfix = temp[temp.length -1]
        let privatekeypostfix = ['pfx','p12']
        let publicprivatekeypostfix = ['pem','crt','key']
        if(temp.length != 2)
        {
            return false
        }
        else
        {
            switch (type)
            {
                case 'privatekey':
                    return this.ifItemExists(privatekeypostfix,postfix)
                case 'publicprivatekey':
                    return this.ifItemExists(publicprivatekeypostfix,postfix)
                default:
                    return false

            }
        }

    }

    ifItemExists(stringlist:string[],item:string)
    {
        if(stringlist.find(u => u === item) != null && stringlist.find(u => u === item) != undefined)
        {
            return true;
        }
        return false
    }

    async DeletePersonalFolder()
    {
        let output: string[] = []
        let checkboxes = document.getElementsByClassName("deletepersoanlFolderList") as HTMLCollectionOf<HTMLInputElement>
        for(let checkbox of checkboxes)
        {
            checkbox.checked ? output.push(checkbox.value): null
        }

        this.responseStatus = await this.connectionService.DeleteItem(api_endpoints.DeletePersonalFolder,{personalFolderIds: output}) as iPostRequestStatus
    }
}