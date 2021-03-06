'use strict';
const SchemaReader = require('./schema-reader');
const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This makes `modelPath` a required argument.
    this.argument('modelPath', { type: String, required: true });

    this.schema = new SchemaReader(this.options.modelPath);
  }

  prompting() {
    this.log(
      `${chalk.green('React-Admin View Component Generator')}
Create views from Mongoose Schema`
    );

    const prompts = [
      {
        type: 'input',
        name: 'ressourceName',
        message: 'Ressource name',
        // Defaults to the project's folder name if the input is skipped
        // default: this.appname
        default: this.schema.getRessourceName()
      },
      {
        type: 'checkbox',
        name: 'views',
        message: 'What type of Views do you want to generate ?',
        choices: [
          {
            name: 'LIST',
            value: 'List',
            checked: true
          },
          {
            name: 'EDIT',
            value: 'Edit',
            checked: true
          },
          {
            name: 'CREATE',
            value: 'Create',
            checked: false
          },
          {
            name: 'SHOW',
            value: 'Show',
            checked: false
          }
        ]
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const ressourceName = this.props.ressourceName;
    const ressourceFolderName = ressourceName.toLowerCase();
    const context = {
      ressourceName: ressourceName,
      fields: this.schema.getPaths(),
      props: this.props,
      view: ''
    };

    // Generate Index
    this.fs.copyTpl(
      this.templatePath('ressource/index.ejs'),
      this.destinationPath('src/' + ressourceFolderName + '/index.js'),
      context
    );

    // Generate selected views
    for (let i = 0; i < this.props.views.length; i++) {
      const view = this.props.views[i];
      context.view = view;
      this.fs.copyTpl(
        this.templatePath('ressource/ressourceList.ejs'),
        this.destinationPath(
          'src/' + ressourceFolderName + '/' + ressourceName + view + '.js'
        ),
        context
      );
    }
  }

  install() {
    this.installDependencies();
  }
};
