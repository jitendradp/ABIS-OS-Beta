import {prisma} from "../../generated";

export class GroupQueries {
    public static async myWorkspaces(csrfToken: string, authToken:string) {
        const profile = await prisma.session({csrfToken, authToken}).profile();
        if (!profile) {
            throw new Error("Invalid csrfToken or the session has no associated profile.")
        }
        return await prisma.groups({where:{host:{id:profile.id}}});
    }

    public static async myMemberships(csrfToken: string, authToken:string) {
        const profile = await prisma.session({csrfToken, authToken}).profile();
        if (!profile) {
            throw new Error("Invalid csrfToken or the session has no associated profile.")
        }
        const memberships = await prisma.memberships({where: {member: {id: profile.id}}});
        return await memberships.map(async (o:any) => {
            o.group = await prisma.membership({id: o.id}).group();
            o.member = await prisma.membership({id: o.id}).member();
            return o;
        });
    }

    public static async listWorkspaces(csrfToken: string, authToken:string, profileId:string) {
        const user = await prisma.session({csrfToken, authToken}).user();
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        return prisma.groups({where: {type: "WORKSPACE", host:{id:profileId}}});
    }

    public static async listMemberships(csrfToken: string, authToken:string, profileId:string) {
        const user = await prisma.session({csrfToken, authToken}).user();
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        const memberships = await prisma.memberships({where: {member: {id: profileId}}});
        const members = await memberships.map(async (m:any) => {
            m.member = await prisma.membership({id: m.id}).member();
            m.group = await prisma.membership({id: m.id}).group();
            return m;
        });
        return members;
    }

    public static async listMembers(csrfToken: string, authToken:string, groupId:string) {
        const user = await prisma.session({csrfToken, authToken}).user();
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        const memberships = await prisma.memberships({where: {group: {id: groupId}}});
        const members = await memberships.map(async m => {
            return {
                id: m.id,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
                member: await prisma.membership({id: m.id}).member(),
                group: await prisma.membership({id: m.id}).group()
            };
        });
        return members;
    }

    public static async listMessages(csrfToken: string, authToken:string, groupId?:string, profileId?:string, begin?:string, end?:string) {
        const user = await prisma.session({csrfToken, authToken}).user();
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        if (!groupId && (profileId)) {
            throw new Error("Neither 'groupId' nor 'profileId' was supplied.");
        }
        if (!profileId && groupId && groupId.trim() !== "") {
            const messages = await prisma.group({id: groupId}).messages();
            const messages_ = await messages.map(async (o:any) => {
                o.sender = await prisma.message({id: o.id}).sender();
                return o;
            });
            return messages_;
        } else if (!groupId  && profileId && profileId.trim() !== "") {
            let messages = await prisma.messages({where:{sender:{id:profileId}}});
            messages = await messages.map((o:any) => {
                o.sender = prisma.message({id: o.id}).sender();
                return o;
            });
            return  messages;
        } else if (groupId && profileId) {
            throw new Error("both groupId and profileId are set");
        }
    }

    public static async getWorkspace(csrfToken: string, authToken:string, workspaceId:string) {
        const user = await prisma.session({csrfToken, authToken}).user();
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        const group = <any>await prisma.group({id: workspaceId});
        const host = await prisma.group({id: workspaceId}).host();
        group.host = host;
        return group;
    }
}
