// server/boot/sample-data.js
var async = require('async');

var WHISKEYS = [
  {
    "name": "Green Spot 12-year-old",
    "distillery": "Midleton",
    "imageUrl": "http://static.whiskybase.com/storage/whiskies/5/3/084/86415-big.jpg",
    "reviews": [
      {
        "rating": 5,
        "comment": "Had to travel across half of Ireland to find a place where they serve this one"
      },
      {
        "rating": 3
      },
      {
        "rating": 4
      }
    ]
  },
  {
    "name": "Jameson 12-year-old",
    "distillery": "Jameson",
    "imageUrl": "http://static.whiskybase.com/storage/whiskies/1/3/705/64900-big.jpg",
    "reviews": [
      {
        "rating": 3
      },
      {
        "rating": 2
      },
      {
        "rating": 1,
        "comment": "Too dull, this whiskey has no character at all."
      }
    ]
  },
  {
    "name": "Kilbeggan Distillery Reserve Malt Whiskey",
    "distillery": "Kilbeggan Distillery",
    "imageUrl": "http://static.whiskybase.com/storage/whiskies/5/1/970/74914-big.jpg"
  }
];

module.exports = function(server) {
  console.log('Importing sample data...');
  var Whiskey = server.models.Whiskey;
  async.each(WHISKEYS, function(whiskey, next) {
    Whiskey.create(whiskey, function(err, created) {
      if (err) return next(err);
      async.each(whiskey.reviews || [], function(rating, cb) {
        created.reviews.create(rating, cb);
      },
      next);
    });
  }, function(err) {
    if (err)
      console.error('Cannot import sample data.', err);
    else
      console.log('Sample data was imported.');
  });
};
