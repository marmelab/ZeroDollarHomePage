from fabric.api import cd, env, run, task, sudo, put
from fabric.colors import green
from fabric.operations import local

env.use_ssh_config = True
env.forward_agent = True
env.output_prefix = False

gitUrl = 'https://github.com/marmelab/ZeroDollarHomePage.git'

@task
def setup_api():
    print(green('Installing dependencies ...'))
    sudo('apt --yes update && apt --yes upgrade')
    sudo('curl -sL https://deb.nodesource.com/setup_5.x | bash -')
    sudo('apt --yes install build-essential')
    sudo('apt --yes install libkrb5-dev')
    sudo('apt --yes install nodejs')
    sudo('apt --yes install supervisor')
    sudo('apt --yes install git htop vim')
    run('bash <(curl -L https://install-geth.ethereum.org)')
    run('npm set progress=false')

    run('git clone %s %s/%s' % (gitUrl, env.home, env.api_pwd))

@task
def check():
    run('git --version')
    run('node --version')
    run('service supervisor status')
    run('supervisord --version')
    run('geth --help')

@task
def deploy_api(branch='master'):
    with cd('%s/%s' % (env.home, env.api_pwd)):
        # Git
        run('git fetch')
        run('git checkout %s' % branch)
        run('git pull')
        # Install dependencies
        run('make install-prod')
        # DB migrations
        run('NODE_ENV=%s make migrate' % env.environment)
        # Update supervisor configuration
        # TODO: Do this step manually
        # put(env.supervisord_source, '/etc/supervisor/conf.d/%s' % env.supervisord_dest, use_sudo=True)

    sudo('service supervisor restart')
    sudo('supervisorctl start %s' % env.api_name)
    sudo('supervisorctl start geth')

@task
def deploy_static(branch='master'):
    local('git fetch')
    local('git checkout %s' % branch)
    local('git pull')
    local('NODE_ENV=%s make build' % env.environment)
    local('aws --region=eu-west-1 s3 sync ./build/frontend/ s3://%s/' % env.s3_bucket)
