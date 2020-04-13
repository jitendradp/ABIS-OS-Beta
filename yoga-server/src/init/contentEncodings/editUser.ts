import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "EditUser",
    type: "JsonSchema",
    data: JSON.stringify({
        EditUser: {
            "type": "object",
            "properties": {
                "first_name": { "type": "string" , "minLength": 2},
                "last_name": { "type": "string", "minLength": 3 },
                "email": { "type": "string", "minLength": 6 }
            },
            "required": [
                "first_name",
                "last_name",
                "email"
            ]
        }
    })
};