const { z } = require("zod");

const contactValidator = z.object({
    employee_id: z.coerce
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    company_id: z.coerce
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    franchise_id: z.coerce
        .number()
        .int()
        .positive()
        .nullable()
        .optional(),

    phone: z.string()
        .regex(/^[6-9]\d{9}$/, "Contact number must be a valid 10-digit number."),

    status_id: z.coerce
        .number()
        .int()
        .positive()
});

module.exports = contactValidator;