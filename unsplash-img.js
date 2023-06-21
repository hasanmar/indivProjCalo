const path = require('path');
const fs = require('fs');
const https = require('https');
const { program } = require('commander');

program
  .arguments('<topic> <orientation> [file_name]')
  .description('Download image from unsplash, arguments are topic, oritentation and filename (optional)')
  .action((topic, orientation, file_name) => {
    const file_path = path.join(process.cwd(), file_name || 'image.jpg');
    https.get(`https://api.unsplash.com/photos/random?client_id=ZU5oh9XPiJyROCTNPGJ6_5YhT2BhbXWJ3GzjtI49Uko&topics=${topic}&orientation=${orientation}`, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const responseData = JSON.parse(data);
        const imageUrl = responseData.urls.raw;
        const file = fs.createWriteStream(file_path);
        https.get(imageUrl, (response) => {
          response.pipe(file);
          console.log(`Image saved to ${file_path}`);
        });
      });
    }).on('error', (err) => {
      console.error(err);
    });
  });

program.parse(process.argv);