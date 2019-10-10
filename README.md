# adi

A JupyterLab extension to interact with the ADI platform


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install adi
```

To install the development version (if you just want to use it),
[download and unzip the latest jupyterlab-adi code](https://github.com/cybera/jupyterlab-adi/archive/master.zip)
and then:

```bash
cd /unzipped/folder
jupyter labextension install .
```

You'll need to restart jupyter lab (`jupyter lab` on the command line) and refresh
your browser to get the new plugin.

## Configuration

You need to set an endpoint, an apiKey, and an organization for this plugin.
You can do that via: `Settings`=>`Advanced Settings Editor` in the menu. Then
select `ADI` and set the following under "User Preferences":

```json
{
    "endpoint": "https://staging.adi2.data.cybera.ca/graphql",
    "apiKey": "your-api-key",
    "organization": "your-org-name"
}
```

## What it looks like

If you have everything setup correctly, you should be able to see transformation
inspectors for any notebook cell with a python method defined in it:

![screenshot-1](docs/images/screenshot-1.png)

Note that it only shows up when the tab marked with the ![gear](docs/images/gear.png) icon is selected.

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```
