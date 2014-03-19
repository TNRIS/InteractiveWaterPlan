# InteractiveStateWaterPlan App

Generated with the [angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack) Yeoman generator.

AngularJS (client-side app) files are in `application/client/`

Express (server-side app) files are in `application/server/`

## Initial setup

First make sure these are installed:
 - nodejs
 - ruby and rubygems (gem usually comes with ruby but might not on some
   platforms, depending on how it is installed)
 - compass (`gem install compass`)

## Building

1. Install `bower` and `grunt` globally: `npm install -g bower grunt`
2. Navigate to `application/` and run `bower install` and `npm install`
3. Now you should be able to use any of the `grunt` tasks defined in `Gruntfile.js`

`grunt serve` will launch express in dev mode and watch files in client/ and server/

`grunt serve:dist` will launch express in production mode

`grunt build` will build deployable dist/ folder

`grunt` will run tests and build deployable dist/ folder

## Generators

Run generators like so: `yo angular-fullstack:controller MyControllerName`

See [here](https://github.com/yeoman/generator-angular#generators) for generator documentation.

Available generators:

* `angular-fullstack:controller`
* `angular-fullstack:directive`
* `angular-fullstack:filter`
* `angular-fullstack:route`
* `angular-fullstack:service`
* `angular-fullstack:provider`
* `angular-fullstack:factory`
* `angular-fullstack:value`
* `angular-fullstack:constant`
* `angular-fullstack:decorator`
* `angular-fullstack:view`

## Deploying

1. Make sure you can build locally.
2. Install [ansible](https://github.com/ansible/ansible)

### Vagrant

[Vagrant](http://www.vagrantup.com) creates a virtual machine that mirrors the
production environment. It's a good idea to set up and test deployments on
vagrant before deploying to production. This will catch most of the things that
will go wrong.

1. Install vagrant
2. Add the base box (only accessible from TWDB internal network): `vagrant box add ubuntu-12.04-web http://greylin/vbox/ubuntu-12.04-web.box`
3. Navigate to `deploy/` and run `vagrant up`


To re-run the deploy, you can either use `vagrant provision` or run the ansible
playbook manually:

    ansible-playbook -i .vagrant/provisioners/ansible/inventory/vagrant_ansible_inventory --user=vagrant --private-key=~/.vagrant.d/insecure_private_key site.yml


### Production

Deploying to production works mainly the same way, but you'll need to create a
production inventory file and set up your authorized_keys file (vagrant does
these things for you).

The inventory file should look something like this (with the actual ip address
to the production server):

    # inventory file for pushing to production
    default ansible_ssh_host=<insert ip address here> ansible_ssh_port=22


To set up your authorized_keys file:

1. Find your public key from your local machine (e.g. `~/.ssh/id_rsa.pub`)
2. Log on to the production server and add the public key as a new line to
   `~/.ssh/authorized_keys`. If the authorized_keys file doesn't exist, you may
   need to create it. Also, permissions MUST be set to 0644 for it and 0700 for the
   `~/.ssh/` directory, and you must be the owner and group or sshd will ignore it.


For deploying to production, run the ansible playbook with your inventory file
and username:

    ansible-playbook -i <production_inventory_file> --user=<username> site.yml

