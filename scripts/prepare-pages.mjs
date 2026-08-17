import { copyFile, mkdir, writeFile } from 'node:fs/promises';

const routes = [
  'resort',
  'camere',
  'camera-doppia',
  'camera-tripla',
  'camera-quadrupla',
  'junior-suite',
  'ristorante',
  'itinerari',
  'servizi-extra',
  'contatti',
];

await copyFile('dist/index.html', 'dist/404.html');
await writeFile('dist/.nojekyll', '');

await Promise.all(
  routes.map(async (route) => {
    const routeDirectory = `dist/${route}`;
    await mkdir(routeDirectory, { recursive: true });
    await copyFile('dist/index.html', `${routeDirectory}/index.html`);
  }),
);

console.log('Prepared GitHub Pages routes, SPA fallback, and Jekyll bypass.');
