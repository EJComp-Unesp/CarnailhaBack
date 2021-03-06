var fs = require('fs-extra');
var path = require('path');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let server = require('../../loader.js');

var outputPath = __dirname + '/build_pages';
let data = {};
pages = [
  {
    name: `caravanas`,
    getUrl: `caravan`,
    getArrayName: `caravans`
  },
  {
    name: `faq`,
    getUrl: `faq`,
    getArrayName: `faqs`
  }
]
// First delete everything in the build directory.
console.log('Cleaning previous build...');
try {
  for (var file of fs.readdirSync(outputPath)) {
    fs.removeSync(path.join(outputPath, file));
  }
}
catch (err) {
  console.log('Error during cleanup: ' + err);
  process.exit(1);
}

// Generate each page from the data provided, using the template.
console.log('Generating pages...');
pages.forEach(page => {
  try {
    chai.request(server)
      .get(`/api/v1/${page.getUrl}`)
      .end(function (err, res) {
        var pageTemplate = require(`./${page.name}`);//Read the template of page
        data[`${page.getArrayName}`] = res.body[`${page.getArrayName}`];//Save the array of regs
        // console.log(data[`${page.getArrayName}`]);
        fs.writeFileSync(
          path.join(outputPath, `${page.name}.html`),
          pageTemplate.generatePage(data));
      }); //Write the file
      console.log(`- ${page.name}.html`);
  }
  catch (err) {
    console.log('Error during page generation: ' + err);
    process.exit(1);
  }
});

// Process complete.
console.log('Done!');