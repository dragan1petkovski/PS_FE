import { Component,Output, EventEmitter,Input } from "@angular/core";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { NgIf } from "@angular/common";

@Component({
    selector: 'navMenuHeader',
    templateUrl: './navMenuHeader.component.html',
    standalone: true,
    imports: [NgIf]
    
})
export class navMenuHeader {
    
    @Output() getSelectTab = new EventEmitter<iSelectTabTabs>()

    GetCertificatesTab()
    {
        let selectTab: iSelectTabTabs = {certificatesTab: true, credentialsTab: false, privateTab: false}
        this.getSelectTab.emit(selectTab)
    }

    GetCredentialsTab()
    {
        let selectTab: iSelectTabTabs = {certificatesTab: false, credentialsTab: true, privateTab: false}
        this.getSelectTab.emit(selectTab)
    }

    GetPersonalTab()
    {
        let selectTab: iSelectTabTabs = {certificatesTab: false, credentialsTab: false, privateTab: true}
        this.getSelectTab.emit(selectTab)
    }

}