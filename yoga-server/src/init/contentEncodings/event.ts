import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "Event",
    type: "JsonSchema",
    data: JSON.stringify({
        Login: {
            "type": "object",
            "properties": {
                "date": {"type": "string"},
                "time": {"type": "string"},
                "country": {"type": "string"},
                "name": {"type": "string"},
                "lastValue": {"type": "string"},
                "prognosedValue": {"type": "string"},
                "currentValue": {"type": "string"},
                "description": {"type": "string"},
            },
            "required": [
                "date",
                "time",
                "country",
                "name",
                "lastValue",
                "prognosedValue",
                "currentValue",
                "description"
            ]
        }
    })
};