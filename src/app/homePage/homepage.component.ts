import { Component, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { navMenuBody } from './navMenuBody/navMenuBody.component';
import { navMenuHeader } from './navMenuHeader/navMenuHeader.component';
import { WorkAreaBody } from './workAreaBody/workAreaBody.component';
import { WorkAreaHeader } from './workAreaHeader/workAreaHeader.component';
import { ConnectionService } from '../utility/connection.service'

import { iGetCredential,iGetPersonalCredentials } from '../interfaces/Credential/credential';
import { iSelectTabTabs } from '../interfaces/relationshipInterfaces/SelectNavTabs';
import { iGetCertificate } from '../interfaces/Certificate/certificate';
import { api_endpoints } from '../StaticObjects/api_endpoints'
import { iPersonalFolder } from '../interfaces/Credential/PersonalFolder';
import { JwtService } from '../utility/jwt.service';
import { iGetClientsForUser } from '../interfaces/Client/Client';
import { iDataRequest } from '../interfaces/relationshipInterfaces/CredClientRelation';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './homepage.component.html',
  imports: [navMenuBody,navMenuHeader,WorkAreaBody,WorkAreaHeader],
  providers: [ConnectionService,JwtService]

})



export class HomepageComponent  {
  title = 'Password Sense';
  navMenuBodyItems:any[] = [];
  credentialList: iGetCredential[] =[];
  certificateList: iGetCertificate[] = [];
  personalcredentialList: iGetPersonalCredentials[] = []
  unfilteredcredentialList: iGetCredential[] = [];
  unfilteredcertificateList: iGetCertificate[] = [];
  unfilteredpersonalcredentialList: iGetPersonalCredentials[] = []

  clientIDforfetchingData: string = ""
  selectTab: iSelectTabTabs = {credentialsTab:false, certificatesTab: false, privateTab: false}
  constructor(private connectionService: ConnectionService, private jwtService: JwtService) {
  }

  async ngOnInit()
  {
    let body = document.getElementById("body")
    if(body?.getAttribute("style") == null)
      {
        body?.setAttribute("style","background-image: url('/assets/Background.png'); opacity: 0.9;")
      }
    this.selectTab = {credentialsTab:true, certificatesTab: false, privateTab: false}
    this.GetNavBodydata(this.selectTab);
  }

  async GetNavBodydata(selectedTab: iSelectTabTabs)
  {
    if(selectedTab.credentialsTab)
    {
      this.selectTab = selectedTab
      this.navMenuBodyItems = (await this.connectionService.getItems(api_endpoints.GetCredentialClientsByUserId)) as iGetClientsForUser[]
      if(this.navMenuBodyItems.length >0)
      {
        this.GetData({clientid: this.navMenuBodyItems[0].id,type: "credential"})
      }
      else
      {
        this.credentialList =[]
      }
      
    }
    if(selectedTab.certificatesTab)
    {
      this.selectTab = selectedTab
      this.navMenuBodyItems = (await this.connectionService.getItems(api_endpoints.GetCertificateClientsByUserId)) as iGetClientsForUser[]
      if(this.navMenuBodyItems.length > 0)
      {
        this.GetData({clientid: this.navMenuBodyItems[0].id,type: "certificate"})
      }
      else
      {
        this.certificateList = []
      }
      
    }
    if(selectedTab.privateTab)
    {
      this.selectTab = selectedTab
      this.navMenuBodyItems = (await this.connectionService.getItems(api_endpoints.getPersonalCredentialsFoldersByUserID)) as iPersonalFolder[]
      this.GetData({clientid: "", type: "personal"})

    }
  }

  EmptyNavBodyData()
  {
    this.navMenuBodyItems = []
  }

  async GetData(dataRequest: iDataRequest)
  {
    switch (dataRequest.type)
    {
      case "credential":
        this.unfilteredcredentialList = (await this.connectionService.getItems(api_endpoints.GetCredentialByClientID.concat(dataRequest.clientid))) as iGetCredential[]
        this.credentialList = this.unfilteredcredentialList
        break;
      case "certificate":
        this.unfilteredcertificateList = (await this.connectionService.getItems(api_endpoints.getCertificateByClientID.concat(dataRequest.clientid))) as iGetCertificate[]
        this.certificateList = this.unfilteredcertificateList
        break;
      case "personal":
        this.unfilteredpersonalcredentialList = (await this.connectionService.getItems(api_endpoints.GetCredentialsByFoderId.concat(dataRequest.clientid))) as iGetPersonalCredentials[]
        this.personalcredentialList = this.unfilteredpersonalcredentialList
        break;
      default:
        break;
    }
  }

  SetSreachString(search: string)
  {
    if(this.selectTab.credentialsTab && !this.selectTab.certificatesTab && !this.selectTab.privateTab)
      {
        this.credentialList = this.unfilteredcredentialList.filter(c => c.domain?.includes(search) || c.email?.includes(search) || c.username.includes(search) || c.remote?.includes(search) || c.teamname.includes(search) || c.note?.includes(search))
      }
      else if(!this.selectTab.credentialsTab && this.selectTab.certificatesTab && !this.selectTab.privateTab)
      {
        this.certificateList = this.unfilteredcertificateList.filter(c => c.friendlyname.includes(search)|| c.teamname.includes(search) || c.name.includes(search) || c.issuedto.includes(search))
      }
      else if(!this.selectTab.credentialsTab && !this.selectTab.certificatesTab && this.selectTab.privateTab)
      {
        this.personalcredentialList = this.unfilteredpersonalcredentialList.filter(c => c.domain?.includes(search) || c.email?.includes(search) || c.username.includes(search) || c.remote?.includes(search) || c.note?.includes(search))
      }
  }

}
