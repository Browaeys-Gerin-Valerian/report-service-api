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
    const { template_id, blueprint_id, output_format, data } =
        (req as ValidatedRequest).validated.body;
    try {
        const blueprint = await blueprintDbService.getOneById(blueprint_id);
        const template = await templateDbService.getOneById(template_id)

        if (!blueprint) return res.status(404).json({ error: "Blueprint not found" });
        if (!template) return res.status(404).json({ error: "Template not found" });

        const buffer = await documentGeneratorService.generate({
            template,
            data,
            data_structure: blueprint.data_structure,
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
