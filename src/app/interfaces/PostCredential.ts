import { iPersonalFolder } from "./DTOModel/PersonalFolderDTO";
import { iTeamDTOMini } from "./DTOModel/teamDTOMini";

export interface iPostCredential 
{
  domain: string,
  username: string,
  remote: string,
  password: string,
  note: string,
  teams: iTeamDTOMini[] | null
  personalfolderid: string | null
}