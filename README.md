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

 1. Start by installing LoopBack's Yeoman generator:

  ```
  $ npm install -g generator-loopback
  ```

 2. Scaffold a loopback application:

  ```
  $ yo loopback whiskey
  ```

 3. Switch to your project's directory:

  ```
  $ cd whiskey
  ```

 4. Add a "Whiskey" model with the properties "name" (string), "distillery"
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

 5. Add a "Review" model with the properties "rating" (number) and
  "comment" (string).

 6. Setup the relation a "Whiskey" has many "reviews":

  ```js
  yo loopback:relation
  ? Select the model to create the relationship from: Whiskey
  ? Relation type: has many
  ? Choose a model to create a relationship with: Review
  ? Enter the property name for the relation: reviews
  ? Optionally enter a custom foreign key:
  ? Require a through model? No
  ```

 8. Start your API server

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
    "imageUrl":
"http://static.whiskybase.com/storage/whiskies/5/3/084/86415-big.jpg"
  }
  ```

   Write down the generated `id` (e.g. `1`).

  3. Create a Rating entry using the explorer, use the `id` generated in the
previous step as `{id}` parameter in the route:

  ```
  POST /Whiskeys/{id}/reviews
  {
    "rating": 5,
    "comment": "Had to travel across half of Ireland to find a place where they
serve this one"
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

 1. Remove the `client` directory scaffolded by the LoopBack generator.

 2. Download the ZIP archive of this repository from

    https://github.com/bajtos/loopback-workshop/archive/master.zip.

 3. Extract the archive and copy the `client` directory to your project.

 4. Remove `server/boot/root.js` that was serving the `/` URL.

 5. Modify the server to serve the client app. Open `server/middleware.json`
  and edit the `files` section:

  ```js
  "files": {
    "loopback#static": {
      "params": "$!../client"
    }
  }
  ```

 6. Restart the app and open it in browser. Check that the scaffolded client
  is served at the root URL:

  ```
  $ open http://localhost:3000/
  ```

  **NOTE** You will see an error message in server's console mentioning that
the file `lb-services.js` was not found. This is expected, you will create this
file in the next step.

## Generate Angular client services

 1. Install the code generator:

  ```
  $ npm install -g loopback-sdk-angular-cli
  ```

 2. Generate the services

    ```
    $ lb-ng server/server.js client/scripts/lb-services.js
    ```

 3. View the API documentation for the client services

  ```
  $ lb-ng-doc client/scripts/lb-services.js
  ```

  Note: Reload the doc page if it does not contain any services. This is a
  know bug in docular.

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

  Consult the [documentation](http://docs.strongloop.com/display/LB/Querying+models)
  and the API docs generated by `lb-ng-doc` for the information on the API usage.

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
