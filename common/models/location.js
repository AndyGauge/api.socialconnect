'use strict';
var https = require('https');
var loopback = require('loopback');

module.exports = function(Location) {
  Location.observe('before save', function(ctx, next) {
    let path = `/maps/api/geocode/json?address=${ctx.instance['address']}&key=AIzaSyCWk3ePB8idTw74LyhR8tLSCmVgbZDKiIQ`

    console.log(path);
    https.get({
      hostname: 'maps.googleapis.com',
      path: encodeURI(path)
    }, (res) => {
      var body = [];
      res.on('data', (d) => {
        body.push(d)
      })
      res.on('end', () =>{
        body = JSON.parse(Buffer.concat(body).toString());
        //if (typeof body['results'][0] != 'undefined') {
        let latlng = new loopback.GeoPoint({
          lat: body['results'][0]['geometry']['location']['lat'],
          lng: body['results'][0]['geometry']['location']['lng']
        })
        console.log(latlng)
        if (ctx.instance) {
          ctx.instance.latlng = latlng;
        } else {
          ctx.data.latlng = latlng;
        }

        //}
        //console.log(body);
      })
    })
    next();
  })

};
