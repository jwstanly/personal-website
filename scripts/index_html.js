const shell = require('shelljs');

shell.echo(
  `Placing HTML files into folders so S3 deployment can properly index them`,
);

shell.cd('out');
shell.ls('-R', '**/*.html').forEach(file => {
  const pathArray = file.split('/').slice(0, -1); // [blog,post]
  const fileName = file.split('/').pop(); // blog.html

  if (fileName !== 'index.html') {
    const pathToNewDir = `./${pathArray.length ? pathArray.join('/') : ''}/${
      fileName.split('.')[0]
    }`;

    shell.mkdir(pathToNewDir);
    shell.cp(file, `${pathToNewDir}/index.html`);
  }
});
shell.cd('..');
