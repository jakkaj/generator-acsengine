'use strict';
const Generator =  require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
import helpers from './helpers';


class AcsGenerator extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the fantastic ${chalk.red('generator-acsengine')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'windowsInstances',
        message: 'How many Windows based nodes would you like?',
        default: 0
      },
      {
        type: 'input',
        name: 'linuxInstances',
        message: 'How many Linux based nodes would you like?',
        default: 2
      }, 
      {
        type: 'input',
        name: 'dnsPrefix',
        message: 'What DNS prefix would you like?',
        default: "acstest"
      },
      {
        type: 'input',
        name: 'spClientId',
        message: 'Please enter your service principal ClientId (AppId). If you do not know what this is, follow this guide: https://github.com/Azure/acs-engine/blob/master/docs/serviceprincipal.md',
        default: "SomeServicePrincipleId"
      },
      {
        type: 'input',
        name: 'spSecret',
        message: 'Please enter your service principal password:',
        default: "SomeServicePrincipleSecret"
      },
      {
        type: 'input',
        name: 'subscription',
        message: 'Please enter your subscription id:',
        default: "SomeServiceSubscriptionId"
      },
      {
        type: 'input',
        name: 'resourceGroup',
        message: 'Please enter an Azure Resource Group name. It will be created if it does not yet exist.',
        default: "acstestgroup"
      },
      {
        type: 'input',
        name: 'azureRegion',
        message: 'Please enter an Azure region. Type "az account list-locations" to get the list (use the "name" field!).',
        default: "southeastasia"
      }
      

    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  async writing() {
    var done = this.async();
    this.log(
      `Okay - let's build ${chalk.red(this.props.linuxInstances)} Linux nodes and ${chalk.red(this.props.windowsInstances)} Windows nodes!`
      );

      var h = new helpers(this.destinationPath(""));
      var rsa = await h.GenerateRSAKeys();
      var passwd = h.GenerateStrongPassword();


    var linux:boolean = this.props.linuxInstances != "0" && this.props.linuxInstances != 0;
    var win:boolean = this.props.windowsInstances != "0" && this.props.windowsInstances != 0;

      if(win && linux){
        this.fs.copyTpl(
          this.templatePath('basetemplate.json.tpl'),
          this.destinationPath('buildacs.json'),
          {
            dnsPrefix: this.props.dnsPrefix, 
            windowsInstances: this.props.windowsInstances, 
            linuxInstances: this.props.linuxInstances, 
            adminPassword: passwd, 
            sshPublicKey: rsa[1], 
            spClientId: this.props.spClientId,
            spSecret: this.props.spSecret
          }
        );
      }else if(win){
        this.fs.copyTpl(
          this.templatePath('basetemplate_win.json.tpl'),
          this.destinationPath('buildacs.json'),
          {
            dnsPrefix: this.props.dnsPrefix, 
            windowsInstances: this.props.windowsInstances, 
            linuxInstances: this.props.linuxInstances, 
            adminPassword: passwd, 
            sshPublicKey: rsa[1], 
            spClientId: this.props.spClientId,
            spSecret: this.props.spSecret
          }
        );
      }else{
        this.fs.copyTpl(
          this.templatePath('basetemplate_linux.json.tpl'),
          this.destinationPath('buildacs.json'),
          {
            dnsPrefix: this.props.dnsPrefix, 
            windowsInstances: this.props.windowsInstances, 
            linuxInstances: this.props.linuxInstances, 
            adminPassword: passwd, 
            sshPublicKey: rsa[1], 
            spClientId: this.props.spClientId,
            spSecret: this.props.spSecret
          }
        );
      }
    

    this.fs.copyTpl(
      this.templatePath('powershell/2_prepare_account.ps1'),
      this.destinationPath('powershell/2_prepare_account.ps1'),
      {
        subscription: this.props.subscription, 
        resourceGroup: this.props.resourceGroup,
        azureRegion: this.props.azureRegion      
      }
    );

    this.fs.copyTpl(
      this.templatePath('bash/2_prepare_account.sh'),
      this.destinationPath('bash/2_prepare_account.sh'),
      {
        subscription: this.props.subscription, 
        resourceGroup: this.props.resourceGroup,
        azureRegion: this.props.azureRegion      
      }
    );

    this.fs.copyTpl(
      this.templatePath('powershell/3_deploy_cluster.ps1'),
      this.destinationPath('powershell/3_deploy_cluster.ps1'),
      {
        subscription: this.props.subscription, 
        resourceGroup: this.props.resourceGroup,
        dnsPrefix: this.props.dnsPrefix      
      }
    );

    this.fs.copyTpl(
      this.templatePath('bash/3_deploy_cluster.sh'),
      this.destinationPath('bash/3_deploy_cluster.sh'),
      {
        subscription: this.props.subscription, 
        resourceGroup: this.props.resourceGroup,
        dnsPrefix: this.props.dnsPrefix      
      }
    );

    this.fs.copyTpl(
      this.templatePath('powershell/x_delete_resource_group.ps1'),
      this.destinationPath('powershell/x_delete_resource_group.ps1'),
      {
        subscription: this.props.subscription, 
        resourceGroup: this.props.resourceGroup         
      }
    );

    this.fs.copyTpl(
      this.templatePath('bash/x_delete_resource_group.sh'),
      this.destinationPath('bash/x_delete_resource_group.sh'),
      {
        subscription: this.props.subscription, 
        resourceGroup: this.props.resourceGroup         
      }
    );

    this.fs.copyTpl(
      this.templatePath('powershell/4_set_kubectl_config.ps1'),
      this.destinationPath('powershell/4_set_kubectl_config.ps1'),
      {
        dnsPrefix: this.props.dnsPrefix, 
        azureRegion: this.props.azureRegion         
      }
    );

    this.fs.copyTpl(
      this.templatePath('bash/4_set_kubectl_config.sh'),
      this.destinationPath('bash/4_set_kubectl_config.sh'),
      {
        dnsPrefix: this.props.dnsPrefix, 
        azureRegion: this.props.azureRegion         
      }
    );

    this.fs.copy(
      this.templatePath('powershell/1_generate_acs_template.ps1'),
      this.destinationPath('powershell/1_generate_acs_template.ps1')
    );

    this.fs.copy(
      this.templatePath('kube/kube.linux.yaml'),
      this.destinationPath('kube/kube.linux.yaml')
    );

    this.fs.copy(
      this.templatePath('kube/kube.windows.yaml'),
      this.destinationPath('kube/kube.windows.yaml')
    );


    this.fs.copy(
      this.templatePath('bash/1_generate_acs_template.sh'),
      this.destinationPath('bash/1_generate_acs_template.sh')
    );

    
    
    this.log("Remember to install the ACS-Engine binaries in your path: https://github.com/Azure/acs-engine/releases")


    done();
  }

  install() {
    //this.installDependencies();
  }
  
}

export = AcsGenerator;