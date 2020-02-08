// import {prisma} from "../../../generated";
// import {CommonQueries} from "../commonQueries";
//
// export class GroupQueries {
//     public static async myGroups(csrfToken: string, bearerToken:string) {
//         const agent = await CommonQueries.findAgentByBearerToken(csrfToken, bearerToken);
//         if (!agent) {
//             throw new Error("Invalid csrfToken or the session has no associated profile.")
//         }
//         return await prisma.groups({where:{owner:agent.id}});
//     }
//
//     public static async myMemberships(csrfToken: string, bearerToken:string) {
//         const agent = await CommonQueries.findAgentByBearerToken(csrfToken, bearerToken);
//         if (!agent) {
//             throw new Error("Invalid csrfToken or the session has no associated profile.")
//         }
//         return  await prisma.memberships({where: {member: {id: agent.id}}});
//     }
//
//     /**
//      * Lists all public rooms.
//      * @param csrfToken
//      * @param bearerToken
//      * @param agentId (can be null)
//      * @param searchText (can be null)
//      */
//     public static async listPublicRooms(csrfToken: string, bearerToken:string, agentId:string, searchText:string) {
//         // TODO: Build a proper search index that can search for name, title and description
//         const user = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!user) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         if (agentId) {
//             return prisma.groups({where: {type: "Room", isPublic: true, owner: agentId}});
//         } else {
//             return prisma.groups({where: {type: "Room", isPublic: true}});
//         }
//     }
//
//     public static async listMembershipsOfProfile(csrfToken: string, bearerToken:string, agentId:string) {
//         const user = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!user) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         return prisma.memberships({where: {member: {id: agentId}}});
//     }
//
//     public static async listMembers(csrfToken: string, bearerToken:string, groupId:string) {
//         const user = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!user) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         const memberships = await prisma.group({id:groupId}).memberships();
//         const members = await memberships.map(async m => {
//             return {
//                 id: m.id,
//                 createdAt: m.createdAt,
//                 updatedAt: m.updatedAt,
//                 member: await prisma.membership({id: m.id}).member()
//             };
//         });
//         return members;
//     }
//
//     public static async listMessages(csrfToken: string, bearerToken:string, groupId?:string, profileId?:string, begin?:string, end?:string) {
//         const user = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!user) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         if (!groupId && (profileId)) {
//             throw new Error("Neither 'groupId' nor 'profileId' was supplied.");
//         }
//         if (!profileId && groupId && groupId.trim() !== "") {
//             const messages = await prisma.group({id: groupId}).messages();
//             return messages.map(async (o: any) => {
//                 o.creator = await prisma.message({id: o.id}).creator();
//                 return o;
//             });
//         } else if (!groupId  && profileId && profileId.trim() !== "") {
//             let messages = await prisma.messages({where:{creator:{id:profileId}}});
//             messages = await messages.map((o:any) => {
//                 o.creator = prisma.message({id: o.id}).creator();
//                 return o;
//             });
//             return  messages;
//         } else if (groupId && profileId) {
//             throw new Error("both groupId and profileId are set");
//         }
//     }
//
//     public static async getGroup(csrfToken: string, bearerToken:string, groupId:string) {
//         const account = await prisma.session({csrfToken, bearerToken}).account();
//         if (!account) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         // TODO: Get rid of the <any> castnmp
//         const group = <any>await prisma.group({id: groupId});
//         group.creator = await prisma.group({id: groupId}).creator();
//
//         return group;
//     }
// }
