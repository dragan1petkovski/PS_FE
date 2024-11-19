import { Component,Output, EventEmitter,Input } from "@angular/core";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { NgIf } from "@angular/common";
import { SignalRService } from "../../SignalR/signalR";
import { JwtService } from "../../utility/jwt.service";


@Component({
    selector: 'navMenuHeader',
    templateUrl: './navMenuHeader.component.html',
    standalone: true,
    imports: [NgIf],
    providers: [SignalRService]
    
})
export class navMenuHeader {
    
    @Input() signalR: SignalRService = new SignalRService()
    @Output() getSelectTab = new EventEmitter<iSelectTabTabs>()
    @Output() getIfDataExit = new EventEmitter<string>()
    constructor(private jwtService: JwtService){}

    async GetCertificatesTab()
    {
        let selectTab: iSelectTabTabs = {certificatesTab: true, credentialsTab: false, privateTab: false}
        this.getSelectTab.emit(selectTab)
    }

    async GetCredentialsTab()
    {
        let selectTab: iSelectTabTabs = {certificatesTab: false, credentialsTab: true, privateTab: false}
        this.getSelectTab.emit(selectTab)
    }

    async GetPersonalTab()
    {
        let selectTab: iSelectTabTabs = {certificatesTab: false, credentialsTab: false, privateTab: true}
        this.getSelectTab.emit(selectTab)
    }

    GetIfDataExit(id: string)
    {
        this.getIfDataExit.emit(id)
    }

}