import {Agent, prisma} from "../../generated";

export class ProfileQueries {
    /**
     * Finds the first profile of the specified user.
     * @param userId The user id
     */
    public static async findFirstProfileOfUser(userId:string) : Promise<Agent> {
        const profile = await prisma.user({
                                        id:userId})
                                    .agents({
                                        where:{type:"Profile"},
                                        orderBy: "createdAt_ASC",
                                        first: 1});

        if (profile.length != 1) {
            return null;
        }

        return profile[0];
    }
}
