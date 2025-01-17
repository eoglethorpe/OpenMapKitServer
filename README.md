# OpenMapKit Server

OpenMapKit Server is the lightweight NodeJS server component of OpenMapKit that
handles the collection and aggregation of OpenStreetMap and OpenDataKit data.

This software is intended to run both on low-power embedded Linux systems,
as well as on higher powered, cloud-based servers.

OpenMapKit Server is 100% database free! All data is persisted on the file system.

## [Development Installation](docs/development-installation.md)

These [instructions](docs/development-installation.md) are for setting up 
and running OpenMapKit Server in your development environment.

## [Production Installation](docs/posm-build-installation.md)

If you want to run OpenMapKit Server for your field mapping survey, use the 
[POSM Build Installation](docs/posm-build-installation.md) instructions.


## Project Structure

[__deployments__](deployments) is the OpenMapKit 
deployment API. This services deployment data in the 
[deployments data directory](data/deployments).
Manifest files in this directory work with [posm-deployment](https://github.com/AmericanRedCross/posm-deployment)
to provision deployment data that is fetched by OpenMapKit Android.

[__odk__](odk) is the OpenMapKit ODK API. 
This is a REST API that handles all of the ODK business logic, including communicating with ODK Collect,
as well as serving and ingesting ODK XForm data.

[__pages__](pages) is the pages directory where 
all of the web pages and UI live.

[__data__](data) is where all of the data is stored on the server's file system.

[__util__](util) has utility functions 
useful to OpenMapKit Server as a whole.


## The Basics

#### After your installation is done, you can see if the server is alive at:

    http://{{your_host_url}}/info

#### To get forms and send submissions in ODK Collect set:

__ODK Collect__ > __General Settings__ > __Configure platform settings__ > __URL__

    http://{{your_host_url}}

#### See all of the pages on your server:

    http://{{your_host_url}}/pages/

#### Upload an XLS Form:

    http://{{your_host_url}}/pages/upload-form/

#### Edit your OSM submissions and finalize to OpenStreetMap:

    http://{{your_host_url}}/pages/id/

You need to submit some data first to see something. Pick which form you 
want in the top right (once you've submitted some data).

Download your aggregated OSM XML by selecting your form and pressing 
__Download__ in the top right.

#### See your ODK submissions:

    http://{{your_host_url}}/omk/odk/submissions/{{form}}.json

#### See your OSM submissions:

This is where you can see what OpenMapKit Android users submitted to 
OpenMapKit Server.

    http://{{your_host_url}}/omk/odk/submissions/{{form}}.osm

To filter your OSM submissions by user, do the following:

    http://{{your_host_url}}/omk/odk/submissions/{{form}}.osm?user={{osm_user}}

To filter by date:

    http://{{your_host_url}}/omk/odk/submissions/{{form}}.osm?submitTimeStart=2015-12-28

or

    http://{{your_host_url}}/omk/odk/submissions/{{form}}.osm?submitTimeStart=2015-12-28&submitTimeEnd=2015-12-30

A UI for filtering in iD is coming soon...

You can browse the data on your server at:

    http://{{your_host_url}}/omk/data



[![ZenHub] (https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)] (https://zenhub.io)
