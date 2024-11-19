import { iGetClientsForUser } from "../Client/Client"
import { iPersonalFolder } from "../DTOModel/PersonalFolderDTO"
export interface iOriginalNavData
{
    type: string,
    data: iGetClientsForUser[]|iPersonalFolder[]
}