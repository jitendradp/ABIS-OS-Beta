// import {GroupType, prisma, TagCreateInput} from "../../../generated";
// import {CommonQueries} from "../../queries/commonQueries";
//
// export class GroupMutations {
//     /**
//      *
//      * @param csrfToken
//      * @param bearerToken
//      * @param ownerAgentId The id of the agent that creates and owns the group
//      * @param type  Either "Stash" for a private space, "Channel" for an uni-directional channel between two Agents or "Room" for an open or closed forum.
//      * @param isPublic Can only be 'true' when 'type == "Room"'
//      * @param name
//      * @param logo
//      * @param title (can be null)
//      * @param description (can be null)
//      */
//     public static async createGroup(csrfToken: string, bearerToken: string, ownerAgentId: string, type: GroupType, isPublic:boolean, logo: string, name: string, title: string, description: string) {
//         const user = CommonQueries.findUserBySession(csrfToken, bearerToken);
//
//         if (!user) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         if (type != "Room" && isPublic) {
//             throw new Error("Only Rooms can be public.");
//         }
//
//         const group = await prisma.createGroup({
//             createdBy: ownerAgentId,
//             owner: ownerAgentId,
//             type: type,
//             name: name,
//             description: description,
//             logo: logo,
//             isPublic: isPublic
//         });
//
//         return group.id;
//     }
//
//     public static async updateGroup(csrfToken: string, bearerToken: string, groupId: string, name: string, description: string, logo: string, tags: TagCreateInput[], isPublic: boolean) {
//         const user = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!user) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//
//         // TODO: Add tags
//         await prisma.updateGroup({
//             data: {
//                 name: name,
//                 description: description,
//                 logo: logo,
//                 isPublic: isPublic
//             },
//             where: {
//                 id: groupId
//             }
//         });
//         return groupId;
//     }
//
//     public static async addMember(csrfToken: string, bearerToken: string, groupId: string, memberProfileId: string) {
//         const agent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
//         if (!agent) {
//             throw new Error("Invalid csrf- or auth token nor the session has no associated agent.");
//         }
//
//         // TODO: Check if "Single" or "Multi" membership. If it is the first "Multi"-membership, update the existing to "Multi" as well.
//
//         const membership = await prisma.createMembership({
//             type: "Single",
//             createdBy: agent.id,
//             member: {
//                 connect: {
//                     id: memberProfileId
//                 }
//             },
//             showHistory: false
//         });
//
//         await prisma.updateGroup({
//             data: {
//                 memberships: {
//                     connect: {
//                         id: membership.id
//                     }
//                 }
//             },
//             where: {
//                 id: groupId
//             }
//         });
//
//         return membership.id;
//     }
//
//     public static async removeMember(csrfToken: string, bearerToken: string, groupId: string, memberAgentId: string) {
//         const agent = await CommonQueries.findAgentBySession(csrfToken, bearerToken);
//         if (!agent) {
//             throw new Error("Invalid csrfToken or the session has no associated agent.")
//         }
//
//         const memberships = await prisma.group({id: groupId})
//                                         .memberships({where: {member: {id: memberAgentId}}});
//
//         for (const o of memberships) {
//             await prisma.deleteMembership({id: o.id});
//         }
//
//         return memberships.map(o => o.id)[0];
//     }
// }
