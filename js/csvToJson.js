var csvToJson = {
    json: [],
    headers: [],

    go: function(url) {
        var _this = this;

        // AJAX call to get CSV data.
        $.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            async: false,

            success: function(data) {
                _this.processData(data);
            }
        });

        return this.json;
    },

    /*
     * Function: processData
     *     Converts data from CSV into JSON
     * 
     * Input: String (CSV data)
     */

    processData: function(data) {
        // Split the data file by rows; /\r/ is end of record for .csv files
        var rows = data.split(/\r/);

        this.getHeaders(rows[0]);
        this.convertRows(rows);
    },

    /*
     * Function: getHeaders
     *     Gets the headers from the CSV to be used as keys in the JSON object.
     * 
     * Input: String (first row of CSV)
     * Output: Array
     */

    getHeaders: function(row) {
        this.headers = row.split(',');
    },

    /*
     * Function: convertRows
     *     Converts all rows of a CSV (from an array of its rows) to JSON
     *
     * Input: Array (rows)
     * Output: Array of objects
     */

    convertRows: function(rows) {
        for (var i=1; i<rows.length; i++) {
            var row = rows[i].split(',');

            var obj = this.convertRow(row, i);

            this.json.push(obj);
        }
    },

    /*
     * Function: convertRow
     *     Converts a single row of a CSV into an object.
     *
     * Input: Array (the row), ID (which row)
     * Output: Object
     */

    convertRow: function(row, id) {
        // Setup the object with a unique ID.
        var obj = { 'id': id };

        // The rest of the items in the object are generated based on the headers (this.headers).
        for (var i=0; i<this.headers.length; i++) {
            obj[ this.headers[i] ] = row[i];
        }

        return obj;
    }
};
