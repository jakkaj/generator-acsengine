# generator-acsengine
Simple Yeoman Generator to help get started with the [acs-engine](https://github.com/Azure/acs-engine). 

It's funny - this generator helps generate the file that acs-engine uses to generate the files that are used to deploy a cluster!

This generator works with Linux and Windows nodes. Node count for each Windows and Linux can be specified (0 to not include at all).  

It generates the Windows box admin passwords and ssh keys for Linux. These are saved under ./keys post generation. 

It generates scripts to deploy the cluster and to delete it again. It also helps import kubectl configs for ease of use (by making a temp env var). 

### Video

See [https://youtu.be/J3CZkL7rt6Y](https://youtu.be/J3CZkL7rt6Y) for a video demo of how to use this generator (follow this readme also!).

### Requirements

You'll need Powershell. This is also tested on Ubuntu 16.04.  

Install [acs-engine](https://github.com/Azure/acs-engine/releases) in your path. 

Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) in your path or just run `az aks install-cli`. 

Install [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

### Installation

Install: `npm install -g generator-acsengine`

Usage: `yo acsengine`

### Use the Docker image

You can pull a pre-prepared environment in "jakkaj/acsengine". 

- Install Docker
- `docker pull jakkaj/acsengine`
- `docker run -d -t jakkaj/acsengine`
- `docker ps -a` to find running image id
- `docker exec -it <containerid> bash`
- `./sp.sh` to start with your service principal
- `yo ascengine` and you're on your way.  

### Things you're going to need before you start

Create an [Azure Service Principle](https://github.com/Azure/acs-engine/blob/master/docs/serviceprincipal.md)

Get your subscription id from the portal or by typing `az account list`.  

#### Getting started in the docker container

If you're in the docker container, you don't need to install anything. 

To get started with a service principal you can just run the following from the home dir: 

```
./sp.sh
```

This will kick off the service principal process and save it to a local folder as "azure_sp.json".  

### Things to know before you start

The questions you'll be asked as you run the generator are:

- How many Windows based nodes would you like?
- How many Linux based nodes would you like?
- What DNS prefix would you like?

    * This will be the host dns name of your cluster

- Please enter your service principal ClientId (AppId). If you do not know what this is, follow this guide: [https://github.com/Azure/acs-engine/blob/master/docs/serviceprincipal.md](https://github.com/Azure/acs-engine/blob/master/docs/serviceprincipal.md)

    * Enter the appId from the service principle create command in to this field

- Please enter your service principal password:

    * Enter the password from the service principle create command in to this field

- Please enter your subscription id:

    * Copy this from your Azure portal or in the `az account list` command

- Please enter an Azure Resource Group name. It will be created if it does not yet exist.

    * All resources will be created in this group. You can easily delete this later to clean up your work if you're just trying things out

- Please enter an Azure region. Type "az account list-locations" to get the list (use the "name" field!).

    * Regions look like "australiasoutheast" or "southeastasia". Make sure you copy the version that has no spaces and all lower case!


### Post generation

Once generated there are some scripts to run. 

#### Generate the acs-engine output

First script take the file generated by this generator and runs it through acs-engine. 

It produces files under _output/dnsName (which ever dns prefix you entered during the config stage). 

Scripts are located under the Powershell or bash directories. If you're on in bash, substitute the examples where appropriate.  

This script will not deploy anything yet!

From powershell run:

```
.\powershell\1_generate_acs_template.ps1
or 
./bash/1_generate_acs_template.sh
```

#### Set up the Azure subscription ready to host the cluster
```
.\powershell\2_prepare_account.ps1
or
./bash/2_prepare_account.sh
```

This script checks the Azure CLI login status, before creating the new resource group (if it doesn't already exist). 

#### Deploy the cluster

The big show!

```
.\powershell\3_deploy_cluster.ps1
or
./bash/3_deploy_cluster.sh
```

This will deploy the cluster by invoking an Azure deployment using the generated ARM Template and values file. 

#### Set up kubectl config

```
.\powershell\4_set_kubectl_config.ps1
or 
cd bash
. 4_set_kubectl_config.sh
```

**Important note on bash:** This script will set an environment variable, so you'll want to run `. 4_set_kubectl_config.sh` (not ./4_set_kubectl_config) so it creates the variables in the same shell. 

This will help you out by adding a temp env var to your current powershell session to allow kubectl to access your cluster. 

You'll have to run this every new powershell session or manually integrate the file in to your central ~/.kube/config file. Check the powershell script `.\powershell\4_set_kubectl_config.ps1` for the path to the config file. 

#### Permanently save the config

On Linux, there is a tool called [kubecfg](https://github.com/jakkaj/kubecfg) you can install (it's already in the Docker container).

```
npm install -g kubecfg
```

Navigate to the path that your config file resides and type:

```
kubecfg -a <filename>
```

To remove that file 

```
kubecfg -r <filename>
```

This will update your .bashrc with the new paths. 

You'll need to reload .bashrc after you've run the app (any assistance on how to elegantly do this automatically is welcome!)

```
. ~/.bashrc
```

### Delete the resource group

```
.\powershell\x_delete_resource_group.ps1
or 
./bash/x_delete_resource_group.sh
```

This will kill the resource group and everything in it. It's irreversible - be very careful you're sure you want to blow this group away!! But it's also handy if you're just playing around. 

** Remember, you could have used an existing group with *other* things in it!! **
