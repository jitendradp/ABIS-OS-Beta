import {GroupType, prisma, Tag, TagCreateInput} from "../../generated";
import {CommonQueries} from "../../queries/commonQueries";

export class GroupMutations {
    public static async createGroup(csrfToken: string, authToken: string, hostProfileId: string, type: GroupType, name: string, title: string, description: string, logo: string, tags: TagCreateInput[]) {
        const user = CommonQueries.findUserBySession(csrfToken, authToken);
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }
        const group = await prisma.createGroup({
            creator: {
                connect: {
                    id: hostProfileId
                }
            },
            type: type,
            name: name,
            description: description,
            pictureLogo: logo,
            isHidden: true,
            isPublic: false
        });

        // TODO: Add tags

        const membership = await prisma.createMembership({
            member: {
                connect: {
                    id: hostProfileId
                }
            },
            creator: { // TODO: The owner of a group invites himself. Is this really necessary?
                connect: {
                    id: hostProfileId
                }
            },
            show_history: true,
            group: {
                connect: {
                    id: group.id
                }
            }
        });
        await prisma.updateGroup({where: {id: group.id}, data: {members: {connect: {id: membership.id}}}});
        return group.id;
    }

    public static async updateGroup(csrfToken: string, authToken: string, workspaceId: string, type: GroupType, name: string, description: string, logo: string, tags: TagCreateInput[], isHidden: boolean, isPublic: boolean) {
        const user = await CommonQueries.findUserBySession(csrfToken, authToken);
        if (!user) {
            throw new Error("Invalid csrf- or auth token");
        }

        // TODO: Add tags
        await prisma.updateGroup({
            data: {
                type: type,
                name: name,
                description: description,
                pictureLogo: logo,
                isHidden: isHidden,
                isPublic: isPublic
            },
            where: {
                id: workspaceId
            }
        });
        return workspaceId;
    }

    public static async addMember(csrfToken: string, authToken: string, groupId: string, memberProfileId: string) {
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
            creator: {
                connect: {
                    id: profile.id
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
        // TODO: Build a proper mechanism to create an activity stream/log trail
        /*
        await prisma.updateGroup({
            data: {
                messages: {
                    create: {
                        type: "TRAIL",
                        creator:{connect:{id:memberProfileId}},
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
         */
        return membership.id;
    }

    public static async removeMember(csrfToken: string, authToken: string, groupId: string, memberProfileId: string) {
        const profile = await CommonQueries.findProfileBySession(csrfToken, authToken);
        if (!profile) {
            throw new Error("Invalid csrfToken or the session has no associated profile.")
        }
        const memberships = await prisma.group({id: groupId}).members({where: {member: {id: memberProfileId}}});
        for (const o of memberships) {
            const group = await prisma.membership({id: o.id}).group();
            await prisma.deleteMembership({id: o.id});
            // TODO: Build a proper mechanism to create an activity stream/log trail
            /*
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
             */
        }

        return memberships.map(o => o.id)[0];
    }
}
