import { Component,Output,Input, EventEmitter } from "@angular/core";
import { NgFor,NgIf } from "@angular/common";
import { iGetCertificate } from "../../interfaces/Certificate/certificate";
import { iSelectTabTabs } from "../../interfaces/relationshipInterfaces/SelectNavTabs";
import { api_endpoints } from "../../StaticObjects/api_endpoints";
import { iDataRequest } from "../../interfaces/relationshipInterfaces/CredClientRelation";
import { SignalRService } from "../../SignalR/signalR";
import { JwtService } from "../../utility/jwt.service";
import { iUserRegister } from "../../interfaces/SignalR/UserRegister";

@Component({
    selector: 'navMenuBody',
    templateUrl: './navMenuBody.component.html',
    standalone: true,
    imports: [NgFor, NgIf],
    providers:[api_endpoints]
    
})
export class navMenuBody {
    @Input() signalR: SignalRService = new SignalRService;
    @Input() companyItems:any[] = []
    @Input() certItems:iGetCertificate[] = []
    @Input() selectTab: iSelectTabTabs = {credentialsTab: true, certificatesTab: false, privateTab: false}
    @Output() dataRequest = new EventEmitter<iDataRequest>()

    constructor(private signalr: SignalRService){}

    ChangeCredentialList(id: string)
    {
        let datarequest: iDataRequest = {clientid: id,type: "credential"}
        
        //this.ActiveBtn(id)
        this.dataRequest.emit(datarequest)
        
    }

    ChangeCertificateList(id: string)
    {
        let datarequest: iDataRequest = {clientid: id,type: "certificate"}
        //this.ActiveBtn(id)
        this.dataRequest.emit(datarequest)
        
    }

    ChnagePersonalCredentialList(folderid: string)
    {
        let datarequest: iDataRequest = {clientid: folderid,type: "personal"}
        //this.ActiveBtn(folderid)
        this.dataRequest.emit(datarequest)
    }

    // ActiveBtn(id: string)
    // {
    //     let companies = document.getElementsByClassName('navbodybtns') as HTMLCollectionOf<HTMLButtonElement>
    //     for(let temp of companies)
    //     {
    //         let company = temp as HTMLButtonElement
    //         $(`#${company.id}`).removeClass('active')
    //     }
    //     $(`#${id}`).addClass('active')
    // }
}
