# InteractiveStateWaterPlan App

AngularJS (client-side app) files are in `application/client/`

Express (server-side app) files are in `application/server/`

## Initial setup

First make sure these are installed:
 - nodejs
 - ruby and rubygems (gem usually comes with ruby but might not on some
   platforms, depending on how it is installed)
 - compass (`gem install compass`)

## Developing

1. Install `bower` and `gulp` globally: `npm install -g bower gulp`
2. Navigate to `application/` and run `bower install` and `npm install`
3. Now you should be able to use any of the `gulp` tasks defined in `gulpfile.js`

`gulp` will launch express and watch files for changes

## Building

`gulp dist` will build the app for production

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

To re-run the deploy, you can either use `vagrant provision` or using the `deploy.sh` script in `/deploy`:

    ./deploy.sh -i .vagrant/provisioners/ansible/inventory/vagrant_ansible_inventory --user=vagrant --private-key=~/.vagrant.d/insecure_private_key site.yml <<git-branch-or-tag>>


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


For deploying to production use the `deploy.sh` script, which allows you to
deploy from a specific commit or branch and has some sanity checks to ensure the
deploy is free of any uncommitted artifacts. All command-line arguments except
the last are passed to ansible-playbook, so the script can be used to test
deploys on vagrant VMs prior to pushing to production.

    ./deploy.sh -i <production_inventory_file> --user=<username> <commit_or_branch>
