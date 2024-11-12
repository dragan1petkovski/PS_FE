import {  inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,  CanActivateFn,  RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router'


export const canActivateAdministrator: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    if(inject(JwtService).GetRole((sessionStorage.getItem("jwt")||"").toString()) === "Administrator")
    {
        return true
    }
    else
    {
        inject(Router).navigate(["/"])
        return false
    }
  };

export const canActivateUser: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    if(inject(JwtService).GetRole((sessionStorage.getItem("jwt")||"").toString()) === "User")
    {
        return true
    }
    else
    {
        inject(Router).navigate(["/"])
        return false
    }
  };