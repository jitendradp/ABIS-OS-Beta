import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "TextMessage",
    type: "JsonSchema",
    data: JSON.stringify({
        TextMessage: {
            "type": "object",
            "properties": {
                "message": {"type": "string"}
            },
            "required": [
                "message"
            ]
        }
    })
};