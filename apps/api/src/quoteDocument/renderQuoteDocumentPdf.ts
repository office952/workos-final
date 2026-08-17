import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PageSizes, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { QuoteDocumentModel } from "@workos-final/domain";

const MARGIN = 48;
const TITLE_SIZE = 22;
const HEADING_SIZE = 11;
const BODY_SIZE = 10;
const SMALL_SIZE = 9;
const LINE_GAP = 4;
const SECTION_GAP = 14;
const INK = rgb(0.12, 0.12, 0.14);
const MUTED = rgb(0.38, 0.38, 0.4);
const RULE = rgb(0.78, 0.78, 0.8);

const FONT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "fonts",
  "NotoSans-Regular.ttf",
);

type DrawCursor = {
  page: PDFPage;
  font: PDFFont;
  width: number;
  height: number;
  y: number;
};

export function quoteDocumentDrawLines(model: QuoteDocumentModel): string[] {
  const lines = [
    model.issuerName,
    model.title,
    `Referință: ${model.reference}`,
    `Data: ${model.issuedOn}`,
    model.status,
    "Produs",
    model.productName,
  ];
  if (model.inscription) {
    lines.push("Înscripție", model.inscription);
  }
  if (model.configuration.length > 0) {
    lines.push("Configurație");
    for (const line of model.configuration) {
      lines.push(`${line.label}: ${line.value}`);
    }
  }
  if (model.technicalSummary.length > 0) {
    lines.push("Date tehnice");
    for (const line of model.technicalSummary) {
      lines.push(`${line.label}: ${line.value}`);
    }
  }
  lines.push(
    "Preț",
    `${model.commercial.netLabel}: ${model.commercial.netDisplay} ${model.commercial.currency}`,
    `${model.commercial.vatLabel}: ${model.commercial.vatDisplay} ${model.commercial.currency}`,
    `${model.commercial.grossLabel}: ${model.commercial.grossDisplay} ${model.commercial.currency}`,
    "Document derivat din oferta înghețată.",
  );
  return lines;
}

export async function renderQuoteDocumentPdf(model: QuoteDocumentModel): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(readFileSync(FONT_PATH), { subset: true });
  const [width, height] = PageSizes.A4;
  const cursor: DrawCursor = {
    page: pdf.addPage([width, height]),
    font,
    width,
    height,
    y: height - MARGIN,
  };

  drawText(pdf, cursor, model.issuerName, SMALL_SIZE, MUTED);
  cursor.y -= 6;
  drawText(pdf, cursor, model.title, TITLE_SIZE, INK);
  cursor.y -= 8;
  drawRule(cursor);
  cursor.y -= SECTION_GAP;
  drawText(pdf, cursor, `Referință: ${model.reference}`, BODY_SIZE, INK);
  drawText(pdf, cursor, `Data: ${model.issuedOn}`, BODY_SIZE, INK);
  drawText(pdf, cursor, model.status, BODY_SIZE, MUTED);
  cursor.y -= SECTION_GAP;

  drawHeading(pdf, cursor, "Produs");
  drawText(pdf, cursor, model.productName, BODY_SIZE, INK);
  if (model.inscription) {
    cursor.y -= 6;
    drawHeading(pdf, cursor, "Înscripție");
    drawText(pdf, cursor, model.inscription, BODY_SIZE, INK);
  }

  if (model.configuration.length > 0) {
    cursor.y -= SECTION_GAP;
    drawHeading(pdf, cursor, "Configurație");
    for (const line of model.configuration) {
      drawText(pdf, cursor, `${line.label}: ${line.value}`, BODY_SIZE, INK);
    }
  }

  if (model.technicalSummary.length > 0) {
    cursor.y -= SECTION_GAP;
    drawHeading(pdf, cursor, "Date tehnice");
    for (const line of model.technicalSummary) {
      drawText(pdf, cursor, `${line.label}: ${line.value}`, BODY_SIZE, INK);
    }
  }

  cursor.y -= SECTION_GAP;
  drawHeading(pdf, cursor, "Preț");
  drawText(
    pdf,
    cursor,
    `${model.commercial.netLabel}: ${model.commercial.netDisplay} ${model.commercial.currency}`,
    BODY_SIZE,
    INK,
  );
  drawText(
    pdf,
    cursor,
    `${model.commercial.vatLabel}: ${model.commercial.vatDisplay} ${model.commercial.currency}`,
    BODY_SIZE,
    INK,
  );
  drawText(
    pdf,
    cursor,
    `${model.commercial.grossLabel}: ${model.commercial.grossDisplay} ${model.commercial.currency}`,
    HEADING_SIZE,
    INK,
  );

  ensureSpace(pdf, cursor, 28);
  cursor.y -= 10;
  drawRule(cursor);
  drawText(pdf, cursor, "Document derivat din oferta înghețată.", SMALL_SIZE, MUTED);

  return pdf.save();
}

function drawHeading(pdf: PDFDocument, cursor: DrawCursor, text: string): void {
  drawText(pdf, cursor, text, HEADING_SIZE, MUTED);
  cursor.y -= 2;
}

function drawText(
  pdf: PDFDocument,
  cursor: DrawCursor,
  text: string,
  size: number,
  color: ReturnType<typeof rgb>,
): void {
  const maxWidth = cursor.width - MARGIN * 2;
  const wrapped = wrapText(text, cursor.font, size, maxWidth);
  const lineHeight = size + LINE_GAP;
  for (const line of wrapped) {
    ensureSpace(pdf, cursor, lineHeight);
    cursor.page.drawText(line, {
      x: MARGIN,
      y: cursor.y - size,
      size,
      font: cursor.font,
      color,
    });
    cursor.y -= lineHeight;
  }
}

function drawRule(cursor: DrawCursor): void {
  cursor.page.drawLine({
    start: { x: MARGIN, y: cursor.y },
    end: { x: cursor.width - MARGIN, y: cursor.y },
    thickness: 0.75,
    color: RULE,
  });
  cursor.y -= 8;
}

function ensureSpace(pdf: PDFDocument, cursor: DrawCursor, needed: number): void {
  if (cursor.y - needed >= MARGIN) {
    return;
  }
  cursor.page = pdf.addPage([cursor.width, cursor.height]);
  cursor.y = cursor.height - MARGIN;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
      continue;
    }
    current = "";
    let chunk = "";
    for (const character of word) {
      const trial = chunk + character;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
        chunk = trial;
        continue;
      }
      if (chunk) {
        lines.push(chunk);
      }
      chunk = character;
    }
    current = chunk;
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}
