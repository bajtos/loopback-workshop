# Build a full-stack application with LoopBack and AngularJS

<img alt="LoopBack logo" height="70px"
src="http://loopback.io/images/loopback.svg">
<img alt="Angular logo" height="70px"
src="https://raw.githubusercontent.com/angular/angular.js/master/images/logo/AngularJS-Shield.exports/AngularJS-Shield-small.png">

In this workshop, you will learn how to build a full-stack Whiskey-voting
application using [LoopBack](http://loopback.io) and [AngularJS](https://angularjs.org/).

## Prerequisites

You will need the following tools installed on your machine:

 - Node.js v0.10, [v0.12](https://nodejs.org/download/)
   or [io.js 1.x](https://iojs.org)

 - Yeoman and the LoopBack generator:

    ```
    $ npm install -g yo generator-loopback
    ```

 - LoopBack SDK for AngularJS

    ```
    $ npm install -g loopback-sdk-angular-cli
    ```

Last but not least, a working internet connection is needed too.

## Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update
-->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Scaffold an API server in 5 minutes](#scaffold-an-api-server-in-5-minutes)
- [Explore the API](#explore-the-api)
- [Import sample data](#import-sample-data)
- [Add an AngularJS frontend](#add-an-angularjs-frontend)
- [Generate Angular client services](#generate-angular-client-services)
- [Wire up the controllers and the REST API](#wire-up-the-controllers-and-the-rest-api)
- [Celebrate!](#celebrate)
- [What to do next](#what-to-do-next)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Scaffold an API server in 5 minutes

 1. Scaffold a loopback application:

  ```
  $ yo loopback whiskey
  ```

  > This command creates a new directory "whiskey" containing your new LoopBack project.
  > Take a minute to familiarise with the layout of source and configuration
  > files that were generated for you, read
  > [Project layout reference](http://docs.strongloop.com/display/LB/Project+layout+reference)
  > to learn more.

 2. Switch to your project's directory:

  ```
  $ cd whiskey
  ```

 3. Add a "Whiskey" model with the properties "name" (string), "distillery"
  (string), "imageUrl" (string):

  ```
  $ yo loopback:model Whiskey
  ? Enter the model name: Whiskey
  ? Select the data-source to attach Whiskey to: db (memory)
  ? Select model's base class: PersistedModel
  ? Expose Whiskey via the REST API? Yes
  ? Custom plural form (used to build REST URL):

  Let's add some Whiskey properties now.

  Enter an empty property name when done.
  ? Property name: name
     invoke   loopback:property
  ? Property type: string
  ? Required? Yes

  Let's add another Whiskey property.
  Enter an empty property name when done.
  ? Property name: distillery
     invoke   loopback:property
  ? Property type: string
  ? Required? Yes

  Let's add another Whiskey property.
  Enter an empty property name when done.
  ? Property name: imageUrl
     invoke   loopback:property
  ? Property type: string
  ? Required? Yes

  Let's add another Whiskey property.
  Enter an empty property name when done.
  ? Property name:
  ```

  > The model generator creates two new files in your project:
  >
  >  - `common/models/whiskey.json` describing the model and its properties,
  >  - `common/models/whiskey.js` where you can implement your custom model
  >    methods.
  >
  > It also adds an new entry to `server/model-config.json`, this entry
  > specifies the model's data source.
  >
  > See the following resources for more information:
  >
  >  - [Using the model generator](http://docs.strongloop.com/display/LB/Using+the+model+generator)
  >  - [Model definition JSON file](http://docs.strongloop.com/display/LB/Model+definition+JSON+file)
  >  - [Model configuration](http://docs.strongloop.com/display/LB/model-config.json)

 4. Add a "Review" model with the properties "rating" (number, required) and
  "comment" (string, optional).

 5. Setup the relation a "Whiskey" has many "reviews":

  ```js
  yo loopback:relation
  ? Select the model to create the relationship from: Whiskey
  ? Relation type: has many
  ? Choose a model to create a relationship with: Review
  ? Enter the property name for the relation: reviews
  ? Optionally enter a custom foreign key:
  ? Require a through model? No
  ```

  > The new relation is described in model's JSON file,
  > `common/models/whiskey.json` in this case. You can learn more about relations
  > in [Creating model relations](http://docs.strongloop.com/display/LB/Creating+model+relations)
  > and the [Relations section](http://docs.strongloop.com/display/LB/Model+definition+JSON+file#ModeldefinitionJSONfile-Relations)
  > of Model definition page.

 6. Start your API server

  ```
  $ node .
  ```

## Explore the API

  1. Open LoopBack Explorer in your favourite browser:

  ```
  $ open http://localhost:3000/explorer
  ```

  ![LoopBack Explorer](http://ibin.co/1ZeEuLWFTjnn)

  2. Create a Whiskey entry using the Explorer:

  ```
  POST /Whiskeys
  {
    "name": "Green Spot 12-year-old",
    "distillery": "Midleton",
    "imageUrl": "http://static.whiskybase.com/storage/whiskies/5/3/084/86415-big.jpg"
  }
  ```

   Write down the generated `id` (e.g. `1`).

  3. Create a Rating entry using the explorer, use the `id` generated in the
previous step as `{id}` parameter in the route:

  ```
  POST /Whiskeys/{id}/reviews
  {
    "rating": 5,
    "comment": "Had to travel across half of Ireland to find a place where they serve this one"
  }
  ```

  4. List all whiskeys including the reviews:

  ```
  GET /Whiskeys
  filter: {"include":["reviews"]}
  ```

## Import sample data

At the moment, our application is storing all data in memory and they are lost
on restart.

Let's write a short script that will populate the database with seed data
on start.

 - Create a file `server/boot/sample-data.js` with the content as provided
   by [server-sample-data.js](server-sample-data.js) in this repository.

 - Install `async` module

  ```
  $ npm install --save async
  ```

Restart the application and list all whiskeys including the reviews again. You
should see the sample records provided by the script we just wrote.

## Add an AngularJS frontend

 1. Remove the placeholder `server/boot/root.js` that was serving the server
    status at the root `/` URL.

    > Refer to [Defining boot scripts](http://docs.strongloop.com/display/LB/Defining+boot+scripts)
    for more information about boot scripts.

 2. Modify the server to serve the client app. Open `server/middleware.json`
  and edit the `files` section:

  ```js
  "files": {
    "loopback#static": {
      "params": "$!../client"
    }
  }
  ```

  > The `loopback#static` middleware serves files from the directory configured
  > via the "params" property. The configuration above will serve
  > `client/index.html` at `http://localhost:3000/`, `client/scripts/app.js`
  > at `http://localhost:3000/scripts/app.js`, etc.
  >
  > You can learn more about middleware in
  > [Defining middleware](http://docs.strongloop.com/display/LB/Defining+middleware).

 3. Remove the `client` directory scaffolded by the LoopBack generator.
  It is just a dummy placeholder not containing any front-end.

 4. Download the ZIP archive of this repository from

    https://github.com/bajtos/loopback-workshop/archive/master.zip.

 5. Extract the archive and copy the `client` directory to your project.

  > Since the content of the `client` directory is served as-is,
  > you can put any single-page application there instead of the workshop app
  > provided in this repository.

 6. Restart the app and open it in browser. Check that the scaffolded client
  is served at the root URL:

  ```
  $ open http://localhost:3000/
  ```

  **NOTE** You will see an error message in server's console mentioning that
the file `lb-services.js` was not found. This is expected, you will create this
file in the next step.

## Generate Angular client services

 1. Generate the services using the code generator provided by LoopBack's SDK:

    ```
    $ lb-ng server/server.js client/scripts/lb-services.js
    ```

 2. View the API documentation for the client services

  ```
  $ lb-ng-doc client/scripts/lb-services.js
  ```

  **NOTE** Reload the doc page if it does not contain any services. This is a
  know bug in Docular.

  > The command parses ngdoc comments in `lb-services.js`, builds HTML
  > pages with the API documentation and starts a server serving the docs
  > at http://localhost:3030.
  >
  > Unfortunately the Docular module we use for API docs is rather unreliable
  > and does not report start errors well. If you don't see a message
  > pointing you to http://localhost:3030, then assume Docular failed
  > and the API docs is not available for you :(
  >
  > If you need root privileges to install global packages, then running
  > `lb-ng-docs` as root (via `sudo`) may fix the problem.

  ![Docular screenshot](http://ibin.co/1ZjQBOZYCafH)

## Wire up the controllers and the REST API

 1. Modify the main controller in `client/scripts/controllers/main.js`
  to the list of all Whiskey objects using the REST API:

  ```js
  $scope.whiskeys = Whiskey.find();
  ```

  Check out out the result in the browser.

 2. Modify `client/scripts/controllers/details.js` to fetch the currently
  viewed Whiskey object and include `reviews` in the response.

  Hint: `Whiskey.get` does not support `include` parameter,
  use the method `Whiskey.findOne` instead.

  Consult the documentation ([Querying models](http://docs.strongloop.com/display/LB/Querying+models),
  [Model resource API](http://docs.strongloop.com/display/LB/AngularJS+JavaScript+SDK#AngularJSJavaScriptSDK-ModelresourceAPI))
  and the API docs generated by `lb-ng-doc` for the information on the API usage.
  The API of built-in models and CRUD operations is documented online too, see
  [PersistedModel API](http://apidocs.strongloop.com/loopback-sdk-angular/#persistedmodel).

 3. Modify `client/scripts/controllers/review.js` to submit a new review
  and redirect back to the details page afterwards.

## Celebrate!

Congratulations, you have finished the workshop. Now it's the time
to have a pint of beer or cider; and perhaps show your friends what
you have build today.

## What to do next

 * [Add a custom remote method to your Whiskey model](https://gist.github.com/bajtos/213d5dae87e19f47db5d)

 * [Switch the app to use MySQL for data persistence](https://gist.github.com/bajtos/e279b39f38e01f85da97)

 * Check out the [documentation](http://docs.strongloop.com/display/LB/LoopBack)

 * Try out example apps

  - [loopback-example-app](https://github.com/strongloop/loopback-example-app)
  - [loopback-example-database](https://github.com/strongloop/loopback-example-database)
  - [loopback-example-passport](https://github.com/strongloop/loopback-example-passport)
  - [loopback-example-access-control](https://github.com/strongloop/loopback-example-access-control)
  - [loopback-example-datagraph](https://github.com/strongloop/loopback-example-datagraph)

 * Join the conversation in the
   [LoopBack mailing list](https://groups.google.com/forum/#!forum/loopbackjs)

 * Chat with us on gitter:
   [strongloop/loopback](http://gitter.im/strongloop/loopback)
