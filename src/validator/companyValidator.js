const { z } = require("zod");

const companyValidator = z.object({
    company_code: z.string()
        .min(1)
        .max(100),

    company_name: z.string()
        .min(3)
        .max(255),

    company_logo: z.string()
        .min(3)
        .max(255),

    tagline: z.string()
        .min(3)
        .max(255),

    legal_name: z.string()
        .min(3)
        .max(255),

    short_name: z.string()
        .min(3)
        .max(255),

    gst_number: z.string()
        .min(3)
        .max(255),

    pan_number: z.string()
        .min(3)
        .max(255),

    cin_number: z.string()
        .min(3)
        .max(255),

    company_email: z.string()
        .email(),

    website: z.string()
        .min(3)
        .max(255),

    address_line1: z.string()
        .min(3),

    address_line2: z.string()
        .min(3)
        .nullable()
        .optional(),

    city: z.string()
        .min(3)
        .max(255),

    district: z.string()
        .min(3)
        .max(255),

    state: z.string()
        .min(3)
        .max(255),

    country: z.string()
        .min(3)
        .max(255),

    pincode: z.string()
        .min(3)
        .max(255),

    financial_year_start: z.string()
        .date("Invalid date format"),

    financial_year_end: z.string()
        .date("Invalid date format"),

    office_start_time: z.string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "Time must be in HH:MM format"
        ),

    office_end_time: z.string()
        .regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "Time must be in HH:MM format"
        ),

    working_days_start: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ]),
    working_days_end: z.enum([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ]),
    created_by: z.coerce
        .number()
        .int()
        .positive()

});
module.exports=companyValidator;