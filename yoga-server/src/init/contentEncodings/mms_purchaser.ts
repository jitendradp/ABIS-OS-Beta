import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "",
    maintainer: "",
    charset: "utf-8",
    name: "MmsPurchaser",
    type: "JsonSchema",
    data: JSON.stringify({
        MmsPurchaser: {
            "type": "object",
            "properties": {
                "last_name": {"type": "string"},
                "first_name": {"type": "string"},
                "street_and_number": {"type": "string"},
                "city": {"type": "string"},
                "zip_code": {"type": "number"},
                "phone": {"type": "string"},
                "email": {"type": "string"},
                "department": {
                    "type": "string",
                    "enum": ["FK1", "FK2", "FK3", "FK4", "FK5",
                        "FK6", "FK7", "FK8", "FK9", "FK10", "FK11",
                        "BB", "FI", "FO", "GM", "HE", "HK", "IL", "IO", "IT", "OP", "QM", "ST", "WBZ"]
                }
            },
            "required": [
                "last_name",
                "first_name",
                "street_and_number",
                "city",
                "zip_code",
                "phone",
                "email",
                "department"
            ]
        }
    })
};