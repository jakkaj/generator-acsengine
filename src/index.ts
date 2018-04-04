'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
import helpers from './helpers/helpers';
import * as chmod from 'chmod';
import * as fs from 'fs';
import * as path from 'path';
import * as ncp from 'ncp';
import { ITemplateComposeOptions, ITemplateSources, ITemplateSource } from './helpers/ITemplateComposeOptions';
import * as ejs from 'ejs';

class AcsGenerator extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the fantastic ${chalk.red('generator-acsengine')} generator!`)
    );

    var defaults = {
      ServicePrincipleId: "SomeServicePrincipleId",
      ServicePrincipleSecret: "SomeServicePrincipleSecret",
      ServiceSubscriptionId: "SomeServiceSubscriptionId"
    }

    var baseDir = process.cwd();

    var sp = path.join(baseDir, "azure_sp.json");
    var subs = path.join(baseDir, "azure_subs.json");

    if (fs.existsSync(subs)) {
      var subsdatafile = fs.readFileSync(subs, 'utf8');

      var subsdata = JSON.parse(subsdatafile);
      defaults.ServiceSubscriptionId = subsdata.subs;
    }

    if (fs.existsSync(sp)) {
      var spdatafile = fs.readFileSync(sp, 'utf8');

      var spdata = JSON.parse(spdatafile);
      defaults.ServicePrincipleId = spdata.appId;
      defaults.ServicePrincipleSecret = spdata.password;
    }

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
        name: 'gpuInstances',
        message: 'How many Linux based nodes with GPU capability would you like? Make sure you pick a region that has GPU capability',
        default: 0
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
        default: defaults.ServicePrincipleId
      },
      {
        type: 'input',
        name: 'spSecret',
        message: 'Please enter your service principal password:',
        default: defaults.ServicePrincipleSecret
      },
      {
        type: 'input',
        name: 'subscription',
        message: 'Please enter your subscription id:',
        default: defaults.ServiceSubscriptionId
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

    this.isWin = process.platform === "win32";

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;


    });
  }
  _sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async _renderFile(file:string, template:any):Promise<string>{
    return new Promise<string>((good, bad)=>{
      ejs.renderFile(file, template, (err, str)=>{
        if(err){
          bad(err);
        }else{
          good(str);
        }
      });
    });
  }

  private async _compose(options: ITemplateComposeOptions) {

    var sources = options.sources;
    var base_props = options.base_props;
    //process each source in order
    for (var i in sources) {

      var templateSources = sources[i];
      var templateResults: string[] = [];

      for (var x in templateSources.templateSources) {

        var templateSource = templateSources.templateSources[x].fileSource;
        var fullPath = this.templatePath(templateSource);

        if (!fs.existsSync(fullPath)) {
          console.log(`File ${fullPath} not found`);
          continue;
        }

        var templateResult = await this._renderFile(fullPath, base_props); 

        templateResults.push(templateResult);
      }

      var resultString = templateResults.join(templateSources.separator);

      base_props[templateSources.templateName] = resultString;


    }
    this.templateCompose = options;
    this.fs.copyTpl(this.templatePath(options.base_source), this.destinationPath(options.final_target), base_props);    
  }

  private async _copyfilesfortest(): Promise<boolean> {
    return new Promise<boolean>((good, bad) => {
      var basePath = path.join(__dirname, "templates");
      ncp(basePath, this.templatePath(''), () => {
        good(true);
      });
    });
  }

  async writing() {

    if (!fs.existsSync(this.templatePath('basetemplate_win.json.tpl'))) {

      await this._copyfilesfortest();
    }

    var done = this.async();
    this.log(
      `Okay - let's build ${chalk.red(this.props.linuxInstances)} Linux nodes and ${chalk.red(this.props.windowsInstances)} Windows nodes!`
    );

    var h = new helpers(this.destinationPath(""));
    var rsa = await h.GenerateRSAKeys();
    var passwd = h.GenerateStrongPassword();

    var base_props = {
      dnsPrefix: this.props.dnsPrefix,
      windowsInstances: this.props.windowsInstances,
      linuxInstances: this.props.linuxInstances,
      adminPassword: passwd,
      sshPublicKey: rsa[1],
      spClientId: this.props.spClientId,
      spSecret: this.props.spSecret
    };    

    var templateCompose: ITemplateComposeOptions = {
      base_source: "compose/baseTemplate.json.tpl",
      base_props: base_props,
      final_target: "buildacs.json",
      sources: [{
        separator: ",",
        templateName: "agentPoolProfiles",
        templateSources: []
      }]
    }
    var linux: boolean = this.props.linuxInstances != "0" && this.props.linuxInstances != 0;
    var win: boolean = this.props.windowsInstances != "0" && this.props.windowsInstances != 0;
    var gpu: boolean = this.props.gpuInstances != "0" && this.props.gpuInstances != 0;
   
    if(linux){
      templateCompose.sources[0].templateSources.push(
        {
          fileSource: 'compose/linuxPool.json.tpl'
        }
      )
    }

    if(win){
      templateCompose.sources[0].templateSources.push(
        {
          fileSource: 'compose/windowsPool.json.tpl'
        }
      )
    }

    await this._compose(templateCompose);

    // if (win && linux) {
    //   this.fs.copyTpl(
    //     this.templatePath('basetemplate.json.tpl'),
    //     this.destinationPath('buildacs.json'),
    //     {
    //       dnsPrefix: this.props.dnsPrefix,
    //       windowsInstances: this.props.windowsInstances,
    //       linuxInstances: this.props.linuxInstances,
    //       adminPassword: passwd,
    //       sshPublicKey: rsa[1],
    //       spClientId: this.props.spClientId,
    //       spSecret: this.props.spSecret
    //     }
    //   );
    // } else if (win) {
    //   this.fs.copyTpl(
    //     this.templatePath('basetemplate_win.json.tpl'),
    //     this.destinationPath('buildacs.json'),
    //     {
    //       dnsPrefix: this.props.dnsPrefix,
    //       windowsInstances: this.props.windowsInstances,
    //       linuxInstances: this.props.linuxInstances,
    //       adminPassword: passwd,
    //       sshPublicKey: rsa[1],
    //       spClientId: this.props.spClientId,
    //       spSecret: this.props.spSecret
    //     }
    //   );
    // } else {
    //   this.fs.copyTpl(
    //     this.templatePath('basetemplate_linux.json.tpl'),
    //     this.destinationPath('buildacs.json'),
    //     {
    //       dnsPrefix: this.props.dnsPrefix,
    //       windowsInstances: this.props.windowsInstances,
    //       linuxInstances: this.props.linuxInstances,
    //       adminPassword: passwd,
    //       sshPublicKey: rsa[1],
    //       spClientId: this.props.spClientId,
    //       spSecret: this.props.spSecret
    //     }
    //   );
    // }


    if (this.isWin) {

      this.fs.copy(
        this.templatePath('powershell/1_generate_acs_template.ps1'),
        this.destinationPath('powershell/1_generate_acs_template.ps1')
      );

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
        this.templatePath('powershell/3_deploy_cluster.ps1'),
        this.destinationPath('powershell/3_deploy_cluster.ps1'),
        {
          subscription: this.props.subscription,
          resourceGroup: this.props.resourceGroup,
          dnsPrefix: this.props.dnsPrefix
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
        this.templatePath('powershell/x_delete_resource_group.ps1'),
        this.destinationPath('powershell/x_delete_resource_group.ps1'),
        {
          subscription: this.props.subscription,
          resourceGroup: this.props.resourceGroup
        }
      );

    }

    //bash stuff

    this.fs.copy(
      this.templatePath('bash/1_generate_acs_template.sh'),
      this.destinationPath('bash/1_generate_acs_template.sh')
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
      this.templatePath('bash/3_deploy_cluster.sh'),
      this.destinationPath('bash/3_deploy_cluster.sh'),
      {
        subscription: this.props.subscription,
        resourceGroup: this.props.resourceGroup,
        dnsPrefix: this.props.dnsPrefix
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

    this.fs.copyTpl(
      this.templatePath('bash/x_delete_resource_group.sh'),
      this.destinationPath('bash/x_delete_resource_group.sh'),
      {
        subscription: this.props.subscription,
        resourceGroup: this.props.resourceGroup
      }
    );

    //kube templates

    this.fs.copy(
      this.templatePath('kube/kube.linux.yaml'),
      this.destinationPath('kube/kube.linux.yaml')
    );

    this.fs.copy(
      this.templatePath('kube/kube.windows.yaml'),
      this.destinationPath('kube/kube.windows.yaml')
    );

    done();
  }

  end() {
    if (!this.isWin) {
      chmod(this.destinationPath('bash/1_generate_acs_template.sh'), 777);
      chmod(this.destinationPath('bash/2_prepare_account.sh'), 777);
      chmod(this.destinationPath('bash/3_deploy_cluster.sh'), 777);
      chmod(this.destinationPath('bash/4_set_kubectl_config.sh'), 777);
      chmod(this.destinationPath('bash/x_delete_resource_group.sh'), 777);

      this.log("Remember to install the ACS-Engine binaries in your path: https://github.com/Azure/acs-engine/releases")
      this.log("Now switch to the 'bash' or 'powershell' folder and run the scripts in order. Remember to follow the instructions here: https://github.com/jakkaj/generator-acsengine")

    }
    var templateOut = fs.readFileSync(this.destinationPath(this.templateCompose.final_target), 'utf8');
    console.log(templateOut);

  }

  install() {
    //this.installDependencies();
  }

}

export default AcsGenerator;