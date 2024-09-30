import { Component } from "@angular/core";
import { AdminWorkAreaHeaderComponent } from "./WorkAreaHeader/AdminWorkAreaHeader.component"
import { NavMenuHeaderComponent } from "./NavMenuBody/AdminNavMenuBody.component";
import { AdminNavMenuHeaderComponent } from "./NavMenuHeader/AdminNavMenuHeader.component";
import { AdminpageBodyComponent } from "./WorkAreaBody/AdminpageBody.component"
import { iSelectAdminTabs } from "../interfaces/relationshipInterfaces/SelectNavTabs";
import { iAdminTableData } from "../interfaces/AdminPage/adminTableData";
import { ConnectionService } from "../utility/connection.service"
import { api_endpoints } from "../StaticObjects/api_endpoints";
import { iGetClientsForAdminPage } from "../interfaces/Client/Client";
import { iGetUserForAdminPage } from "../interfaces/User/User";
import { iGetTeamForAdminPage } from "../interfaces/Team/Team";


@Component({
    standalone: true,
    selector: "admin-page",
    templateUrl: "./AdminPage.component.html",
    imports: [AdminWorkAreaHeaderComponent, NavMenuHeaderComponent,AdminNavMenuHeaderComponent, AdminpageBodyComponent],
    providers: [ConnectionService]
})
export class AdminageComponent{
    selectTab: iSelectAdminTabs = { clientTab: true, userTab: false, teamTab: false}
    workAreaBodyTable: iAdminTableData = {clients:[],users:[],teams:[]}
    unfilteredWorkAreaBodytable: iAdminTableData = {clients:[],users:[],teams:[]}

    constructor(private connectionService: ConnectionService) {}

    async ngOnInit()
    {
        await this.GetWorkAreaBodyTable(api_endpoints.GetAllFullClients)
    }

    async getItems(url: string)
    {
        let json = await this.connectionService.getItems(url)
        return json
    }

    async GetWorkAreaBodyTable(url: string)
    {
        if(url == api_endpoints.GetAllFullClients)
        {
            this.unfilteredWorkAreaBodytable.clients = (await this.getItems(url)) as iGetClientsForAdminPage[]
            this.workAreaBodyTable.clients = this.unfilteredWorkAreaBodytable.clients
        }
        else if( url == api_endpoints.GetAllFullUsers)
        {
            this.unfilteredWorkAreaBodytable.users = (await this.getItems(url)) as iGetUserForAdminPage[]
            this.workAreaBodyTable.users = this.unfilteredWorkAreaBodytable.users

        }
        else if( url == api_endpoints.getAllTeams)
        {
            this.unfilteredWorkAreaBodytable.teams = (await this.getItems(url)) as iGetTeamForAdminPage[]
            this.workAreaBodyTable.teams = this.unfilteredWorkAreaBodytable.teams
        }
    }

    GetCurrentlySelectedTab(currentSelectedTab: iSelectAdminTabs)
    {
        this.selectTab = currentSelectedTab
    }

    SetSreachString(search: string)
    {
        if(this.selectTab.clientTab && !this.selectTab.teamTab && !this.selectTab.userTab)
        {
            this.workAreaBodyTable.clients = this.unfilteredWorkAreaBodytable.clients.filter(t => t.name.includes(search))
        }
        else if(!this.selectTab.clientTab && this.selectTab.teamTab && !this.selectTab.userTab)
        {
            this.workAreaBodyTable.teams = this.unfilteredWorkAreaBodytable.teams.filter(t => t.name.includes(search) || t.clientname.includes(search))
        }
        else if(!this.selectTab.clientTab && !this.selectTab.teamTab && this.selectTab.userTab)
        {
            this.workAreaBodyTable.users = this.unfilteredWorkAreaBodytable.users.filter(t => t.username.includes(search) || t.firstname.includes(search) || t.lastname.includes(search) || t.email.includes(search))
        }
    }
}