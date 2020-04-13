import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "VerifyEmail",
    type: "JsonSchema",
    data: JSON.stringify({
        VerifyEmail: {
            "type": "object",
            "properties": {
                "code": {"type": "string"}
            },
            "required": [
                "code"
            ]
        }
    })
};