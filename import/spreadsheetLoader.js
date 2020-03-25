import log from "loglevel";
import google from "google-spreadsheet";
const GoogleSpreadsheet = google.GoogleSpreadsheet;

const loadRows = async (sheet, rowParser, limit=1, offset=0) => {
  const rows = await sheet.getRows({ limit, offset }); // can pass in { limit, offset }

  const entities = [];
  for (let i=0; i< rows.length; ++i) {
    const row = rows[i];
    log.debug(`loading row ${i}`);
    const entity = rowParser(row);
    entities.push(entity);
  }

  return entities;
};

export const loadSheet = async ({apiKey, spreadsheetId, sheetId, rowParser, limit}) => {
  const doc = new GoogleSpreadsheet(spreadsheetId); // spreadsheet key is the long id in the sheets URL
  doc.useApiKey(apiKey);

  await doc.loadInfo(); // loads document properties and worksheets
  log.info(`document title: ${doc.title}`);

  const sheet = doc.sheetsById[sheetId];
  log.info(`sheet: ${sheet.title}`);
  log.info(`rows: ${sheet.rowCount}`);

  return loadRows(sheet, rowParser, limit, 0);
};