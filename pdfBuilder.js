// Simple PDF generator in pure Node.js (Zero external dependencies)
const fs = require('fs');
const zlib = require('zlib');

class SimplePdfDoc {
  constructor() {
    this.pages = [];
    this.objects = [];
  }

  addPage(width = 595.28, height = 841.89) { // A4 size in points (72 points/inch)
    const page = {
      width,
      height,
      stream: []
    };
    this.pages.push(page);
    return page;
  }

  // Draw rectangle with fill and/or stroke
  drawRect(page, x, y, w, h, fillColor = null, strokeColor = null, lineWidth = 1) {
    let op = '';
    if (fillColor) {
      op += `${fillColor.r} ${fillColor.g} ${fillColor.b} rg\n`;
    }
    if (strokeColor) {
      op += `${strokeColor.r} ${strokeColor.g} ${strokeColor.b} RG\n`;
      op += `${lineWidth} w\n`;
    }
    op += `${x} ${y} ${w} ${h} re\n`;
    if (fillColor && strokeColor) {
      op += 'B\n';
    } else if (fillColor) {
      op += 'f\n';
    } else if (strokeColor) {
      op += 'S\n';
    }
    page.stream.push(op);
  }

  // Draw line
  drawLine(page, x1, y1, x2, y2, strokeColor = { r: 0.8, g: 0.85, b: 0.9 }, lineWidth = 1) {
    page.stream.push(
      `${strokeColor.r} ${strokeColor.g} ${strokeColor.b} RG\n` +
      `${lineWidth} w\n` +
      `${x1} ${y1} m\n` +
      `${x2} ${y2} l\n` +
      `S\n`
    );
  }

  // Draw text
  drawText(page, text, x, y, font = 'F1', size = 11, color = { r: 0.1, g: 0.1, b: 0.15 }) {
    // Escape special PDF characters
    const escaped = text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

    page.stream.push(
      `BT\n` +
      `/${font} ${size} Tf\n` +
      `${color.r} ${color.g} ${color.b} rg\n` +
      `1 0 0 1 ${x} ${y} Tm\n` +
      `(${escaped}) Tj\n` +
      `ET\n`
    );
  }

  build() {
    let objCount = 0;
    const addObject = (data) => {
      objCount++;
      return { id: objCount, data };
    };

    // 1. Font objects
    const fontRegular = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
    const fontBold = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);
    const fontItalic = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>`);

    // Resources dictionary
    const resourcesObj = addObject(
      `<< /Font << /F1 ${fontRegular.id} 0 R /F2 ${fontBold.id} 0 R /F3 ${fontItalic.id} 0 R >> >>`
    );

    // Page object placeholders
    const pageObjRefs = [];
    const pageObjs = [];
    const contentObjs = [];

    for (const page of this.pages) {
      const contentStr = page.stream.join('\n');
      const contentBuf = Buffer.from(contentStr, 'utf-8');
      
      const contentObj = addObject(
        `<< /Length ${contentBuf.length} >>\nstream\n${contentStr}\nendstream`
      );
      contentObjs.push(contentObj);

      const pageObj = addObject(''); // will update with parent & contents
      pageObjs.push(pageObj);
      pageObjRefs.push(`${pageObj.id} 0 R`);
    }

    // Pages root object
    const pagesRootObj = addObject('');

    // Update page objects
    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i];
      pageObjs[i].data = `<< /Type /Page /Parent ${pagesRootObj.id} 0 R /MediaBox [0 0 ${p.width} ${p.height}] /Resources ${resourcesObj.id} 0 R /Contents ${contentObjs[i].id} 0 R >>`;
    }

    // Update pages root
    pagesRootObj.data = `<< /Type /Pages /Kids [${pageObjRefs.join(' ')}] /Count ${this.pages.length} >>`;

    // Catalog object
    const catalogObj = addObject(`<< /Type /Catalog /Pages ${pagesRootObj.id} 0 R >>`);

    // Collect all objects in order of ID
    const allObjs = [
      fontRegular, fontBold, fontItalic,
      resourcesObj,
      ...contentObjs,
      ...pageObjs,
      pagesRootObj,
      catalogObj
    ].sort((a, b) => a.id - b.id);

    // Assemble PDF
    let output = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    const xref = [0]; // offset for obj 0

    for (const obj of allObjs) {
      const offset = Buffer.byteLength(output, 'utf-8');
      xref.push(offset);
      output += `${obj.id} 0 obj\n${obj.data}\nendobj\n`;
    }

    const startXref = Buffer.byteLength(output, 'utf-8');
    output += `xref\n0 ${allObjs.length + 1}\n`;
    output += '0000000000 65535 f \n';
    for (let i = 1; i <= allObjs.length; i++) {
      const off = String(xref[i]).padStart(10, '0');
      output += `${off} 00000 n \n`;
    }

    output += `trailer\n<< /Size ${allObjs.length + 1} /Root ${catalogObj.id} 0 R >>\n`;
    output += `startxref\n${startXref}\n%%EOF\n`;

    return Buffer.from(output, 'utf-8');
  }
}

module.exports = { SimplePdfDoc };

