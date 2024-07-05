import { NgFor,NgIf,CommonModule,NgSwitch,NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { Component,Input } from "@angular/core";
import { GeneratePassword } from '../../passwordGenerator/passwordGenerator';
import { ReactiveFormsModule, FormControl, FormGroup, RequiredValidator, FormArray } from '@angular/forms';
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { iPostCredential } from "../../interfaces/PostCredential";
import { Validators } from "@angular/forms"

import { ConnectionService } from "../../utility/connection.service";
import { api_endpoints, session_id } from "../../api_endpoints";
import { iTeamDTOMini } from "../../interfaces/DTOModel/teamDTOMini";
import { iPOstStatus } from "../../interfaces/postStatus";
import { iPersonalFolder, iPersonalFolderPost } from "../../interfaces/DTOModel/PersonalFolderDTO";


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
    

    giveCredential =new FormGroup({})
    credentialGiveCheckbox:boolean = false

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
                    postCredential.teams.push({teamname: temp.name, clientid: temp.value, teamid: temp.id, clientname:"" })
                }
            }
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
            return "OK"
        }
        else if(postStatus === "KO")
        {
            this.addCredentialForm.reset()
            this.UncheckAllAddCredentialCheckboxes()
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
}