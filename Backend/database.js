var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

const tableName = "pixels";
const CREATE_TABLE = `CREATE TABLE ${tableName} (
    x INTEGER,
    y INTEGER,
    color TEXT,
    displayName TEXT NOT NULL, 
    timestamp INTEGER NOT NULL,
    PRIMARY KEY (x,y)
    )`;
const INSERT = `INSERT OR IGNORE INTO ${tableName} (x, y, color, displayName, timestamp) VALUES (?,?,?,?,?)`;
const UPDATE_PIXEL = (x, y, color, displayName, timestmap) =>
  `UPDATE ${tableName} SET color='${color}', displayName='${displayName}', timestamp='${timestmap}' WHERE x='${x}' AND y='${y}'`;

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the SQLite database.");
  db.run(CREATE_TABLE, (err) => {
    if (err) {
      console.log("Table already exists.");
    }
  });
});

const insert = (x, y, color, displayName) => {
  updatePixel(x, y, color, displayName);
  db.run(INSERT, [x, y, color, displayName, Date.now()]);
};

const updatePixel = (x, y, color, displayName) => {
  db.run(UPDATE_PIXEL(x, y, color, displayName, Date.now()));
};

const getAllPixels = (callback) => {
  db.all(`SELECT * FROM ${tableName}`, [], callback);
};

const getPixelsSince = (since, callback) => {
  db.all(`SELECT * FROM ${tableName} WHERE timestamp >= ${since}`, [], callback);
};

const deletePixel = (x, y) => {
  db.run(`DELETE FROM ${tableName} WHERE x='${x}' AND y='${y}'`);
};

const deleteClearPixels = () => {
  db.run(`DELETE FROM ${tableName} WHERE color='clear'`);
};

const deleteUsersPixels = (displayName) => {
    db.run(`DELETE FROM ${tableName} WHERE displayName='${displayName}'`);
};

setInterval(deleteClearPixels, 60000);

module.exports = { insert, getAllPixels, getPixelsSince, deletePixel, deleteUsersPixels };
