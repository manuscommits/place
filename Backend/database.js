const fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";
const backupDir = "./backups";
const backupInterval = 60 * 60 * 1000;

const tableName = "pixels";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the SQLite database.");
  db.run(
    `CREATE TABLE ${tableName} (
    x INTEGER,
    y INTEGER,
    color TEXT,
    displayName TEXT NOT NULL, 
    timestamp INTEGER NOT NULL,
    PRIMARY KEY (x,y)
    )`,
    (err) => {
      if (err) {
        // console.log("Table already exists.");
      }
    }
  );
});

const insert = (x, y, color, displayName) => {
  updatePixel(x, y, color, displayName);
  db.run(
    `INSERT OR IGNORE INTO ${tableName} (x, y, color, displayName, timestamp) VALUES (?,?,?,?,?)`,
    [x, y, color, displayName, Date.now()]
  );
};

const updatePixel = (x, y, color, displayName) => {
  db.run(
    `UPDATE ${tableName} SET color='${color}', displayName='${displayName}', timestamp='${Date.now()}' WHERE x='${x}' AND y='${y}'`
  );
};

const getAllPixels = (callback) => {
  db.all(`SELECT * FROM ${tableName}`, [], callback);
};

const deletePixel = (x, y) => {
  db.run(`DELETE FROM ${tableName} WHERE x='${x}' AND y='${y}'`);
};

const deleteUsersPixels = (displayName) => {
  db.run(`DELETE FROM ${tableName} WHERE displayName='${displayName}'`);
};

const getAllBackups = (func) => {
  fs.readdir(backupDir, (err, files) => {
    if (err) throw err;
    func(files);
  });
};

const saveBackup = (backups) => {
  const now = new Date().toISOString().split("T")[0];
  const backupName = `${now}_db.sqlite`;
  if (backups.includes(backupName)) return;
  fs.copyFile(DBSOURCE, `${backupDir}/${backupName}`, (err) => {
    if (err) throw err;
    console.log(`Backup saved to ${backupName}.`);
  });
};

const startBackupLoop = () => {
  setInterval(() => getAllBackups(saveBackup), backupInterval);
};

startBackupLoop();

module.exports = { insert, getAllPixels, deletePixel, deleteUsersPixels };
