'use strict';

const fs = require('node:fs');

const HEADERS = [
  'row_code', 'revision', 'furthest_step', 'completed', 'elapsed_bucket',
  'assistance_count', 'validation_error_count', 'client_error_count', 'load_bucket',
  'progress_recognized', 'draft_status_recognized', 'trust_feedback', 'top_friction',
  'accessibility_or_support_note'
];
const STEPS = ['topic_opened', 'lesson_viewed', 'attempt_submitted', 'explanation_viewed'];
const ELAPSED = ['under_3m', '3_to_5m', 'over_5m', 'not_completed'];
const LOADS = ['under_1s', '1_to_3s', 'over_3s', 'unknown'];
const YES_NO = ['yes', 'no', 'not_asked'];

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += char;
  }
  if (quoted) throw new Error('Unclosed quoted field');
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows.filter((item) => item.some((value) => value !== ''));
}

function nonNegativeInteger(value) {
  return /^\d+$/.test(value) && Number(value) <= 99;
}

function validateAndAnalyze(text) {
  const matrix = parseCsv(text);
  if (!matrix.length) throw new Error('Worksheet is empty');
  if (matrix[0].join('\u0000') !== HEADERS.join('\u0000')) {
    throw new Error('Headers must exactly match the privacy-approved worksheet schema');
  }
  const records = matrix.slice(1).map((values, index) => {
    if (values.length !== HEADERS.length) throw new Error(`Row ${index + 2}: expected ${HEADERS.length} fields`);
    return Object.fromEntries(HEADERS.map((header, fieldIndex) => [header, values[fieldIndex].trim()]));
  });
  const seenCodes = new Set();
  records.forEach((record, index) => {
    const row = index + 2;
    if (!/^P\d{2,3}$/.test(record.row_code) || seenCodes.has(record.row_code)) throw new Error(`Row ${row}: invalid or duplicate row_code`);
    seenCodes.add(record.row_code);
    if (!record.revision) throw new Error(`Row ${row}: revision is required`);
    if (!STEPS.includes(record.furthest_step)) throw new Error(`Row ${row}: invalid furthest_step`);
    if (!['yes', 'no'].includes(record.completed)) throw new Error(`Row ${row}: invalid completed value`);
    if (!ELAPSED.includes(record.elapsed_bucket)) throw new Error(`Row ${row}: invalid elapsed_bucket`);
    ['assistance_count', 'validation_error_count', 'client_error_count'].forEach((field) => {
      if (!nonNegativeInteger(record[field])) throw new Error(`Row ${row}: invalid ${field}`);
    });
    if (!LOADS.includes(record.load_bucket)) throw new Error(`Row ${row}: invalid load_bucket`);
    ['progress_recognized', 'draft_status_recognized'].forEach((field) => {
      if (!YES_NO.includes(record[field])) throw new Error(`Row ${row}: invalid ${field}`);
    });
    if ((record.completed === 'yes') !== (record.furthest_step === 'explanation_viewed')) {
      throw new Error(`Row ${row}: completed must agree with furthest_step`);
    }
  });

  const count = (predicate) => records.filter(predicate).length;
  const funnel = Object.fromEntries(STEPS.map((step, stepIndex) => [
    step,
    count((record) => STEPS.indexOf(record.furthest_step) >= stepIndex)
  ]));
  return {
    denominator: records.length,
    revisions: [...new Set(records.map((record) => record.revision))],
    funnel,
    completed: count((record) => record.completed === 'yes'),
    elapsedBuckets: Object.fromEntries(ELAPSED.map((bucket) => [bucket, count((record) => record.elapsed_bucket === bucket)])),
    sessionsWithAssistance: count((record) => Number(record.assistance_count) > 0),
    totalValidationErrors: records.reduce((sum, record) => sum + Number(record.validation_error_count), 0),
    totalClientErrors: records.reduce((sum, record) => sum + Number(record.client_error_count), 0),
    loadBuckets: Object.fromEntries(LOADS.map((bucket) => [bucket, count((record) => record.load_bucket === bucket)])),
    progressNotRecognized: count((record) => record.progress_recognized === 'no'),
    draftStatusNotRecognized: count((record) => record.draft_status_recognized === 'no'),
    textReviewRequired: records.some((record) => record.trust_feedback || record.top_friction || record.accessibility_or_support_note)
  };
}

if (require.main === module) {
  const path = process.argv[2];
  if (!path) { console.error('Usage: node pilot-analysis.js <worksheet.csv>'); process.exit(2); }
  try { console.log(JSON.stringify(validateAndAnalyze(fs.readFileSync(path, 'utf8')), null, 2)); }
  catch (error) { console.error(error.message); process.exit(1); }
}

module.exports = { HEADERS, parseCsv, validateAndAnalyze };
