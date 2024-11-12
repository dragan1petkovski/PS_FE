import { Component, EventEmitter } from "@angular/core"
import { Output } from "@angular/core"
import { api_endpoints } from '../../StaticObjects/api_endpoints'

@Component({
    standalone: true,
    selector: "NavMenu",
    templateUrl: "./AdminNavMenuBody.component.html",
})
export class NavMenuHeaderComponent
{
    @Output() apiEndpoint = new EventEmitter()
    @Output() currentSelectTab = new EventEmitter()

    GetAllClients()
    {
        this.apiEndpoint.emit(api_endpoints.fullclient)
        this.currentSelectTab.emit({ clientTab: true, userTab: false, teamTab: false})
        $('#getallClientsBtn').addClass('active')
        $('#getallTeamsBtn').removeClass('active')
        $('#getallUsersBtn').removeClass('active')
    }
    
    GetAllUsers()
    {
        this.apiEndpoint.emit(api_endpoints.user.concat("/all"))
        this.currentSelectTab.emit({ clientTab: false, userTab: true, teamTab: false})
        $('#getallClientsBtn').removeClass('active')
        $('#getallTeamsBtn').removeClass('active')
        $('#getallUsersBtn').addClass('active')
    }

    GetAllTeams()
    {
        this.apiEndpoint.emit(api_endpoints.team)
        this.currentSelectTab.emit({ clientTab: false, userTab: false, teamTab: true})
        $('#getallClientsBtn').removeClass('active')
        $('#getallTeamsBtn').addClass('active')
        $('#getallUsersBtn').removeClass('active')
    }
}