/**
 * Google Apps Script for LAUGH TALE (UNTOLD) — Dual-Tab Sheet (Barcodes Only + Full Attendees)
 *
 * Automatically maintains TWO tabs in your Google Sheet:
 *   1. "Barcodes"  -> Only barcode_id (1 column, ready for scanner CSV export)
 *   2. "Attendees" -> Full details including barcode_id, name, email, phone, pass_type, quantity, amount_paid, utr_number, status, timestamp
 */

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var barcodeId = data.barcode_id || data.passId || '';

    // Tab 1: Barcodes Only
    var barcodeSheet = getOrCreateSheet(ss, 'Barcodes', ['barcode_id']);
    barcodeSheet.appendRow([barcodeId]);

    // Tab 2: Full Attendee Details + Barcode
    var attendeesSheet = getOrCreateSheet(ss, 'Attendees', [
      'barcode_id',
      'name',
      'email',
      'phone',
      'pass_type',
      'quantity',
      'amount_paid',
      'utr_number',
      'status',
      'timestamp'
    ]);
    attendeesSheet.appendRow([
      barcodeId,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.pass_type || 'OTAKU',
      data.quantity || 1,
      data.amountPaid || '',
      data.utrNumber || data.paymentId || '',
      data.status || 'in_review',
      data.timestamp || new Date().toISOString()
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      message: 'Appended to Barcodes and Attendees tabs'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
