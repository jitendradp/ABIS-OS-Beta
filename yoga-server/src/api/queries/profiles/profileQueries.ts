// import {prisma} from "../../../generated";
// import {CommonQueries} from "../commonQueries";
//
// export class ProfileQueries {
//     public static async getSessionProfile(csrfToken:string, bearerToken:string) {
//         const sessionQuery = prisma.session({bearerToken:bearerToken});
//         const account = await sessionQuery.account();
//         if (!account) {
//             throw new Error("Invalid bearerToken");
//         }
//
//         const session = await sessionQuery;
//         if (session.csrfToken !== csrfToken) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//         let currentProfile = await prisma.session({bearerToken}).profile();
//         if (!currentProfile) {
//             const lastUsedProfileId = await prisma.session({bearerToken}).account().lastUsedProfileId();
//             if (lastUsedProfileId) {
//                 currentProfile = await  prisma.profile({id: lastUsedProfileId});
//             }
//         }
//         if (!currentProfile) {
//             return null;
//         } else {
//             return currentProfile;
//         }
//     }
//
//     public static async listProfiles(csrfToken:string, bearerToken:string) {
//         const profiles = await prisma.session({bearerToken:bearerToken}).account().profiles();
//         if (!profiles) {
//             throw new Error("Invalid bearerToken");
//         }
//
//         const session = await prisma.session({bearerToken:bearerToken});
//         if (session.csrfToken !== csrfToken) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//
//         return profiles;
//     }
//
//     public static async getProfile(csrfToken:string, bearerToken:string, profileId:string) {
//         const session = await CommonQueries.findSession(csrfToken, bearerToken);
//         if (!session) {
//             throw new Error("Invalid csrf- or auth token");
//         }
//
//         return prisma.profile({id: profileId});
//     }
// }
