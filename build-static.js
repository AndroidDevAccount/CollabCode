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

// Make the interview application the default Vercel page while preserving
// the original promotional landing page at /landing.html.
fs.copyFileSync(path.join(root, 'index.html'), path.join(output, 'landing.html'));
fs.copyFileSync(path.join(root, 'app.html'), path.join(output, 'index.html'));

console.log('Static client copied to public/');
