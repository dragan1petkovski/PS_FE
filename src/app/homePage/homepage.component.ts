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
import { SignalRService } from '../SignalR/signalR';
import { iOriginalNavData} from '../interfaces/HomePage/HomePage'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './homepage.component.html',
  imports: [navMenuBody,navMenuHeader,WorkAreaBody,WorkAreaHeader],
  providers: [ConnectionService,JwtService, SignalRService]

})



export class HomepageComponent  {
  title = 'Password Sense';
  navMenuBodyItems:any[] = [];
  credentialList: iGetCredential[] =[];
  certificateList: iGetCertificate[] = [];
  personalcredentialList: iGetPersonalCredentials[] = []
  originalNavdata: iOriginalNavData = {type: "", data: []};
  unfilteredcredentialList: iGetCredential[] = [];
  unfilteredcertificateList: iGetCertificate[] = [];
  unfilteredpersonalcredentialList: iGetPersonalCredentials[] = []

  clientIDforfetchingData: string = ""
  selectTab: iSelectTabTabs = {credentialsTab:false, certificatesTab: false, privateTab: false}
  constructor(private connectionService: ConnectionService, private jwtService: JwtService, private signalr: SignalRService) {
  }

  async ngOnInit()
  {
    await this.signalr.StartConnection()
    let body = document.getElementById("body")
    if(body?.getAttribute("style") == null)
      {
        body?.setAttribute("style","background-image: url('/assets/Background.png'); opacity: 0.9;")
      }
    this.selectTab = {credentialsTab:true, certificatesTab: false, privateTab: false}
    this.GetNavBodydata(this.selectTab);
  }

  ReturnSignalR()
  {
    return this.signalr
  }

  async GetNavBodydata(selectedTab: iSelectTabTabs)
  {
    if(selectedTab.credentialsTab)
    {
      this.selectTab = selectedTab
      this.navMenuBodyItems = (await this.connectionService.GET(api_endpoints.clientcredential)) as iGetClientsForUser[]
      this.originalNavdata = {type: "credential", data: this.navMenuBodyItems}
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
      this.navMenuBodyItems = (await this.connectionService.GET(api_endpoints.clientcertificate)) as iGetClientsForUser[]
      this.originalNavdata = {type: "certificate", data: this.navMenuBodyItems}
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
      this.navMenuBodyItems = (await this.connectionService.GET(api_endpoints.personalfolder)) as iPersonalFolder[]
      this.originalNavdata = {type: "personal", data: this.navMenuBodyItems}
      this.GetData({clientid: "", type: "personal"})

    }
  }

  EmptyNavBodyData()
  {
    this.navMenuBodyItems = []
  }

  ExistingNavBodyData(id: string)
  {
    this.navMenuBodyItems = this.originalNavdata.type === id?this.originalNavdata.data:[]
  }

  async GetData(dataRequest: iDataRequest)
  {
    switch (dataRequest.type)
    {
      case "credential":
        this.unfilteredcredentialList = (await this.connectionService.GET(api_endpoints.credential.concat(`?cid=${dataRequest.clientid}`))) as iGetCredential[]
        this.credentialList = this.unfilteredcredentialList
        this.signalr.RegisterUserLocation(JSON.stringify({groups: this.UniqueList(this.unfilteredcredentialList.map(c => c.teamid)),type: "credential"}))
        break;
      case "certificate":
        this.unfilteredcertificateList = (await this.connectionService.GET(api_endpoints.certificate.concat(dataRequest.clientid))) as iGetCertificate[]
        this.certificateList = this.unfilteredcertificateList
        this.signalr.RegisterUserLocation(JSON.stringify({groups: this.UniqueList(this.unfilteredcertificateList.map(c => c.teamid)),type: "certificate"}))
        break;
      case "personal":
        if(dataRequest.clientid == "")
        {
          this.unfilteredpersonalcredentialList = (await this.connectionService.GET(api_endpoints.personalcredential)) as iGetPersonalCredentials[]
          this.personalcredentialList = this.unfilteredpersonalcredentialList
          let userid = sessionStorage.getItem("jwt")
          if(userid == null)
          {
            break;
          }
          this.signalr.RegisterUserLocation(JSON.stringify({groups: [this.jwtService.GetUserId(userid)],type: "personal"}))
          break;
        }
        else
        {
          this.unfilteredpersonalcredentialList = (await this.connectionService.GET(api_endpoints.personalcredential.concat("?pfid=",dataRequest.clientid))) as iGetPersonalCredentials[]
          this.personalcredentialList = this.unfilteredpersonalcredentialList
          this.signalr.RegisterUserLocation(JSON.stringify({groups: [dataRequest.clientid],type: "personal"}))
          break;
        }

      default:
        break;
    }
  }

  UniqueList(itemlist: string[])
  {
    let uniqueList: string[] =[]
    for(let item of itemlist)
    {

      if(uniqueList.findIndex(i => i === item) === -1)
      {
        uniqueList.push(item)
      }
    }
    return uniqueList;
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
