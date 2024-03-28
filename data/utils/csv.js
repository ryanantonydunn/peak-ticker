function csvToString(rows) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          return str.includes(",") ? `"${str}"` : str;
        })
        .join(",")
    )
    .join("\n");
}

module.exports = {
  csvToString,
};
