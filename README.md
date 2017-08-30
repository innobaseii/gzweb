# Gzweb - A web client for Gazebo

Gzweb is a WebGL client for Gazebo. Like gzclient, it's a front-end graphical interface to gzserver and provides visualization of the simulation.

http://gazebosim.org/gzweb

# Installation

## Gazebo

Install gazebo or drcsim if you haven't done so already.

http://gazebosim.org/install

## Dependencies

* libjansson-dev

* nodejs (>= 0.10)

* npm

* libboost-dev

* imagemagick

* libtinyxml-dev

* mercurial

Make sure your system supports a more recent version of nodejs (>=0.10) then install the dependencies from the terminal:

    sudo apt-get install libjansson-dev nodejs npm libboost-dev imagemagick libtinyxml-dev mercurial

**Note** For Ubuntu Precise or older distributions, the nodejs version that comes with it may not work with gzweb. In that case, set up your system to grab and install the latest nodejs debs:

    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install nodejs

If nodejs installs without errors then install the rest of the dependencies (leaving out npm as that should be installed with nodejs):

    sudo apt-get install libjansson-dev libboost-dev imagemagick libtinyxml-dev mercurial

# Build

The first time you build, you'll need to gather all the gazebo models and
put them in the right directory and prepare them for the web. To do this,
you'll need to source the gazebo/drcsim setup.sh files, and run a deploy script.

    # if you have drcsim then source /usr/share/drcsim/setup.sh
    . /usr/share/gazebo/setup.sh

Run the deploy script, this downloads models from the web, converts media files to web-compatible format, and generates thumbnails for the models (see note on thumbnail generation below). This step may take a few minutes.

    ./deploy.sh -m

Note the `-m` flag tells the deploy script to grab models from the model
database and any other models in your gazebo paths. For all subsequent builds,
the `-m` flag will not be needed, i.e.:

    ./deploy.sh


## Options

To generate thumbnails manually, run the script with the `-t` flag, i.e.:

    ./deploy.sh -t

Note: This spins up a gzserver with a camera for capturing screenshots of models. So make sure there is rendering support and no background gzerver process running (or set a different `GAZEBO_MASTER_URI` in the terminal).

Mobile devices:

If you'll use gzweb on mobile devices, you can create coarse versions of all models, which are lighter to load (50% of original quality). If you've already ran `./deploy.sh -m`, run just:

    ./deploy.sh -c

Or you can run both flags at the same time to create the model database and also generate coarse versions:

    ./deploy.sh -m -c

# Running gzserver, gzweb, and webgl

Start gazebo or gzserver first

     gzserver

Make sure that ports 8080 and 7681 are open and start the http and websocket servers.

    ./start_gzweb.sh

Open a browser that has webgl support and point it to the ip address and port
where the http server is started, by default it's on port 8080, e.g.

http://localhost:8080

If port 8080 is not usable, you can pass an arbitrary port number to the startup script like so:

    ./start_gzweb.sh -p 1234

...and the gzweb interface will be found there instead.

# Stopping gzweb server

    ./stop_gzweb.sh

# Build environment setup for javascript source

## Dependencies

Install grunt packages. From the `gzweb/gz3d/utils` directory, run:

      npm install

## Work Flow

1. Make changes to javascript source code in `gzweb/gz3d`

1. From the `gzweb` directory, run the following script, which will code check and minify javascript source files, and copy generated files to `gzweb/http`.

        ./updateGZ3D.sh

1. Verify your changes by starting gzweb server from the `gzweb` directory:

        ./start_gzweb.sh

1. Open browser to localhost:8080 or just refresh page.
