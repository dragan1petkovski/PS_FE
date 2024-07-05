import { Component } from "@angular/core"
import { Input } from "@angular/core"
import { iSelectAdminTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs"
import { iAdminTableData } from "../../interfaces/adminTableData"
import { NgFor,NgIf } from "@angular/common";

@Component({
    standalone: true,
    templateUrl: "./AdminpageBody.component.html",
    selector: "AdminpageBody",
    imports: [NgFor,NgIf]
})
export class AdminpageBodyComponent
{
    @Input() currentSelectedTab: iSelectAdminTabs = {clientTab: true, userTab: false, teamTab: false}
    @Input() tableData: iAdminTableData = {clients:[],users:[],teams:[]}
    itemid: string =''
    itemname: string = ''
    itemtype: string =''

    OpenTeamModal(id: string)
    {
        
        ($('#EditTeamModal')as any).modal('show');
        this.itemid = id
    }

    OpenClientModal(id: string)
    {
        
        ($('#EditClientModal')as any).modal('show');
        this.itemid = id
    }

    OpenUserModal(id: string)
    {
        
        ($('#EditUserModal')as any).modal('show');
        this.itemid = id
    }

    DeleteModal(itemid: string,itemname: string, itemtype: string)
    {
        this.itemid = itemid;
        this.itemname = itemname;
        this.itemtype = itemtype;
        ($('#DeleteModal') as any).modal('show')

    }

    DeleteItem(id: string,type: string)
    {
        if(type === 'client')
        {
            console.log(`successfully deleted ${type} - ${id}`)
        }
        else if(type === 'team')
        {
            console.log(`successfully deleted ${type} - ${id}`)
        }
        else if(type === 'user')
        {
            console.log(`successfully delete ${type} - ${id}`)
        }
    
    }
}