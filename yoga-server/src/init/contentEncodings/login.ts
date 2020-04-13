import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Login",
    type: "JsonSchema",
    data: JSON.stringify({
        Login: {
            "type": "object",
            "properties": {
                "email": {"type": "string"},
                "password": {"type": "string"},
                "remeber_me": {"type": "boolean"}
            },
            "required": [
                "email",
                "password"
            ]
        }
    })
};