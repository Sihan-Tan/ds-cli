const shell = require('shelljs');
const inquirer = require('inquirer');
const { logWithSpinner, stopSpinner } = require('./spinner');
const gitRepo = require('../package.json').gitRepo;
const { error } = require('./tool');
const download = require('download-git-repo');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

async function create(projectName, options) {
  const cwd = shell.pwd().stdout;
  const inCurrent = projectName === '.';
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || '.');
  const isInRoot = fs.existsSync(targetDir);
  if (isInRoot) {
    if (options.force) {
      shell.rm('-rf', targetDir);
    } else {
      shell.exec('clear');
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`,
          },
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(
              targetDir
            )} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Cancel', value: false },
            ],
          },
        ]);
        if (!action) {
          return;
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          shell.rm('-rf', targetDir);
        }
      }
    }
  }
  logWithSpinner('⏰ downloading template.....');
  const template = `direct:${gitRepo}#main`;
  download(template, targetDir, { clone: true }, function (err) {
    stopSpinner(false);
    if (err) {
      console.log(chalk.red('下载失败😭'));
    } else {
      shell.sed('-i', 'vue-base', name, targetDir + '/package.json');
      chalk.green(` cd ${name} \n npm install`);
    }
  });
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    stopSpinner(false); // do not persist
    error(err);
  });
};
