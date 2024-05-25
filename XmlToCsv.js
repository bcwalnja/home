const fs = require('fs');
const xml2js = require('xml2js');
const { Parser } = require('json2csv');

//take the xml from products.xml and convert it to csv

// Read the XML file
const xml = fs.readFileSync('/path/to/products.xml', 'utf-8');

// Parse the XML to JSON
xml2js.parseString(xml, (err, result) => {
    if (err) {
        console.error('Error parsing XML:', err);
        return;
    }

    // Convert JSON to CSV
    const json = result;
    const fields = Object.keys(json[Object.keys(json)[0]][0]);
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(json[Object.keys(json)[0]]);

    // Write the CSV to a file
    fs.writeFileSync('/path/to/products.csv', csv, 'utf-8');

    console.log('Conversion complete!');
});