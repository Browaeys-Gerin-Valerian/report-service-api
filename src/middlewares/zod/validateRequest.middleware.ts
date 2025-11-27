import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { parsedBody } from "../../utils/functions.utils";

export type ValidatedRequest = Request & {
    validated: {
        params: any;
        query: any;
        body: any;
        file: any;
    };
};

export function validateRequest(schema: ZodSchema<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                params: req.params,
                query: req.query,
                body: req.body ? parsedBody(req.body) : {},
                file: req.file,
            };

            const parsed = schema.parse(data);


            (req as ValidatedRequest).validated = parsed;

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    error: "Validation error",
                    issues: err.issues
                });
            }
            next(err);
        }
    };
}
