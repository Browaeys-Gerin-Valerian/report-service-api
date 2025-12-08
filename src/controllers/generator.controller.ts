import { Request, Response } from "express";
import { ValidatedRequest } from "../middlewares/zod/validateRequest.middleware";
import { documentGeneratorService } from "../services/generator/generator.service"
import { blueprintDbService } from "../services/db/blueprint.db.service";
import { templateDbService } from "../services/db/template.db.service";
import { detectContentType } from "../utils/functions.utils";

export const generatorController = {
    generate,
};

export async function generate(req: Request, res: Response) {
    const { body, files } = (req as ValidatedRequest).validated;

    const { data: { blueprint_id, template_id, output_format, data_to_insert } } = body
    try {
        const blueprint = await blueprintDbService.getOneById(blueprint_id);
        const template = await templateDbService.getOneById(template_id)

        if (!blueprint) return res.status(404).json({ error: "Blueprint not found" });
        if (!template) return res.status(404).json({ error: "Template not found" });


        const buffer = await documentGeneratorService.generate({
            template,
            data_structure: blueprint.data_structure,
            data_to_insert,
            files,
            output_format,
        });

        res.setHeader(
            "Content-Type",
            detectContentType(output_format)
        );
        res.setHeader("Content-Disposition", `attachment; filename="generated.${output_format}"`);
        res.send(buffer);

    } catch (err) {
        res.status(500).json({ error: "Failed to generate template", details: err });
    }
}
