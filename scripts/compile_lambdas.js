const sh = require('shelljs');

sh.echo('Compiling TypeScript Lambda functions into /sam/handlers');
sh.cd('sam');
sh.exec('tsc -p tsconfig.sam.json');
sh.cd('..');