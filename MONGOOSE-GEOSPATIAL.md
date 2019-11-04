# Storing geospatial data with Mongoose

MongoDB can [store geospatial information and perform queries on
it][mongodb-geospatial]. In order to do so, you should store information as
[GeoJSON][geojson] objects.

The format of a GeoJSON point is as follows:

```json
{
  "type": "Point",
  "coordinates": [ -73.856077, 40.848447 ]
}
```

> The two numbers are the longitude and latitude. A third optional number may be
> included to indicate the altitude.

This is an example of how to define a `location` property with this format in a
[Mongoose][mongoose] schema:

```js
const geolocatedSchema = new Schema({
  location: {
    type: {
      type: String,
      required: true,
      enum: [ 'Point' ]
    },
    coordinates: {
      type: [ Number ],
      required: true,
      validate: {
        validator: validateGeoJsonCoordinates,
        message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
      }
    }
  }
});

// Create a geospatial index on the location property.
issueSchema.index({ location: '2dsphere' });

// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90;
}
```



[geojson]: https://geojson.org
[mongodb-geospatial]: https://docs.mongodb.com/manual/geospatial-queries/
[mongoose]: https://mongoosejs.com