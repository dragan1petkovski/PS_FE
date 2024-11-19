// app-signalr.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { iUserRegister } from '../interfaces/SignalR/UserRegister';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost/datasync', { accessTokenFactory: () => sessionStorage.getItem("jwt")||"" }) // SignalR hub URL
      .build();
  }

  async StartConnection()
  {
    await this.hubConnection.start().then(() => console.log("Connection Succeded"))
  }

  async CloseConnection()
  {
    console.log("Closing Connection")
    await this.hubConnection.stop();
  }

  async GetNotification(fn: (message: string) => void)
  {
    this.hubConnection.on("Notification",fn);
  }

  async GetAdminNotification(fn: (message: string) => void)
  {
    this.hubConnection.on("AdminNotification",fn);
  }

  RegisterUserLocation(registration: string)
  {
    console.log(registration)
    this.hubConnection.invoke('RegisterUserLocation',registration)
  }

  RegisterAdminLocation(registration: string)
  {
    console.log(registration)
    this.hubConnection.invoke('RegisterAdminLocation',registration)
  }

  SendMessage(message: string): void {
    this.hubConnection.invoke('SendMessage', message);
  }


  GetTest(fn: (message: string) => void)
  {
    this.hubConnection.on("Test",fn)
  }
}