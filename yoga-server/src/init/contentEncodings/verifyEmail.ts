import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const ContentEncoding: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "VerifyEmail",
    type: "JsonSchema",
    data: JSON.stringify({
        VerifyEmail: {
            type: "object",
            properties: {
                "code": {"type": "string"}
            },
            required: [
                "code"
            ]
        }
    })
};