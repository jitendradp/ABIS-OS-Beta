import {ContentEncodingCreateInput} from "../../generated/prisma_client";

export const ContentEncoding: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Login",
    type: "JsonSchema",
    data: JSON.stringify({
        Login: {
            type: "object",
            properties: {
                "email": {"type": "string"},
                "password": {"type": "string"}
            },
            required: [
                "email",
                "password"
            ]
        }
    })
};