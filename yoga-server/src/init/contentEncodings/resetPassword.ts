import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "ResetPassword",
    type: "JsonSchema",
    data: JSON.stringify({
        ResetPassword: {
            "type": "object",
            "properties": {
                "email": {"type": "string"}
            },
            "required": [
                "email"
            ]
        }
    })
};