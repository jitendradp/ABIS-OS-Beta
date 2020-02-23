import {Helper} from "../../helper/helper";
import {ActionResponse} from "./actionResponse";
import {prisma} from "../../generated";
import {CommonQueries} from "../queries/commonQueries";
import {AgentOwns} from "../../statements/agentOwns";

export class RoomApiMutations {
    static async createRoom(
        csrfToken: string
        , sessionToken: string
        , bearerToken: string
        , isPublic: boolean
        , name: string
        , title?: string
        , description?: string
        , logo?: string
        , banner?: string) {
        try {
            // fact "R.I.1 Jeder Raum hat eine Inbox"
            // TODO: Change alloy model
            const myUser = await CommonQueries.findUserBySession(csrfToken, bearerToken);
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);

            const roomInbox = await prisma.createAgent({
               owner: myUser.user.id,
               createdBy: myUser.user.id,
               type: "Inbox",
               status: "Open",
               name: name,
               inboxDescription: description
            });

            const inboxAgentMembership = await prisma.createMembership({
                showHistory: true,
                member: {
                    connect: {
                        id: roomInbox.id
                    }
                },
                createdBy: myAgent.id,
                type: "Single"
            });

            const room = await prisma.createGroup({
                type: "Room",
                createdBy: myAgent.id,
                owner: myAgent.id,
                isPublic: isPublic,
                name: name,
                title: title,
                description: description,
                logo: logo ?? "defaultRoom.png",
                banner: banner,
                inbox: roomInbox.id,
                memberships: {
                    connect: {
                        id: inboxAgentMembership.id
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
        , sessionToken: string
        , bearerToken: string
        , id: string
        , isPublic: boolean
        , name: string
        , title: string
        , description: string
        , logo: string
        , banner: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!await AgentOwns.room(myAgent.id, id)) {
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

    static async deleteRoom(csrfToken: string, sessionToken: string, bearerToken: string, roomId: string) {
        try {
            const myAgent = await CommonQueries.findAgentBySession(csrfToken, sessionToken, bearerToken);
            if (!await AgentOwns.room(myAgent.id, roomId)) {
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
