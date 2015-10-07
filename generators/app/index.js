'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var randomstring = require("randomstring");

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the astounding ' + chalk.red('Batteries') + ' generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('api/'),
        this.destinationPath('api/')
      );
      this.fs.copy(
        this.templatePath('auth/'),
        this.destinationPath('auth/')
      );
      this.fs.copy(
        this.templatePath('client/'),
        this.destinationPath('client/')
      );
      this.fs.copy(
        this.templatePath('common/'),
        this.destinationPath('common/')
      );
      this.fs.copy(
        this.templatePath('proxy/'),
        this.destinationPath('proxy/')
      );
      this.fs.copy(
        this.templatePath('public/'),
        this.destinationPath('public/')
      );

    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('Dockerfile-api'),
        this.destinationPath('Dockerfile-api')
      );
      this.fs.copy(
        this.templatePath('Dockerfile-auth'),
        this.destinationPath('Dockerfile-auth')
      );
      this.fs.copy(
        this.templatePath('Dockerfile-client'),
        this.destinationPath('Dockerfile-client')
      );
      this.fs.copy(
        this.templatePath('Dockerfile-proxy'),
        this.destinationPath('Dockerfile-proxy')
      );
      this.fs.copyTpl(
        this.templatePath('docker-compose.yml'),
        this.destinationPath('docker-compose.yml'),
        {secret: randomstring.generate(16), db_password: randomstring.generate(8)}
      );
    }
  },

  install: function () {
    this.installDependencies();
    this.spawnCommand('gulp', ['init']);
  }
});
