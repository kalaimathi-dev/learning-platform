const PDFDocument = require('pdfkit');
const Progress = require('../models/Progress');
const Course = require('../models/Course');

function makeCertificateId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CERT-${Date.now()}-${rand}`;
}

// Generate certificate PDF after completing a course
exports.downloadCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const progress = await Progress.findOne({ userId: req.user._id, courseId });
    if (!progress || progress.status !== 'completed') {
      return res.status(400).json({ message: 'Complete the course to download the certificate' });
    }

    const course = await Course.findById(courseId).select('title category difficulty');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!progress.certificateId) {
      progress.certificateId = makeCertificateId();
      progress.certificateIssuedAt = new Date();
      await progress.save();
    }

    const issuedDate = progress.certificateIssuedAt || new Date();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course.title.replace(/[^a-z0-9]/gi, '-')}.pdf"`);

    const doc = new PDFDocument({ 
      size: 'A4', 
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const blue = '#1E3A8A';
    const gold = '#D4AF37';
    const lightBlue = '#3B82F6';

    // Background decorative elements
    // Top-left diagonal stripe
    doc.save();
    doc.polygon([0, 0], [250, 0], [0, 150])
       .fill(blue);
    doc.polygon([0, 0], [230, 0], [0, 130])
       .fill(lightBlue);
    doc.restore();

    // Top-left gold accent
    doc.save();
    doc.moveTo(0, 100).lineTo(150, 0).lineWidth(3).stroke(gold);
    doc.restore();

    // Bottom-right diagonal stripe
    doc.save();
    doc.polygon([pageWidth, pageHeight], [pageWidth - 250, pageHeight], [pageWidth, pageHeight - 150])
       .fill(blue);
    doc.polygon([pageWidth, pageHeight], [pageWidth - 230, pageHeight], [pageWidth, pageHeight - 130])
       .fill(lightBlue);
    doc.restore();

    // Bottom-right gold accent
    doc.save();
    doc.moveTo(pageWidth, pageHeight - 100).lineTo(pageWidth - 150, pageHeight).lineWidth(3).stroke(gold);
    doc.restore();

    // Border
    doc.save();
    doc.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 10)
       .lineWidth(2)
       .stroke(gold);
    doc.restore();

    // Gold seal/medal on the left
    const sealX = 120;
    const sealY = pageHeight / 2;
    doc.save();
    doc.circle(sealX, sealY, 35).fill(gold);
    doc.circle(sealX, sealY, 30).lineWidth(2).stroke(blue);
    doc.circle(sealX, sealY, 25).fill(gold);
    
    // Ribbon
    doc.polygon(
      [sealX - 15, sealY + 25],
      [sealX + 15, sealY + 25],
      [sealX + 10, sealY + 55],
      [sealX, sealY + 45],
      [sealX - 10, sealY + 55]
    ).fill(lightBlue);
    doc.restore();

    // Header
    doc.fontSize(32)
       .fillColor(blue)
       .font('Helvetica-Bold')
       .text('CERTIFICATE', 200, 80, { align: 'center', width: pageWidth - 400 });
    
    doc.fontSize(14)
       .fillColor('#666')
       .font('Helvetica')
       .text('of Completion', 200, 118, { align: 'center', width: pageWidth - 400 });

    // Student Name (elegant/script-like)
    doc.fontSize(42)
       .fillColor(lightBlue)
       .font('Helvetica-BoldOblique')
       .text(req.user.name || 'Student', 200, 170, { 
         align: 'center', 
         width: pageWidth - 400 
       });

    // Description text
    doc.fontSize(12)
       .fillColor('#444')
       .font('Helvetica')
       .text(
         'This certificate is proudly presented for successfully completing the comprehensive learning path and demonstrating excellence in mastering the subject matter. This achievement reflects dedication, commitment, and a passion for continuous learning.',
         200, 240, 
         { align: 'center', width: pageWidth - 400, lineGap: 3 }
       );

    // Course title
    doc.fontSize(22)
       .fillColor(blue)
       .font('Helvetica-Bold')
       .text(course.title, 200, 320, { 
         align: 'center', 
         width: pageWidth - 400 
       });

    // Course details
    doc.fontSize(11)
       .fillColor('#666')
       .font('Helvetica')
       .text(
         `${course.category}  •  ${course.difficulty} Level`,
         200, 360, 
         { align: 'center', width: pageWidth - 400 }
       );

    // Footer section
    const footerY = pageHeight - 100;
    
    // Date
    doc.fontSize(9)
       .fillColor('#444')
       .font('Helvetica')
       .text('Date:', 100, footerY, { continued: false });
    
    doc.fontSize(10)
       .fillColor('#222')
       .font('Helvetica-Bold')
       .text(issuedDate.toLocaleDateString('en-US', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       }), 100, footerY + 15);

    // Certificate ID
    doc.fontSize(9)
       .fillColor('#444')
       .font('Helvetica')
       .text('Certificate ID:', pageWidth - 250, footerY);
    
    doc.fontSize(10)
       .fillColor('#222')
       .font('Helvetica-Bold')
       .text(progress.certificateId, pageWidth - 250, footerY + 15);

    // Platform signature
    doc.fontSize(10)
       .fillColor(blue)
       .font('Helvetica-Bold')
       .text('EDSL Platform', 200, footerY + 30, { 
         align: 'center', 
         width: pageWidth - 400 
       });
    
    doc.fontSize(8)
       .fillColor('#666')
       .font('Helvetica')
       .text('Experience-Driven Strategic Learning', 200, footerY + 45, { 
         align: 'center', 
         width: pageWidth - 400 
       });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
