import {prisma} from "../../generated";

export class GroupMutations {
    public async createWorkspace(token: string, hostProfileId: string, name: string, title: string, description: string, logo: string, tags: string) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
        }
        let group = await prisma.createGroup({
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
        let membership = await prisma.createMembership({
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

    public async updateWorkspace(token: string, workspaceId: string, name: string, title: string, description: string, logo: string, tags: string, isHidden: boolean, isPublic: boolean) {
        let user = await prisma.session({token: token}).user();
        if (!user) {
            throw new Error("Invalid token");
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

    public async addMember(token: string, groupId: string, memberProfileId: string) {
        let profile = await prisma.session({token:token}).profile();
        if (!profile) {
            throw new Error("Invalid token or the session has no associated profile.")
        }
        let membership = await prisma.createMembership({
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
        let group = await prisma.updateGroup({
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

    public async removeMember(token: string, groupId: string, memberProfileId: string) {
        let profile = await prisma.session({token:token}).profile();
        if (!profile) {
            throw new Error("Invalid token or the session has no associated profile.")
        }
        let memberships = await prisma.group({id: groupId}).members({where: {member: {id: memberProfileId}}});
        for (const o of memberships) {
            let group = await  prisma.membership({id: o.id}).group();
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
