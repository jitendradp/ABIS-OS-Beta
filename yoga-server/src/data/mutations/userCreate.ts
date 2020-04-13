import {Helper} from "../../helper/helper";
import {ProfileStatus} from "../../api/Profile";
import {AgentCreate} from "./agentCreate";
import {config} from "../../config";
import {Server} from "../../init";
import {prisma, ProfileType} from "../../generated";

export class UserCreate {
    public static async profile(userId: string, name: string, avatar: string, status?: ProfileStatus, server?:Server) {
        // fact "P.S.1 Jedes Profil hat mindestens einen Stash"
        const existingProfiles = await prisma.agents({
            where:{
                name: name
            }
        });

        if (existingProfiles.length > 0) {
            throw new Error(`User '${userId}' already has a profile with the name '${name}'.`);
        }

        const profileType:ProfileType = userId == server.anonymousUser.id ? "Anonymous" : "Private";

        // Connect the new profile to the User.
        await prisma.updateUser({
            where: {id: userId}, data: {
                agents: {
                    create: {
                        owner: userId,
                        createdBy: userId,
                        name: name,
                        profileAvatar: avatar,
                        status: status ?? "Offline",
                        type: "Profile",
                        implementation: "Profile",
                        profileType: profileType
                    }
                }
            }
        });

        const newProfile = await prisma.agents({
            where:{
                owner:userId,
                name:name
            }
        });
        const newStash = await AgentCreate.stash(newProfile[0].id, newProfile[0].name, "stash.png");

        Helper.log(`Created the new profile '${newProfile[0].id}' with stash '${newStash.id}' for user '${userId}.`);

        server.serviceHost.loadAgent(newProfile[0]);

        return newProfile[0];
    }

    public static async session(userId:string, agentId:string, bearerToken?:string, clientTime?:string) {
        const validTo = new Date(new Date().getTime() + config.auth.sessionTimeout);
        const csrfToken = Helper.getRandomBase64String(config.auth.tokenLength);
        const sessionToken = Helper.getRandomBase64String(config.auth.tokenLength);

        const session = await prisma.createSession({
            timedOut: null,
            sessionToken: sessionToken,
            csrfToken: csrfToken,
            bearerToken: bearerToken,
            validTo: validTo,
            clientTime: clientTime,
            user: {
                connect: {
                    id: userId
                }
            },
            agent: {
                connect: {
                    id: agentId
                }
            }
        });

        Helper.log(`Created session for user ${userId} with agent ${agentId}. Expires: ${validTo.toISOString()}`);

        return session;
    }
}