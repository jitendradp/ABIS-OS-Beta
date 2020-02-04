import {Helper} from "../../helper/Helper";
import {ActionResponse} from "./actionResponse";
import {prisma} from "../../generated";
import {CommonQueries} from "../queries/commonQueries";
import {OwnershipStatements} from "../../rules/ownershipStatements";

export class RoomApiMutations {
    static async createRoom(
        csrfToken: string
        , bearerToken: string
        , isPublic: boolean
        , name: string
        , title?: string
        , description?: string
        , logo?: string
        , banner?: string) {
        try {
            // fact "R.I.1 Jeder Raum hat eine Inbox"
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);

            const room = await prisma.createGroup({
                type: "Room",
                createdBy: myAgent.id,
                owner: myAgent.id,
                isPublic: isPublic,
                name: name,
                title: title,
                description: description,
                logo: logo,
                banner: banner,
                inbox: {
                    create: {
                        createdBy: myAgent.id,
                        owner: myAgent.id
                    }
                }
            });

            return room;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred the creation of a new room: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    static async updateRoom(
        csrfToken: string
        , bearerToken: string
        , id: string
        , isPublic: boolean
        , name: string
        , title: string
        , description: string
        , logo: string
        , banner: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
            if (!await OwnershipStatements.agentOwnsRoom(myAgent.id, id)) {
                throw new Error(`Agent ${myAgent.id} doesn't own room ${id} which it tries to modify.`)
            }
            const updatedRoom = await prisma.updateGroup({where:{id:id}, data:{
                    updatedBy: myAgent.id,
                    isPublic: isPublic,
                    name: name,
                    title: title,
                    description: description,
                    logo: logo,
                    banner: banner,
            }});
            return updatedRoom;
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during a room update: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }

    static async deleteRoom(csrfToken: string, bearerToken: string, roomId: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
            if (!await OwnershipStatements.agentOwnsRoom(myAgent.id, roomId)) {
                throw new Error(`Agent ${myAgent.id} doesn't own room ${roomId} which it tries to delete.`)
            }
            await prisma.deleteGroup({id:roomId});
        } catch (e) {
            const errorId = Helper.logId(`An error occurred during the deletion of a room: ${JSON.stringify(e)}`);
            return <ActionResponse>{
                success: false,
                code: errorId
            };
        }
    }
}
