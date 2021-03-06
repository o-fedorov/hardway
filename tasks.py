#!/usr/bin/env python3
import os
import sys
import shutil
from pathlib import Path
from string import Template

import requests
from invoke import task

TOKEN_VAR_NAME = 'HARDWAY_FBIG_TOKEN'
APP_ID_VAR_NAME = 'HARDWAY_FBIG_APP_ID'
APP_ID = os.environ.get(APP_ID_VAR_NAME)
DEPLOY_URL = f'https://graph-video.facebook.com/{APP_ID}/assets'

ROOT = Path(__file__).parent
TEMPLATE_FILE = ROOT / 'templates' / 'index.html'
BUILD = ROOT / 'build'
STATIC_FILES = BUILD / 'static'
INDEX = BUILD / 'index.html'
ARCHIVE = ROOT / 'build.zip'


@task
def archive(ctx):
    """Create an archive of the build folder"""
    print('Making an archive')
    shutil.make_archive(ARCHIVE.parent / ARCHIVE.stem, 'zip', BUILD)
    print('Done')


@task(help=dict(fb="build it for Facebook Instant Games, default is Yes"),
      post=[archive])
def build(ctx, fb=True):
    """Build the app, default is to build it for Facebook Instant Games"""
    ctx.run("rm -rf ./build")
    ctx.run('yarn build')
    if not fb:
        return

    files = {}
    for file in STATIC_FILES.glob('**/*.*'):
        prefix, *_, suffix = file.name.split('.')
        files[f'{prefix}.{suffix}'] = file.name

    if ('1.js' not in files or 'main.js' not in files
            or 'main.css' not in files):
        sys.exit('error: not all static .css or .js files were found')

    with TEMPLATE_FILE.open() as f:
        template = Template(f.read())

    with INDEX.open(mode='w') as f:
        f.write(
            template.substitute(
                css_file=files['main.css'],
                vendor_js=files['1.js'],
                main_js=files['main.js'],
            )
        )


@task
def deploy(ctx):
    """Deploy a pre-built package to Facebook Instant Games"""
    token = os.environ.get(TOKEN_VAR_NAME)
    if token is None or APP_ID is None:
        sys.exit(f'error: {TOKEN_VAR_NAME}/{APP_ID_VAR_NAME} is not set')
    if not ARCHIVE.exists():
        sys.exit(f'error: file {ARCHIVE.relative_to(ROOT)} does not exist, '
                 f'run "inv build" to create it')

    with ARCHIVE.open('rb') as f:
        resp = requests.post(
            DEPLOY_URL,
            files={'asset': (ARCHIVE.name, f, 'application/octet-stream')},
            data=dict(access_token=token,
                      type='BUNDLE',
                      comment='Graph API upload'),
        )
    print(resp.status_code, resp.text)
    if resp.status_code == 200:
        print(f'Promote the build: https://developers.facebook.com/apps/{APP_ID}/instant-games/hosting/')
        print(f'Check the game: https://developers.facebook.com/apps/{APP_ID}/app-details/details/')


@task(build, deploy)
def release(ctx):
    """Build and deploy the code to Facebook Instant Games"""


@task
def gp_release(ctx):
    """Build and deploy the code to Github Pages"""
    ctx.run("rm -rf ./build")
    ctx.run("yarn build")
    ctx.run("yarn deploy")
