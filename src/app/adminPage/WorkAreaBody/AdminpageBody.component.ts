import { Component } from "@angular/core"
import { Input } from "@angular/core"
import { iSelectAdminTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs"
import { iAdminTableData } from "../../interfaces/AdminPage/adminTableData"
import { CommonModule, NgFor,NgIf } from "@angular/common";
import { iClientTeamMapping, iGetUpdateTeam } from "../../interfaces/Team/Team";
import { ConnectionService } from "../../utility/connection.service"
import { api_endpoints } from "../../StaticObjects/api_endpoints"
import { iUpdateUser,iGetUserForTeamModal,iPostUpdateUser } from "../../interfaces/User/User";
import { ReactiveFormsModule, FormControl, FormGroup, RequiredValidator, FormArray, Validators } from '@angular/forms';
import { JwtService } from "../../utility/jwt.service";
import { ValidationMessages } from "../../ValidationMessages";
import { iPostRequestStatus } from "../../interfaces/PostRequestStatus";
import { iGetClientsForUser } from "../../interfaces/Client/Client"
import { from } from "rxjs";
import { DeleteItemRequest } from "../../interfaces/AdminPage/DeleteItemRequest";


@Component({
    standalone: true,
    templateUrl: "./AdminpageBody.component.html",
    selector: "AdminpageBody",
    imports: [NgFor,NgIf,ReactiveFormsModule,CommonModule],
})
export class AdminpageBodyComponent extends ValidationMessages
{

    constructor(private connectionService: ConnectionService, private jwtService: JwtService) {
        super()
    }

    @Input() currentSelectedTab: iSelectAdminTabs = {clientTab: true, userTab: false, teamTab: false}
    @Input() tableData: iAdminTableData = {clients:[],users:[],teams:[]}
    @Input() searchParameter: string = ""

    postRequestStatus: iPostRequestStatus = {status: "", errorMessage: null}
    
    ClearResponseStatus = () => this.postRequestStatus.status = ""
    
    deleteItemForm = new FormGroup({
        verificationcode: new FormControl("",[Validators.required,Validators.pattern("^[0-9]{8}$")])
    })

    warningMessage: string|null = null

    updateClientForm = new FormGroup({
        id: new FormControl("",[Validators.required]),
        name: new FormControl("",[Validators.required,Validators.pattern("^[A-Za-z0-9]*$")])
    })

    updateUserForm = new FormGroup({
        id: new FormControl(""),
        username: new FormControl("", [Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        firstname: new FormControl("", [Validators.required,Validators.pattern("^[a-zA-Z0-9]*$")]),
        lastname: new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z0-9-_]*$")]),
        email: new FormControl("",[Validators.required,Validators.email])
    })

    updateTeamForm = new FormGroup(
        {
            id: new FormControl("", [Validators.required]),
            name: new FormControl("", [Validators.required,Validators.pattern("^[A-Za-z0-9]*$")])
        }
    )

    deleteItemId: string =''
    deleteItemName: string = ''
    deleteItemtype: string =''

    updateUserobj: iUpdateUser = {
        id: "",
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        clientTeamMapping: []
    }
    getAllClienatTeamPairs: iClientTeamMapping[] = []


//************ Team ************/
    allUserList: iGetUserForTeamModal[] = []
    getUpdateTeam: iGetUpdateTeam = {id: "",name: "", users: []}
    teamUserList: iGetUserForTeamModal[] = []
    async OpenTeamModal(id: string)
    {
        this.ClearResponseStatus()
        await Promise.allSettled([
            this.connectionService.getItems(api_endpoints.GetAllPartUsers),
            this.connectionService.getItems(api_endpoints.UpdateTeam.concat(id))
        ]).then(resolve => {
            if(resolve[0].status == 'fulfilled' && resolve[1].status == 'fulfilled')
            {
                this.allUserList = resolve[0].value as iGetUserForTeamModal[]
                this.getUpdateTeam = resolve[1].value as iGetUpdateTeam
                this.updateTeamForm.controls.id.setValue(this.getUpdateTeam.id)
                this.updateTeamForm.controls.name.setValue(this.getUpdateTeam.name)
                this.teamUserList = this.getUpdateTeam.users;
            }
        });
        
        ($('#EditTeamModal')as any).modal('show');
    }

    FindUser(teamUserList: iGetUserForTeamModal[], user: iGetUserForTeamModal)
    {
        if(teamUserList.find(u => u.id === user.id) != undefined)
        {
            return true
        }
        else 
        {
            return false
        }
    }
    async UpdateTeam() 
    {
        let checkboxes = document.getElementsByClassName("teamcheckbox") as HTMLCollectionOf<HTMLInputElement>
        let userList:string[] = []
        for(let checkbox of checkboxes)
        {
            if(checkbox.checked)
            {
                userList.push(checkbox.value)
            }
        }
        let updateTeam = {Id: this.updateTeamForm.value.id||"", name: this.updateTeamForm.value.name||"" , userIds: userList}
        this.postRequestStatus = (await this.connectionService.postItem(api_endpoints.UpdateTeam,updateTeam)) as iPostRequestStatus
    }
//************ Client ************* */
    async OpenClientModal(id: string)
    {
        this.ClearResponseStatus()
        let client = await this.connectionService.getItems(api_endpoints.UpdateClient.concat(id)) as iGetClientsForUser
        this.updateClientForm.controls.id.setValue(client.id);
        this.updateClientForm.controls.name.setValue(client.name);
        ($('#EditClientModal')as any).modal('show');
    }

    async UpdateClient()
    {
        this.postRequestStatus = await this.connectionService.postItem(api_endpoints.UpdateClient,{id: this.updateClientForm.value.id||"", name: this.updateClientForm.value.name||""})
    }

//************User********** */
    async OpenUserModal(id: string)
    {
        this.ClearResponseStatus()
        await Promise.allSettled([
            this.connectionService.getItems(api_endpoints.getAllClientTeamMappings),
            this.connectionService.getItems(api_endpoints.UpdateUser.concat(id)) 
        ]).then(resolve => {
            if(resolve[0].status == 'fulfilled' && resolve[1].status == 'fulfilled')
            {
                this.getAllClienatTeamPairs = resolve[0].value as iClientTeamMapping[]
                this.updateUserobj = resolve[1].value as iUpdateUser
            }
        })
        this.updateUserForm.controls.id.setValue(this.updateUserobj.id);
        this.updateUserForm.controls.username.setValue(this.updateUserobj.username);
        this.updateUserForm.controls.email.setValue(this.updateUserobj.email);
        this.updateUserForm.controls.firstname.setValue(this.updateUserobj.firstname);
        this.updateUserForm.controls.lastname.setValue(this.updateUserobj.lastname);
        ($('#EditUserModal')as any).modal('show');
    }

    FindClientTeamMapping(ctmlist: iClientTeamMapping[], mapping: iClientTeamMapping)
    {
        if(ctmlist.find(ctm => ctm.clientid === mapping.clientid && ctm.teamid === mapping.teamid) != undefined)
        {
            return true
        }
        else
        {
            return false
        }
    }

    async UpdateUser()
    {

        let updatedUser: iPostUpdateUser = {
            id: this.updateUserForm.value.id||"",
            username: this.updateUserForm.value.username||"",
            firstname: this.updateUserForm.value.firstname||"",
            lastname: this.updateUserForm.value.lastname||"",
            email: this.updateUserForm.value.email||"",
            clientTeamPairs: []
        }
        let checkboxes = document.getElementsByClassName("clientteammapping") as HTMLCollectionOf<HTMLInputElement>
        for(let checkbox of checkboxes)
        {
            if(checkbox.checked)
            {
                updatedUser.clientTeamPairs?.push(JSON.parse(checkbox.value))
            }
        }
        this.postRequestStatus = await this.connectionService.postItem(api_endpoints.UpdateUser,updatedUser) as iPostRequestStatus
    }
//************User********** */

    DeleteModal(itemid: string,itemname: string, itemtype: string)
    {
        this.ClearResponseStatus()
        this.deleteItemId = itemid;
        this.deleteItemName = itemname;
        this.deleteItemtype = itemtype;
        switch(itemtype)
        {
            case "team":
                this.warningMessage = "Deleting the Team will result in deleting all credentials and certificates that belong to the Team"
                break;
            case "client":
                this.warningMessage = "Deleting the Clinet will result in deleting all teams, credentials and certificates that belong to the Client"
                break;
            case "user":
                this.warningMessage = null;
                break;
        }
        ($('#DeleteModal') as any).modal('show')

    }

    async DeleteVerificationCode(_id: string,_type: string)
    {
        this.connectionService.postItem(api_endpoints.DeleteRequest,{id: _id, type: _type})
        
    }

    async DeleteItem(_id: string,type: string)
    {
        switch(type)
        {
            case 'client':
                this.postRequestStatus.status = ""
                this.postRequestStatus = await this.connectionService.DeleteItem(api_endpoints.DeleteClient,{id: _id, verificationCode: this.deleteItemForm.value.verificationcode}) as iPostRequestStatus
                this.deleteItemForm.controls.verificationcode.setValue(null)
                break;
            case 'team':
                this.postRequestStatus.status=""
                this.postRequestStatus = await this.connectionService.DeleteItem(api_endpoints.DeleteTeam,{id: _id, verificationCode: this.deleteItemForm.value.verificationcode}) as iPostRequestStatus
                this.deleteItemForm.controls.verificationcode.setValue(null)
                break;
            case 'user':
                this.postRequestStatus.status = ""
                this.postRequestStatus = await this.connectionService.DeleteItem(api_endpoints.DeleteUser,{id: _id, verificationCode: this.deleteItemForm.value.verificationcode}) as iPostRequestStatus
                this.deleteItemForm.controls.verificationcode.setValue(null)
                break;
        }

    
    }

    GetUserId()
    {
        return this.jwtService.GetUserId(sessionStorage.getItem("jwt")||"")
    }

//*****************Search by String ************** */
}