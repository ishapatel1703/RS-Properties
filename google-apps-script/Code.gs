// Paste this file into the Apps Script project attached to your Google Sheet.
// Replace the notification email before deploying the web app.
const NOTIFICATION_EMAIL = 'YOUR_EMAIL@example.com';

function doGet() {
  return jsonResponse({ ok: true, message: 'Jabalpur Magic Property form endpoint is live.' });
}

function doPost(e) {
  const data = e && e.parameter ? e.parameter : {};

  // Quietly ignore simple bot submissions that fill the hidden field.
  if (data.website) {
    return jsonResponse({ ok: true });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email', 'Service', 'Budget', 'Locality', 'Message', 'Source']);
    }

    const row = [
      new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.service || '',
      data.budget || '',
      data.locality || '',
      data.message || '',
      'Website contact form'
    ];
    sheet.appendRow(row);

    const subject = 'New website enquiry from ' + (data.name || 'Unknown visitor');
    const body = [
      'A new enquiry was submitted on Jabalpur Magic Property.',
      '',
      'Name: ' + (data.name || '-'),
      'Phone: ' + (data.phone || '-'),
      'Email: ' + (data.email || '-'),
      'Service: ' + (data.service || '-'),
      'Budget: ' + (data.budget || '-'),
      'Locality: ' + (data.locality || '-'),
      'Message: ' + (data.message || '-')
    ].join('\n');
    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);

    return jsonResponse({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
