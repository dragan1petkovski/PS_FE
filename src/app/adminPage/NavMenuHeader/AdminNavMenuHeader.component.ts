import { Component } from "@angular/core"
import { ReactiveFormsModule, FormControl, FormGroup, RequiredValidator, FormArray, Validators } from '@angular/forms';
import { iPOstStatus } from "../../interfaces/postStatus";
import { iPostClient } from "../../interfaces/Client";
import { ConnectionService} from "../../utility/connection.service"
import { api_endpoints } from "../../api_endpoints";

@Component({
    standalone: true,
    selector: "AdminNavMenuHeader",
    templateUrl: "./AdminNavMenuHeader.component.html",
    imports: [ReactiveFormsModule]
})
export class AdminNavMenuHeaderComponent
{
    postStatus: iPOstStatus = {status: ""}
    AddClientFormGroup = new FormGroup({
        name: new FormControl('',[Validators.required])
    })


    constructor (private connectionService: ConnectionService) {}
    async AddClient()
    {
        let newClient: iPostClient = { name: this.AddClientFormGroup.value.name}
        this.postStatus = (await this.connectionService.postItem(api_endpoints.AddClient,newClient)) as iPOstStatus
    }
}