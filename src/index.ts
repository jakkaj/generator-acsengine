'use strict';
const Generator =  require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

class AcsGenerator extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the fantastic ${chalk.red('generator-acsengine')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'windowsContainers',
        message: 'How many Windows based nodes would you like?',
        default: 0
      },
      {
        type: 'input',
        name: 'linuxContainers',
        message: 'How many Linux based nodes would you like?',
        default: 2
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.log(
      `Okay - let's build ${chalk.red(this.props.linuxContainers)} Linux nodes and ${chalk.red(this.props.windowsContainers)} Windows nodes!`
      );
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }

  install() {
    this.installDependencies();
  }
}

export = AcsGenerator;