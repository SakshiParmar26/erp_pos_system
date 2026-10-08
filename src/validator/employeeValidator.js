const { z } = require('zod');

const locationRegex = /^[A-Za-z\s.'&()-]+$/;

const employeeValidator = z.object({
    franchise_id: z.coerce
        .number()
        .int()
        .positive(),

    first_name: z.string()
        .min(1, { message: 'First_name is too short.' })
        .max(20, { message: 'Last name is too long.' }),

    last_name: z.string()
        .min(1, { message: 'First name is too short.' })
        .max(20, { message: 'Last name is too long.' }),


    username: z.string()
        .min(1, { message: 'Username is too short.' })
        .max(20, { message: 'Username is too long.' }),

    role_id: z.coerce
        .number()
        .int()
        .positive(),


    password: z.string()
        .min(1, "Password must be at least 8 characters")
        .max(8),

    email: z.string()
        .email(),

    address: z.string()
        .min(3, { message: 'Address is too short.' }),

    city: z.string()
        .trim()
        .min(2, { message: 'City is too short.' })
        .max(20, { message: 'City is too long.' })
        .regex(locationRegex, "Invalid city name."),

    district: z.string()
        .trim()
        .min(2, { message: 'District is too short.' })
        .max(20, { message: 'District is too long.' })
        .regex(locationRegex, "Invalid district name."),

    state: z.string()
        .trim()
        .min(2, { message: 'State is too short.' })
        .max(20, { message: 'State is too long.' })
        .regex(locationRegex, "Invalid state name."),

    country: z.string()
        .trim()
        .min(2)
        .max(50)
        .regex(locationRegex, "Invalid country name."),

    pincode: z.string()
        .regex(/^[1-9][0-9]{5}$/, {
            message: "Pincode must be a valid 6-digit Indian PIN code"
        }),

    dob: z.string()
        .refine(
            (date) => !isNaN(Date.parse(date)),
            { message: "Invalid date format" }
        ),

    gender: z.enum(["Male", "Female", "Other"], {
        message: "Gender must be Male, Female, or Other"
    }),

    joining_date: z.string()
        .date("Invalid date format"),

    profile_image: z.string()
        .nullable()
        .optional()

});


module.exports = employeeValidator;