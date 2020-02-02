// import {AgentStatus, AgentType, prisma, ProfileType} from "../../../generated";
// import {CommonQueries} from "../../queries/commonQueries";
//
// export class ProfileMutations {
//     public static async createProfile(csrfToken: string, bearerToken: string, name: string, profileAvatar: string, timezone: string, status: AgentStatus) {
//         const userAndSession = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!userAndSession) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//
//         const profile = await prisma.createAgent({
//             name: name,
//             profileAvatar: profileAvatar,
//             timezone: timezone,
//             createdBy: userAndSession.user.id,
//             owner: userAndSession.user.id,
//             type: "Profile",
//             status: status
//         });
//         await prisma.updateUser({
//             data: {
//                 agents: {
//                     connect: {
//                         id: profile.id
//                     }
//                 }
//             },
//             where: {id: userAndSession.user.id}
//         });
//         return profile.id;
//     }
//
//     public static async updateProfile(csrfToken: string, bearerToken: string, profileId: string, name: string, picture: string, timezone: string, status: AgentStatus) {
//         const userAndSession = await CommonQueries.findUserBySession(csrfToken, bearerToken);
//         if (!userAndSession) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//
//         return await prisma.updateAgent({
//             data: {
//                 name: name,
//                 profileAvatar: picture,
//                 timezone: timezone,
//                 status: status,
//             },
//             where: {
//                 id: profileId
//             }
//         }).id();
//     }
// }
