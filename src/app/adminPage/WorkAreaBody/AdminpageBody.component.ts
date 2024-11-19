import { Component } from "@angular/core"
import { Input } from "@angular/core"
import { iSelectAdminTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs"
import { iAdminTableData } from "../../interfaces/AdminPage/adminTableData"
import { CommonModule, NgFor,NgIf } from "@angular/common";
import { iClientTeamMapping, iGetUpdateTeam } from "../../interfaces/Team/Team";
import { ConnectionService } from "../../utility/connection.service"
import { api_endpoints } from "../../StaticObjects/api_endpoints"
import { iUpdateUser,iGetUserForTeamModal,iPostUpdateUser } from "../../interfaces/User/User";
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtService } from "../../utility/jwt.service";
import { iGetClientsForUser } from "../../interfaces/Client/Client"

import { iStatusMessage,iStatus,StatusMessage } from "../../utility/iStatusMessage";
import { ValidationMessages } from "../../StaticObjects/ValidationMessages"
import { SignalRService } from "../../SignalR/signalR";

declare var bootstrap: any

@Component({
    standalone: true,
    templateUrl: "./AdminpageBody.component.html",
    selector: "AdminpageBody",
    imports: [NgFor,NgIf,ReactiveFormsModule,CommonModule],
})
export class AdminpageBodyComponent
{

    constructor(private connectionService: ConnectionService, private jwtService: JwtService, public validationMessage: ValidationMessages, private statusMessage: StatusMessage,private signalr: SignalRService) {}

    @Input() currentSelectedTab: iSelectAdminTabs = {clientTab: true, userTab: false, teamTab: false}
    @Input() tableData: iAdminTableData = {clients:[],users:[],teams:[]}
    @Input() searchParameter: string = ""

    RequestStatus: iStatusMessage = {status: "", statusMessage: ""}
    
    ClearResponseStatus = () => this.RequestStatus.status = ""
    
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


    ngOnInit()
    {
        this.signalr.GetAdminNotification((message) =>{
            let notification = JSON.parse(message)
            console.log(notification)
            switch(notification.type)
            {
                case 'client':
                    switch(notification.status)
                    {
                        case 'new':
                            this.tableData.clients.push(notification.data)
                            break;
                        case 'update':
                            let index = this.tableData.clients.findIndex(c => c.id == notification.data.id) - 1
                            this.tableData.clients[index] = notification.data
                            break;
                        case 'delete':
                            this.tableData.clients = this.tableData.clients.filter(c => c.id != notification.data)
                            break;
                    }
                    break;
                case 'team':
                    switch(notification.status)
                    {
                        case 'new':
                            this.tableData.teams.push(notification.data)
                            break;
                        case 'update':
                            let index = this.tableData.teams.findIndex(c => c.id == notification.data.id) - 1
                            this.tableData.teams[index] = notification.data
                            break;
                        case 'delete':
                            this.tableData.teams = this.tableData.teams.filter(c => c.id != notification.data)
                            break;
                    }
                    break;
                case 'user':
                    switch(notification.status)
                    {
                        case 'new':
                            this.tableData.users.push(notification.data)
                            break;
                        case 'update':
                            let index = this.tableData.users.findIndex(c => c.id == notification.data.id) - 1
                            this.tableData.users[index] = notification.data
                            break;
                        case 'delete':
                            this.tableData.users = this.tableData.users.filter(c => c.id != notification.data)
                            break;
                    }
                    break;
            }
        })
    }

//************ Team ************/
    allUserList: iGetUserForTeamModal[] = []
    getUpdateTeam: iGetUpdateTeam = {id: "",name: "", users: []}
    teamUserList: iGetUserForTeamModal[] = []
    async OpenTeamModal(id: string)
    {
        this.ClearResponseStatus()
        await Promise.allSettled([
            this.connectionService.GET(api_endpoints.user),
            this.connectionService.GET(api_endpoints.team.concat(id))
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
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.PUT(api_endpoints.team,updateTeam) as iStatus)
    }
//************ Client ************* */
    async OpenClientModal(id: string)
    {
        this.ClearResponseStatus()
        let client = await this.connectionService.GET(api_endpoints.client.concat("full/",id)) as iGetClientsForUser
        this.updateClientForm.controls.id.setValue(client.id);
        this.updateClientForm.controls.name.setValue(client.name);
        ($('#EditClientModal')as any).modal('show');
    }

    async UpdateClient()
    {
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.PUT(api_endpoints.client,{id: this.updateClientForm.value.id||"", name: this.updateClientForm.value.name||""}) as iStatus)
    }

//************User********** */
    async OpenUserModal(id: string)
    {
        this.ClearResponseStatus()
        await Promise.allSettled([
            this.connectionService.GET(api_endpoints.getteammapping.concat("all")),
            this.connectionService.GET(api_endpoints.user.concat(`/all/${id}`)) 
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
        this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.PUT(api_endpoints.user,updatedUser) as iStatus)
    }

    async UserPasswordReset(id: string)
    {

        let temp = await this.statusMessage.GetResponse(await this.connectionService.PUT(api_endpoints.resetPassword.concat(id),null) as iStatus)
        if(temp.status === "OK")
        {
         
            let info = document.getElementById("info-Success")
            bootstrap.Toast.getOrCreateInstance(info).show()
        }
        else
        {
            let info = document.getElementById("info-Failed")
            bootstrap.Toast.getOrCreateInstance(info).show()
        }
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
        this.connectionService.POST(api_endpoints.deleteverificateionrequest,{id: _id, type: _type})
        
    }

    async DeleteItem(_id: string,type: string)
    {
        switch(type)
        {
            case 'client':
                this.RequestStatus.status = ""
                this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.DELETE(api_endpoints.client.concat(_id,`/${this.deleteItemForm.value.verificationcode}`)) as iStatus)
                this.deleteItemForm.controls.verificationcode.setValue(null)
                break;
            case 'team':
                this.RequestStatus.status=""
                this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.DELETE(api_endpoints.team.concat(_id,`/${this.deleteItemForm.value.verificationcode}`)) as iStatus)
                this.deleteItemForm.controls.verificationcode.setValue(null)
                break;
            case 'user':
                this.RequestStatus.status = ""
                this.RequestStatus = await this.statusMessage.GetResponse(await this.connectionService.DELETE(api_endpoints.user.concat(`/${_id}`,`/${this.deleteItemForm.value.verificationcode}`)) as iStatus)
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