import { Component,Output,Input, EventEmitter  } from "@angular/core"
import { ReactiveFormsModule, FormControl, FormGroup, RequiredValidator, FormArray, Validators } from '@angular/forms';
import { iGetClientsForUser, iPostClient } from "../../interfaces/Client/Client";
import { ConnectionService} from "../../utility/connection.service"
import { api_endpoints } from "../../StaticObjects/api_endpoints";
import { CommonModule, NgFor } from "@angular/common";
import { iGetUserForTeamModal, iPostUser,iPostUpdateUser } from "../../interfaces/User/User"
import { iClientTeamMapping, iPostTeam } from "../../interfaces/Team/Team";
import { iStatusMessage } from "../../utility/iStatusMessage";
import { ValidationMessages } from "../../StaticObjects/ValidationMessages";
import { StatusMessage } from "../../utility/iStatusMessage";
import { iStatus } from "../../utility/iStatusMessage";


@Component({
    standalone: true,
    selector: "AdminWorkAreaHeader",
    templateUrl: "./AdminWorkAreaHeader.component.html",
    imports: [ReactiveFormsModule, NgFor,CommonModule]
})
export class AdminWorkAreaHeaderComponent
{
    RequestStatus: iStatusMessage = {status: "", statusMessage: ""}
    
    @Output() searchParameter = new EventEmitter<string>()
    searchForm = new FormGroup({
        searchString: new FormControl("",[Validators.pattern("^[a-zA-Z0-9-_]*$")])
    })

    EmitSearchString()
    {
        if(this.searchForm.controls.searchString.valid)
        {
            this.searchParameter.emit(this.searchForm.value.searchString||"")
        }
        
    }

    //Add Client
    AddClientFormGroup = new FormGroup({
        name: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")])
    })

    //Add Team
    clientList: iGetClientsForUser[] = []
    userList: iGetUserForTeamModal[] = []
    AddTeamFormGroup = new FormGroup({
        name: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        chooseClient: new FormControl('',[Validators.required])
    })

    //Add User
    clientTeamMappingList: iClientTeamMapping[] = []
    AddUserFormGroup = new FormGroup({
        firstname: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        lastname: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        username: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        email: new FormControl('',[Validators.required,Validators.email])
    })

    constructor (private connectionService: ConnectionService, public validationMessage: ValidationMessages, private statusMessage: StatusMessage) {}


    async AddClient()
    {
        let newClient: iPostClient = { name: this.AddClientFormGroup.value.name||""}
        this.RequestStatus  = await this.statusMessage.GetResponse(await this.connectionService.POST(api_endpoints.client,newClient) as iStatus)
        
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
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.POST(api_endpoints.team,newTeam) as iStatus)
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
        return this.connectionService.GET(api_endpoints.partclient)
    }

    async GetAllUsers()
    {
        return this.connectionService.GET(api_endpoints.user)
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

        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.POST(api_endpoints.user,postUser) as iStatus)
        this.AddUserFormGroup.reset()
        for(let usercheckbox of usercheckboxes)
            {
                let temp = usercheckbox as HTMLInputElement
                temp.checked = false
            }
    }

    async ShowAddUserModal()
    {
        this.clientTeamMappingList = await this.connectionService.GET(api_endpoints.getteammapping.concat("all")) as iClientTeamMapping[]
        ($('#AddUserModal') as any).modal('show')
        
    }

    ClearResponseStatus()
    {
        this.RequestStatus = {status: "" , statusMessage: ""};
    }

    CloseModal()
    {
        this.ClearResponseStatus()
        this.AddClientFormGroup.reset()
        this.AddTeamFormGroup.reset()
        this.AddUserFormGroup.reset()
    }
}