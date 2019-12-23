import {prisma} from "../../generated";

export class GroupQueries {
    public async myWorkspaces(token) {
        let profile = await prisma.session({token:token}).profile();
        if (!profile) {
            throw new Error("Invalid token or the session has no associated profile.")
        }
        return await prisma.groups({where:{host:{id:profile.id}}});
    }

    public async myMemberships(token) {
        let profile = await prisma.session({token:token}).profile();
        if (!profile) {
            throw new Error("Invalid token or the session has no associated profile.")
        }
        let memberships = await prisma.memberships({where: {member: {id: profile.id}}});
        return await memberships.map(async (o:any) => {
            o.group = await prisma.membership({id: o.id}).group();
            o.member = await prisma.membership({id: o.id}).member();
            return o;
        });
    }

    public async listWorkspaces(token, profileId) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        return prisma.groups({where: {type: "WORKSPACE", host:{id:profileId}}});
    }

    public async listMemberships(token, profileId) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        let memberships = await prisma.memberships({where: {member: {id: profileId}}});
        let members = await memberships.map(async (m:any) => {
            m.member = await prisma.membership({id: m.id}).member();
            m.group = await prisma.membership({id: m.id}).group();
            return m;
        });
        return members;
    }

    public async listMembers(token, groupId) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        let memberships = await prisma.memberships({where: {group: {id: groupId}}});
        let members = await memberships.map(async m => {
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

    public async listMessages(token, groupId, profileId) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        if ((!groupId || groupId === "undefined") && (!profileId || profileId === "undefined")) {
            throw new Error("Neither 'groupId' nor 'profileId' was supplied.");
        }
        if (profileId === "undefined" && groupId && groupId.trim() !== "") {
            let messages = await prisma.group({id: groupId}).messages();
            let messages_ = await messages.map(async (o:any) => {
                o.sender = await prisma.message({id: o.id}).sender();
                return o;
            });
            return messages_;
        } else if (groupId === "undefined"  && profileId && profileId.trim() !== "") {
            let messages = await prisma.messages({where:{sender:{id:profileId}}});
            messages = await messages.map((o:any) => {
                o.sender = prisma.message({id: o.id}).sender();
                return o;
            });
            return  messages;
        } else if (groupId && profileId) {
            throw new Error("both groupId and profileId are set");
        } else {
            throw new Error("neither groupId nor profileId is set");
        }
    }

    public async getWorkspace(_, {token, workspaceId}) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        let group = <any>await prisma.group({id: workspaceId});
        let host = await prisma.group({id: workspaceId}).host();
        group.host = host;
        return group;
    }
}