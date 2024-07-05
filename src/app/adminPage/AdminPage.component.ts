import { Component } from "@angular/core";
import { AdminpageHeader } from "./WorkAreaHeader/AdminpageHeader.component"
import { NavMenuHeaderComponent } from "./NavMenuBody/AdminNavMenuBody.component";
import { AdminNavMenuHeaderComponent } from "./NavMenuHeader/AdminNavMenuHeader.component";
import { AdminpageBodyComponent } from "./WorkAreaBody/AdminpageBody.component"
import { iSelectAdminTabs } from "../interfaces/relationshipInterfaces/SelectNavTabs";
import { iAdminTableData } from "../interfaces/adminTableData";
import { ConnectionService } from "../utility/connection.service"
import { iUser } from "../interfaces/user";
import { api_endpoints } from "../api_endpoints";
import { iClient } from "../interfaces/Client";
import { iTeam } from "../interfaces/Team";


@Component({
    standalone: true,
    selector: "admin-page",
    templateUrl: "./AdminPage.component.html",
    imports: [AdminpageHeader, NavMenuHeaderComponent,AdminNavMenuHeaderComponent, AdminpageBodyComponent],
    providers: [ConnectionService]
})
export class AdminageComponent{
    selectTab: iSelectAdminTabs = { clientTab: true, userTab: false, teamTab: false}
    workAreaBodyTable: iAdminTableData = {clients:[],users:[],teams:[]}
    
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
            this.workAreaBodyTable.clients = (await this.getItems(url)) as iClient[]
        }
        else if( url == api_endpoints.GetAllFullUsers)
        {
            this.workAreaBodyTable.users = (await this.getItems(url)) as iUser[]
        }
        else if( url == api_endpoints.getAllTeams)
        {
            this.workAreaBodyTable.teams = (await this.getItems(url)) as iTeam[]
        }
    }

    GetCurrentlySelectedTab(currentSelectedTab: iSelectAdminTabs)
    {
        this.selectTab = currentSelectedTab
    }
}