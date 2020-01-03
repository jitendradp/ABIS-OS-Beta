import {prisma} from "../../generated";
import {CommonQueries} from "../../queries/commonQueries";

export class GroupMutations {
    public static async createWorkspace(csrfToken: string, authToken:string, hostProfileId: string, name: string, title: string, description: string, logo: string, tags: string) {
        const user = CommonQueries.findUserBySession(csrfToken, authToken);
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        const group = await prisma.createGroup({
            host: {
                connect: {
                    id: hostProfileId
                }
            },
            type: "WORKSPACE",
            name: name,
            description: description,
            logo: logo,
            tags: tags,
            title: title,
            is_hidden: true,
            is_public: false
        });
        const membership = await prisma.createMembership({
            member:{
                connect:{
                    id:hostProfileId
                }
            },
            show_history:true,
            group:{
                connect:{
                    id:group.id
                }
            }
        });
        await prisma.updateGroup({where:{id:group.id}, data:{members:{connect:{id:membership.id}}}});
        return group.id;
    }

    public static async updateWorkspace(csrfToken: string, authToken:string, workspaceId: string, name: string, title: string, description: string, logo: string, tags: string, isHidden: boolean, isPublic: boolean) {
        const user = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        await prisma.updateGroup({
            data: {
                name: name,
                description: description,
                logo: logo,
                tags: tags,
                title: title,
                is_hidden: isHidden,
                is_public: isPublic
            },
            where:{
                id:workspaceId
            }
        });
        return workspaceId;
    }

    public static async addMember(csrfToken: string, authToken:string, groupId: string, memberProfileId: string) {
        const profile = await CommonQueries.findProfileBySession(csrfToken, authToken);
        if (!profile) {
            throw new Error("Invalid csrf- or auth token nor the session has no associated profile.");
        }
        const membership = await prisma.createMembership({
            group: {
                connect: {
                    id: groupId
                }
            },
            member: {
                connect: {
                    id: memberProfileId
                }
            },
            show_history: false
        });
        const group = await prisma.updateGroup({
            data: {
                members: {
                    connect: {
                        id: membership.id
                    }
                }
            },
            where: {
                id: groupId
            }
        });
        await prisma.updateGroup({
            data: {
                messages: {
                    create: {
                        type: "TRAIL",
                        sender:{connect:{id:memberProfileId}},
                        subject: profile.name + " joined " + group.name,
                        content: {
                            type: "trail",
                            action:"addMember",
                            timestamp:new Date(),
                            profileId:memberProfileId,
                            profileName:profile.name,
                            groupId:groupId,
                            groupName:group.name
                        }
                    }
                }
            },
            where: {
                id: groupId
            }
        });
        return membership.id;
    }

    public static async removeMember(csrfToken: string, authToken:string, groupId: string, memberProfileId: string) {
        const profile = await CommonQueries.findProfileBySession(csrfToken, authToken);
        if (!profile) {
            throw new Error("Invalid csrfToken or the session has no associated profile.")
        }
        const memberships = await prisma.group({id: groupId}).members({where: {member: {id: memberProfileId}}});
        for (const o of memberships) {
            const group = await prisma.membership({id: o.id}).group();
            await prisma.deleteMembership({id: o.id});
            await prisma.updateGroup({
                data: {
                    messages: {
                        create: {
                            type: "TRAIL",
                            sender:{connect:{id:memberProfileId}},
                            subject: memberProfileId + " left " + groupId,
                            content: {
                                type: "trail",
                                action:"removeMember",
                                timestamp:new Date(),
                                profileId:memberProfileId,
                                profileName:profile.name,
                                groupId:groupId,
                                groupName:group.name
                            }
                        }
                    }
                },
                where: {
                    id: groupId
                }
            });
        }

        return memberships.map(o => o.id)[0];
    }
}
