import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { unflattenDotObject } from "@/utils/objectHelpers";
import { SECTION_SHEET_NAMES } from "@/utils/labels";

function createSheet(
    wb: XLSX.WorkBook,
    sheetName: string,
    data: Record<string, unknown>[]
) {
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 30 }, { wch: 80 }];
    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
}

/**
 * POST /api/export
 *
 * Exports patient data in the requested format.
 *
 * Request body:
 * - data: flattened patient data object with dot-notation keys
 * - format: 'csv' | 'xlsx' | 'json'
 *
 * CSV: flat table (1 header row + 1 row per patient) directly usable for statistics.
 * XLSX: a SYNTHESE flat sheet followed by one Champ/Valeur sheet per section.
 * JSON: nested structure identical to the parsed PatientData object.
 */
export async function POST(request: NextRequest) {
    try {
        let data: Record<string, unknown>;
        let format: string;

        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const body = await request.json();
            data = body.data;
            format = body.format;
        } else {
            const formData = await request.formData();
            const payloadString = formData.get("payload") as string;

            if (!payloadString) {
                return NextResponse.json({ error: "No payload" }, { status: 400 });
            }

            const payload = JSON.parse(payloadString);
            data = payload.data;
            format = payload.format;
        }

        if (!data) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }

        const patientName = String(
            data["section1.nomPatient"] || data["nomPatient"] || "patient"
        );
        const patientId = String(
            data["section1.idPatient"] || data["idPatient"] || ""
        );

        const cleanName = patientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const cleanId = patientId.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        const baseName = [cleanName, cleanId].filter(Boolean).join('_') || 'export_scaleneo';
        const dateStr = new Date().toISOString().split('T')[0];
        const filenamePre = `export_${baseName}_${dateStr}`;

        if (format === "csv") {
            const flatSheet = XLSX.utils.json_to_sheet([data]);
            const csvContent = XLSX.utils.sheet_to_csv(flatSheet);
            const csvBuffer = Buffer.from('\uFEFF' + csvContent, 'utf-8');

            return fileResponse(csvBuffer, `${filenamePre}.csv`, "text/csv;charset=utf-8");
        }

        if (format === "xlsx") {
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([data]), "SYNTHESE");

            for (const [category, rows] of Object.entries(categorizeData(data))) {
                createSheet(workbook, category, rows);
            }

            const b64 = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
            const buffer = Buffer.from(b64, "base64");

            return fileResponse(
                buffer,
                `${filenamePre}.xlsx`,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        }

        if (format === "json") {
            const nested = unflattenDotObject(data);
            const jsonBuffer = Buffer.from(JSON.stringify(nested, null, 2), "utf-8");

            return fileResponse(jsonBuffer, `${filenamePre}.json`, "application/json;charset=utf-8");
        }

        return NextResponse.json(
            { error: "Invalid format" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json(
            { error: "Export failed" },
            { status: 500 }
        );
    }
}

function fileResponse(buffer: Buffer, filename: string, mimeType: string): NextResponse {
    return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Type": mimeType,
            "Content-Length": buffer.length.toString(),
        },
    });
}

function categorizeData(data: Record<string, unknown>): Record<string, Record<string, unknown>[]> {
    const categories: Record<string, Record<string, unknown>[]> = {};

    for (const [key, value] of Object.entries(data)) {
        const parts = key.split('.');
        const prefix = parts.length > 1 ? parts[0] : null;
        const categoryName = prefix ? (SECTION_SHEET_NAMES[prefix] ?? prefix.toUpperCase()) : "GENERAL";
        const fieldName = prefix ? parts.slice(1).join(' ') : key;

        if (!categories[categoryName]) {
            categories[categoryName] = [];
        }

        categories[categoryName].push({
            Champ: fieldName,
            Valeur: value
        });
    }

    return categories;
}
