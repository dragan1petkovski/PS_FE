import { Component } from "@angular/core"
import { ReactiveFormsModule, FormControl, FormGroup, RequiredValidator, FormArray, Validators } from '@angular/forms';
import { iPOstStatus } from "../../interfaces/postStatus";
import { iClient, iPostClient } from "../../interfaces/Client";
import { ConnectionService} from "../../utility/connection.service"
import { api_endpoints } from "../../api_endpoints";
import { CommonModule, NgFor } from "@angular/common";
import { iPartUser, iPostUser } from "../../interfaces/user"
import { iClientTeamMapping, iPostTeam } from "../../interfaces/Team";

@Component({
    standalone: true,
    selector: "AdminNavMenuHeader",
    templateUrl: "./AdminNavMenuHeader.component.html",
    imports: [ReactiveFormsModule, NgFor,CommonModule]
})
export class AdminNavMenuHeaderComponent
{
    postStatus: iPOstStatus = {status: ""}

    //Add Client
    AddClientFormGroup = new FormGroup({
        name: new FormControl('',[Validators.required])
    })

    //Add Team
    clientList: iClient[] = []
    userList: iPartUser[] = []
    AddTeamFormGroup = new FormGroup({
        name: new FormControl('',[Validators.required]),
        chooseClient: new FormControl('',[Validators.required])
    })

    //Add User
    clientTeamMappingList: iClientTeamMapping[] = []
    AddUserFormGroup = new FormGroup({
        firstname: new FormControl('',[Validators.required]),
        lastname: new FormControl('',[Validators.required]),
        username: new FormControl('',[Validators.required]),
        email: new FormControl('',[Validators.required])
    })

    constructor (private connectionService: ConnectionService) {}


    async AddClient()
    {
        let newClient: iPostClient = { name: this.AddClientFormGroup.value.name}
        this.postStatus = (await this.connectionService.postItem(api_endpoints.AddClient,newClient)) as iPOstStatus
    }

    async AddTeam()
    {
        let newTeam: iPostTeam = { name: this.AddTeamFormGroup.value.name, clientid: this.AddTeamFormGroup.value.chooseClient, userids: []}
        let usercheckboxes = document.getElementsByClassName("teamUserCheckboxes") as HTMLCollectionOf<HTMLInputElement>
        for(let usercheckbox of usercheckboxes)
        {
            let temp = usercheckbox as HTMLInputElement
            if(temp.checked)
            {
                newTeam.userids?.push(temp.value)
            }
        }
        this.postStatus = (await this.connectionService.postItem(api_endpoints.AddTeam,newTeam)) as iPOstStatus
    }
    async ShowAddTeamModal()
    {
        await this.GetAllTeamData();
        ($('#AddTeamModal') as any).modal('show')
    }

    async GetAllTeamData()
    {
        this.GetAllClients().then(response => this.clientList = response)
        this.GetAllUsers().then(response => this.userList = response)
    }

    async GetAllClients()
    {
        return this.connectionService.getItems(api_endpoints.GetAllPartClients)
    }

    async GetAllUsers()
    {
        return this.connectionService.getItems(api_endpoints.GetAllPartUsers)
    }

    async AddUser()
    {
        let postUser: iPostUser = {
            firstname: this.AddUserFormGroup.value.firstname,
            lastname: this.AddUserFormGroup.value.lastname,
            email: this.AddUserFormGroup.value.email,
            username: this.AddUserFormGroup.value.username,
            clientTeamPairs: []
        }
        let usercheckboxes = document.getElementsByClassName("usercheckboxes") as HTMLCollectionOf<HTMLInputElement>
        for(let usercheckbox of usercheckboxes)
        {
            let temp = usercheckbox as HTMLInputElement
            if(temp.checked)
            {
                postUser.clientTeamPairs?.push(JSON.parse(temp.value))
            }
        }

        this.postStatus = (await this.connectionService.postItem(api_endpoints.AddUser,postUser)) as iPOstStatus
        this.AddUserFormGroup.reset()
        for(let usercheckbox of usercheckboxes)
            {
                let temp = usercheckbox as HTMLInputElement
                temp.checked = false
            }
    }

    async ShowAddUserModal()
    {
        this.clientTeamMappingList = await this.connectionService.getItems(api_endpoints.getAllClientTeamMappings) as iClientTeamMapping[]
        ($('#AddUserModal') as any).modal('show')
        
    }


}