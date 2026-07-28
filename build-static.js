const fs = require('fs');
const path = require('path');

const root = __dirname;
const output = path.join(root, 'public');
const directories = ['docs', 'images', 'lib', 'scripts', 'styles'];
const files = ['index.html', 'app.html', 'reset-password.html'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), {
    recursive: true
  });
}

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

console.log('Static client copied to public/');
