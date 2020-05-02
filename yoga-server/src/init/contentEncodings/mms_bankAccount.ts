import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "dave",
    maintainer: "munichMotosport",
    charset: "utf-8",
    name: "BankAccount",
    type: "JsonSchema",
    data: JSON.stringify({
        BankAccount: {
            "type": "object",
            "properties": {
                "bank_name": {"type": "string"},
                "iban": {"type": "string"},
                "bic": {"type": "string"}
            },
            "required": [
                "bank_name",
                "iban",
                "bic"
            ]
        }
    })
};