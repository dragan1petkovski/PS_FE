import { iClientTeamMapping, iTeamClientPar } from '../Team/Team'

export interface iGetCredential 
{
  id: string,
  domain: string | null,
  username: string,
  email:string | null,
  remote: string | null,
  password: string,
  note: string | null,
  teamname: string,
  teamid: string
}

export interface iPostCredential
{
    domain: string,
    username: string,
    password: string,
    email: string,
    remoteLocation: string,
    give: boolean,
    personal: boolean,
    client: string,
    team: string

}

export interface iPostGiveCredential
{
    domain: string | null | undefined,
    username: string | null | undefined,
    password: string | null | undefined,
    email: string | null | undefined,
    remote: string | null | undefined,
    note: string | null | undefined,
    teamids: string[] | null | undefined,
    userids: string[] | null | undefined
}

export interface iPostCredential 
{
  domain: string,
  username: string,
  remote: string,
  password: string,
  note: string,
  teams: iTeamClientPar[]
}

export interface iPostPersonalCredential 
{
  domain: string,
  username: string,
  remote: string,
  password: string,
  note: string,
  personalFolderId: string | null
}

export interface iDeleteCredential
{
    teamid: string,
    id: string
}

export interface iPostUpdateCredential
{
  id: string,
  domain: string | null,
  username: string,
  email:string | null,
  remote: string | null,
  password: string,
  note: string | null,
  teamid: string | null
}

export interface iPostUpdatePersonalCredential
{
  id: string,
  domain: string | null,
  username: string,
  email:string | null,
  remote: string | null,
  password: string,
  note: string | null,
  personalfolderid: string | null,
  originalpersonalfolderid: string | null,
}

export interface iGetPersonalCredentials
{
  id: string,
  domain: string | null,
  username: string,
  email:string | null,
  remote: string | null,
  password: string,
  note: string | null,
  personalfolderid: string | null
}

export interface iDeletePersonalCredential
{
  personalfolderid: string | null,
  id: string
}