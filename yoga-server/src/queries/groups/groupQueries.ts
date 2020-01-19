import {prisma} from "../../generated";

export class GroupQueries {
    public static async myGroups(csrfToken: string, authToken:string) {
        const profile = await prisma.session({csrfToken, authToken}).profile();
        if (!profile) {
            throw new Error("Invalid csrfToken or the session has no associated profile.")
        }
        return await prisma.groups({where:{creator:{id:profile.id}}});
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

    public static async listGroups(csrfToken: string, authToken:string, profileId:string) {
        const account = await prisma.session({csrfToken, authToken}).account();
        if (!account) {
            throw new Error("Invalid csrf- or auth token");
        }
        return prisma.groups({where: {type: "ROOM", creator:{id:profileId}}});
    }

    public static async listMembershipsOfProfile(csrfToken: string, authToken:string, profileId:string) {
        const account = await prisma.session({csrfToken, authToken}).account();
        if (!account) {
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
        const account = await prisma.session({csrfToken, authToken}).account();
        if (!account) {
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
        const account = await prisma.session({csrfToken, authToken}).account();
        if (!account) {
            throw new Error("Invalid csrf- or auth token");
        }
        if (!groupId && (profileId)) {
            throw new Error("Neither 'groupId' nor 'profileId' was supplied.");
        }
        if (!profileId && groupId && groupId.trim() !== "") {
            const messages = await prisma.group({id: groupId}).messages();
            return messages.map(async (o: any) => {
                o.creator = await prisma.message({id: o.id}).creator();
                return o;
            });
        } else if (!groupId  && profileId && profileId.trim() !== "") {
            let messages = await prisma.messages({where:{creator:{id:profileId}}});
            messages = await messages.map((o:any) => {
                o.creator = prisma.message({id: o.id}).creator();
                return o;
            });
            return  messages;
        } else if (groupId && profileId) {
            throw new Error("both groupId and profileId are set");
        }
    }

    public static async getGroup(csrfToken: string, authToken:string, groupId:string) {
        const account = await prisma.session({csrfToken, authToken}).account();
        if (!account) {
            throw new Error("Invalid csrf- or auth token");
        }
        // TODO: Get rid of the <any> castnmp
        const group = <any>await prisma.group({id: groupId});
        group.creator = await prisma.group({id: groupId}).creator();

        return group;
    }
}
