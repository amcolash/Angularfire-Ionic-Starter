# Angularfire-Ionic-Starter
This is repo that is a starting point for people looking into using [ionic](https://ionicframework.com/) and [firebase](firebase.google.com) with storage and authentication implemented.

This is a simple example which should get you going with a new ionic and firebase application.

# Demo
There is a live demo hosted with firebase [here](https://angularfire-ionic-starter.firebaseapp.com/), you can toggle a boolean value and upload files. Also handles the firebase authenitcation flow.

# Setup
There is not too much setup to get this project going.

Firstly, fork this repo (by clicking the fork button). Next, clone the repo with `git clone https://github.com/amcolash/Angularfire-Ionic-Starter.git` (https) or `git clone git@github.com:amcolash/Angularfire-Ionic-Starter.git` (ssh).

## Dependencies
You will also need to have nodeJS installed.
Dependencies: ionic and bower: `npm install -g ionic cordova bower`

If you are going to deploy with firebase hosting, also firebase-cli: `npm install -g firebase-tools`

## Firebase Configuration
You will need to edit a few files to redirect from my sample application to your own application.

* `www/js/app.js`: Edit the firebase configuration marked by the TODO tag
* `storage.rules`: Edit the storage url from `angularfire-ionic-starter.appspot.com` to your own url.

## Renaming Application and Info
You will need to add you application name to a few files:

* `bower.json`: Edit the name of this package.
* `config.xml`: Edit name, author, etc of the application.
* `ionic.config.json`: Edit the name of the application.
* `package.json`: Edit the name and description of the package.

## Deploying the Application
_IMPORTANT NOTE: If you are not deplying your application, make sure that you edit the database and storage rules on the firebase console to match the ones inside of `database.rules.json` and `storage.rules`._

If you would like to deploy the application with firebase hosting, you need to make sure that `firebase-tools` have been installed (above).

To deploy the application, run `firebase deploy` from the root of the project, you will need to authenitcate the firebase-cli and might need to run `firebase init`

## What's Next?
You can now start playing around with this, all of the website is contained within `www`. The project is structured based off of the default ionic boilerplate, templates are located in `www/templates`.

* Main Application: `www/js/app.js`
* Controllers: `www/js/controllers.js`
* Directives: `www/js/directives.js`
* Factories: `www/js/factories.js`

# Disclaimer
This is a personal starter template that I use for my projects. It is by no means perfect, but should get you up and running in no time at all! Feel free to use this however you want, a quick mention is awesome if you want to - but is not necessary. Also, if you have ideas or changes, submit a pull request to improve this starter.
