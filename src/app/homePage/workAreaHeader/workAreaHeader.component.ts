import { NgFor,NgIf,CommonModule,NgSwitch,NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { Component,Input } from "@angular/core";
import { GeneratePassword } from '../../passwordGenerator/passwordGenerator';
import { ReactiveFormsModule, FormControl, FormGroup, RequiredValidator, FormArray, FormControlName } from '@angular/forms';
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { iPostCredential } from "../../interfaces/PostCredential";
import { Validators } from "@angular/forms"

import { ConnectionService } from "../../utility/connection.service";
import { api_endpoints, session_id } from "../../api_endpoints";
import { iTeamDTOMini } from "../../interfaces/DTOModel/teamDTOMini";
import { iPOstStatus } from "../../interfaces/postStatus";
import { iPersonalFolder, iPersonalFolderPost } from "../../interfaces/DTOModel/PersonalFolderDTO";
import { iClientTeamMapping } from "../../interfaces/Team"
import { iPartUser } from "../../interfaces/user";
import { iPostGiveCredential } from "../../interfaces/GiveCredentials";

@Component({
    selector: 'workAreaHeader',
    templateUrl: './workAreaHeader.component.html',
    standalone: true,
    imports: [NgIf,NgFor,CommonModule,ReactiveFormsModule,NgSwitch,NgSwitchCase, NgSwitchDefault],
    providers: [ConnectionService]
    
})
export class WorkAreaHeader { 
    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
    itemList: any
    responseStatus:string = ""

    passwordGeneratorFormGroup = new FormGroup(
        {
            passwordlength: new FormControl('',[Validators.required]),
            number: new FormControl(true),
            uppercase: new FormControl(true),
            lowercase: new FormControl(true),
            specialcharacters: new FormControl(false),
            brackets: new FormControl(false),
        }
    )

    addCredentialForm = new FormGroup({
        domain: new FormControl('',[Validators.required]),
        username: new FormControl('',[Validators.required]),
        password: new FormControl('',[Validators.required]),
        remote: new FormControl(''),
        email: new FormControl(''),
        note: new FormControl(''),
    })
    
    addPersonalFolderFormGroup = new FormGroup({
        addPersonalFolder: new FormControl('',[Validators.required])
    })
    
    allPartUserList: iPartUser[] = []
    clientTeamMappingList: iClientTeamMapping[] = []
    giveCredentialInternallyForm =new FormGroup({
        domain: new FormControl('',[Validators.required]),
        username: new FormControl('',[Validators.required]),
        password: new FormControl('',[Validators.required]),
        remote: new FormControl(''),
        email: new FormControl(''),
        note: new FormControl(''),
    })

    giveCredentialExternallyForm =new FormGroup({
        domain: new FormControl('',[Validators.required]),
        username: new FormControl('',[Validators.required]),
        password: new FormControl('',[Validators.required]),
        remote: new FormControl(''),
        email: new FormControl(''),
        note: new FormControl(''),
    })

    constructor(private connectionService: ConnectionService) {}


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
        let json = (await this.connectionService.getItems(api_endpoints.getAllClientTeamMappingsByUserId.concat(session_id)))
        this.itemList  = json as iTeamDTOMini[]

    }

    async loadPersonalFolders()
    {
        let json = (await this.connectionService.getItems(api_endpoints.getPersonalCredentialsFoldersByUserID.concat(session_id)))
        this.itemList = json as iPersonalFolder[]
    }

    async OpenModalWithData(id: string,datatype: string)
    {
        switch(datatype)
        {
            case 'teamList': {
                await this.loadUserTeams();
                ($(`#${id}`) as any).modal('show');
                break;
            }
            case 'personalFolderList': {
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
        console.log(PostCredential)
        let postStatus = await this.connectionService.postItem(api_endpoints.setCredentials,PostCredential) as iPOstStatus
        this.responseStatus = postStatus.status
    }

    async AddPersonalCredential()
    {
        let PostCredential  = this.addCredentialForm.value
        let postCredential = PostCredential as iPostCredential
        let radiobuttons = document.getElementsByClassName("persoanlFolderList") as HTMLCollectionOf<HTMLInputElement>
        
        for(let radiobutton of radiobuttons)
        {
            let temp = radiobutton as HTMLInputElement
            if(temp.checked)
            {
                postCredential.personalfolderid =  temp.id
            }
        }
        let postStatus = await this.connectionService.postItem(api_endpoints.setPersonalCredentialByUserID.concat(session_id),PostCredential) as iPOstStatus
        this.responseStatus = postStatus.status
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
        this.responseStatus = ''
    }
    async AddPersonalFolderByUserId()
    {
        let postPersonalFolder: iPersonalFolderPost =  {name: this.addPersonalFolderFormGroup.controls.addPersonalFolder.value}
        this.responseStatus = await this.connectionService.postItem(api_endpoints.setPersonalFolderByUserID.concat(session_id),postPersonalFolder)
    }


    async GiveCredentialInternallyData()
    {
        this.clientTeamMappingList = await this.connectionService.getItems(api_endpoints.getAllClientTeamMappings) as iClientTeamMapping[]
        this.allPartUserList =  await this.connectionService.getItems(api_endpoints.GetAllPartUsers) as iPartUser[]
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

        let postStatus = (await this.connectionService.postItem(api_endpoints.giveCredential,postGiveCredential)) as iPOstStatus
        this.responseStatus = postStatus.status
    }


}