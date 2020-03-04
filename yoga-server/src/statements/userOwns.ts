import {prisma} from "../generated/prisma_client";

export class UserOwns {
    public static async profile(userId:string, profileId:string) {
        const userAgent = await prisma.user({id:userId})
                                      .agents({where:{id:profileId, type:"Profile"}});
        if (userAgent.length != 1) {
            return false;
        }
        return userAgent[0].owner == userId;
    }
}