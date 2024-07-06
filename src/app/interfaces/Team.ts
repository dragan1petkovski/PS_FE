export interface iTeam {
    id: string,
    name: string,
    clientname: string,
    createdate: Date,
    updatedate: Date
}

export interface iPostTeam
{
    name: string | null | undefined,
    clientid: string | null | undefined,
    userids: string[] | null | undefined
}

export interface iClientTeamMapping
{
    teamname: string,
    teamid: string,
    clientname: string,
    clientid: string
}