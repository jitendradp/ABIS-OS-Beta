import {ContentEncodingCreateInput} from "../../generated";

export const Index: ContentEncodingCreateInput = {
    createdBy: "dave",
    maintainer: "munichMotosport",
    charset: "utf-8",
    name: "CashPosition",
    type: "JsonSchema",
    data: JSON.stringify({
        Purchaser: {
            "type": "object",
            "properties": {
                "company_name": {"type": "string"},
                "amount": {"type": "string"},
                "cost_type": {"type": "string"},
                "business_reason": {"type": "string"},
                "ivs_number": {"type": "string"},
                "not_refundable": {"type": "string", "enum": ["true", "false"]},
                "service_type": {
                    "type": "string",
                    "enum": ["1. Neuanschaffung", "2. Ersatz*", "3. Zubehör", "4. Modernisierung*", "5. Reperatur*"]
                },
                "invoice_date": {"type": "string"}
            },
            "required": [
                "company_name",
                "amount",
                "cost_type",
                "business_reason",
                "service_type"
            ]
        },
        Layout: [
            {
                "type": "flex",
                "flex-flow": "row wrap",
                "items": ["company_name", "amount", "cost_type", "business_reason", "ivs_number"]
            },
            {
                "type": "div",
                "display": "flex",
                "flex-direction": "row",
                "items": [
                    {
                        "key": "not_refundable", "flex": "1 1 150px",
                        "notitle": true, "placeholder": "Not Refundable"
                    },
                    {
                        "key": "service_type", "flex": "1 1",
                        "notitle": true, "placeholder": "Service Type"
                    }
                ]
            },
            {"key": "invoice_date", "type": "date"}
        ]

    }),

};