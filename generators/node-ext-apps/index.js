const Generator = require('yeoman-generator')
const CertificateCreator = require('../lib/certificate-creator')

module.exports = class extends Generator {
  prompting () {
    return this.prompt([
      {
        type    : 'list',
        name    : 'node_ext_app_tpl',
        message : 'Which template do you want to start with',
        choices : ['Pizza Demo Extension App & Bot']
      }
    ]).then((answers) => {
      answers.application_name = this.options.initPrompts.application_name
      answers.subdomain = this.options.initPrompts.subdomain
      answers.sessionAuthSuffix = this.options.initPrompts.sessionAuthSuffix
      answers.keyAuthSuffix = this.options.initPrompts.keyAuthSuffix
      answers.dirname = this.options.initPrompts.dirname
      answers.botusername = this.options.initPrompts.botusername
      answers.botemail = this.options.initPrompts.botemail
      answers.encryption = this.options.initPrompts.encryption
      let log_text = ('* Generating ' +
                     this.options.initPrompts.application_type.italic +
                     ' ' +
                     this.options.initPrompts.application_lang.italic +
                     ' code from ' +
                     answers.node_ext_app_tpl.italic + ' template...').bold
      console.log(log_text.bgRed.white)

      if (answers.encryption.startsWith('RSA')) {
        answers.authType = 'rsa'
        answers.botCertPath = ''
        answers.botCertName = ''
        answers.botCertPassword = ''
        answers.botPrivateKeyPath = 'rsa/'
        answers.botPrivateKeyName = 'rsa-private-' + answers.botusername + '.pem'
      } else if (answers.encryption === 'Self Signed Certificate') {
        answers.authType = 'cert'
        answers.botCertPath = 'certificates/'
        answers.botCertName = answers.botusername
        answers.botCertPassword = 'changeit'
        answers.botPrivateKeyPath = ''
        answers.botPrivateKeyName = ''
      } else {
        answers.authType = 'cert'
        answers.botCertPath = ''
        answers.botCertName = ''
        answers.botCertPassword = ''
        answers.botPrivateKeyPath = ''
        answers.botPrivateKeyName = ''
      }

      if (answers.node_ext_app_tpl === 'Pizza Demo Extension App & Bot') {
        this.fs.copyTpl(
          this.templatePath('node/ext-apps/pizza-demo/index.js'),
          this.destinationPath('index.js'),
          answers
        )
        this.fs.copyTpl(
          this.templatePath('node/ext-apps/pizza-demo/package.json'),
          this.destinationPath('package.json'),
          answers
        )
        this.fs.copyTpl(
          this.templatePath('node/ext-apps/pizza-demo/config.json'),
          this.destinationPath('config.json'),
          answers
        )
        this.fs.copy(
          this.templatePath('node/ext-apps/pizza-demo/web'),
          this.destinationPath('web')
        )
        this.fs.copy(
          this.templatePath('node/ext-apps/pizza-demo/webcerts'),
          this.destinationPath('webcerts')
        )
      } else if (answers.node_ext_app_tpl === 'Dev Meetup AWS') {
        this.fs.copyTpl(
          this.templatePath('node/bots/dev-meetup-aws/index.js'),
          this.destinationPath('index.js'),
          answers
        )
        this.fs.copyTpl(
          this.templatePath('node/bots/dev-meetup-aws/package.json'),
          this.destinationPath('package.json'),
          answers
        )
        this.fs.copyTpl(
          this.templatePath('node/bots/dev-meetup-aws/config.json'),
          this.destinationPath('config.json'),
          answers
        )
      }

      /* Install certificate */
      CertificateCreator.create(this.options.initPrompts.encryption, answers.botusername, answers.botemail)

      let log_text_completion = ('* BOT generated successfully!!').bold
      console.log(log_text_completion.bgGreen.white)
    })
  }
}
