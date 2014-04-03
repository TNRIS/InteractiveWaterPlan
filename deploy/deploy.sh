#!/bin/sh

usage() {
    echo "Usage: ${0} [any arguments to pass to ansible-playbook] <branch_or_commit>

Use this script to deploy a specific branch or commit. The script will check out
the given branch or commit, then restore original state. If something asplodes
mid-script, you may need to manually re-check out to recover your original
state.
"
}


# check that the current git branch is clean
clean_msg="nothing to commit, working directory clean"
clean_check=`git status | grep "${clean_msg}"`
if [[ $clean_check != "${clean_msg}" ]]; then
    echo "
The working directory is not clean, so deployment is stopping. This is done to
avoid deployment artifacts from uncommitted work or changed files.

Run 'git status' for details on what changes are lingering and get yourself
clean.
"
    exit 1
fi


# check that a branch is provided
switch_to=${!#}
if [[ "${switch_to}" = "${0}" ]]; then
    echo "
Error: A valid git commit (sha1) or a git branch to deploy from must be provided
as the last argument.
"
    usage
    exit 1
fi


# check that provided commit or branch exists
valid_check=`git rev-parse --quiet --verify ${switch_to}^{commit} || git show-ref refs/heads/${switch_to}`
if [[ ! ${valid_check} ]]; then
    echo "
Error: A valid git commit (sha1) or a git branch to deploy from must be provided
as the last argument. '${switch_to}' is neither of those things.
"
    usage
    exit 1
fi


# switch to branch, deploy, then switch back
original_branch=`git rev-parse --abbrev-ref HEAD`
args_length=$(($#-1))
ansible_arguments=${@:1:${args_length}}

git checkout ${switch_to}
ansible-playbook ${ansible_arguments} site.yml
git checkout ${original_branch}
