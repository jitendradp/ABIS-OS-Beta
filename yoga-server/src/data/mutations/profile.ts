import {ProfileStatus} from "../../api/Profile";
import {Group, prisma} from "../../generated";
import {Helper} from "../../helper/Helper";
import {StashMutations} from "./stash";

export class ProfileMutations {
    /**
     * Creates a new profile for (and in the name of) the specified user.
     * @param userId    The id of the creator- and owner-user of the profile.
     * @param name      The name of the profile
     * @param avatar    The image url to the avatar image (TODO: Should be an entry-id instead - will do that tomorrow ;)
     * @param status    The profile's initial status (can be omitted and defaults to "Offline")
     */
    public static async createProfile(userId: string, name: string, avatar: string, status?: ProfileStatus) {
        // fact "P.S.1 Jedes Profil hat mindestens einen StashMutations"
        const newProfile = await prisma.createAgent({
            owner: userId,
            createdBy: userId,
            name: name,
            profileAvatar: avatar,
            status: status ?? "Offline",
            type: "Profile"
        });

        Helper.log("Created a new profile (id: " + newProfile.id + ").");

        // Create the profile's first stash.
        await ProfileMutations.createFirstStashForProfile(newProfile.id);

        // Connect the new profile to the User.
        await prisma.updateUser({
            where: {id: userId}, data: {
                agents: {
                    connect: {
                        id: newProfile.id
                    }
                }
            }
        });

        return newProfile;
    }

    /**
     * Creates the first stash for the supplied profile-Agent.
     * @param profileId
     */
    private static async createFirstStashForProfile(profileId: string): Promise<Group> {
        // fact "P.S.1 Jedes Profil hat mindestens einen StashMutations"
        const persistedProfile = await prisma.agent({id:profileId});
        if (persistedProfile.type != "Profile") {
            throw new Error("This method only accepts agents of type 'Profile'.")
        }
        if ((await prisma.groups({where:{owner: profileId, type: "Stash"}})).length > 0) {
            throw new Error(`This is not the first Stash of agent ${profileId}.`);
        }

        return StashMutations.createStash(persistedProfile.id, persistedProfile.name + "'s StashMutations", "assets/logos/stash.png")
    }
}
