/*

*/
import axios from 'axios';
import cheerio from 'cheerio';
import { exec } from 'child_process';
import path from 'path';

interface ConvertOptions {
  url: string;
  dest: string;
}

export const run = async () => {

  // const { url, dest } = options;

  const url = "https://docs.getodk.org/"
  const dest = "docs/odk"
  // Send an HTTP GET request to the URL
  axios.get(url)
    .then(response => {
      // Parse the HTML content of the response using Cheerio
      const $ = cheerio.load(response.data);

      // Find all links in the HTML content
      const links = $('a');

      // Loop through each link and convert to PDF
      links.each((i, link) => {
        const href = $(link).attr('href');
        if (href && (href.startsWith('/') || href.startsWith('http'))) {
          const urlToConvert = href.startsWith('http') ? href : url + href;
          const filename = path.basename(urlToConvert).replaceAll(/#|_|\/|\./g, "_");

          const outputPath = `${dest}/${filename}.pdf`;
          const command = `wkhtmltopdf ${urlToConvert} ${outputPath}`;
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error converting ${urlToConvert} to PDF: ${error.message}`);
            } else {
              console.log(`Converted ${urlToConvert} to PDF: ${outputPath}`);
            }
          });

        }
      });
    })
    .catch(error => console.error(error));
    console.log('Webscraping complete.');
};


(async () => {
  await run();
})();
