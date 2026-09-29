# Store geospatial data with Mongoose

MongoDB can [store geospatial information and perform queries on
it][mongodb-geospatial]. In order to do so, you should store information as
[GeoJSON][geojson] objects.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Store a location](#store-a-location)
  - [Make the location optional](#make-the-location-optional)
- [Find nearby documents](#find-nearby-documents)
- [Count and paginate](#count-and-paginate)
- [Return distances](#return-distances)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Store a location

The format of a GeoJSON point is as follows:

```json
{
  "type": "Point",
  "coordinates": [6.6594, 46.7787]
}
```

> **Longitude first, then latitude.** A third optional number may be included to
> indicate the altitude. Maps libraries like Leaflet or Google Maps usually take
> **latitude first**, so be careful when converting. The validation below
> **cannot catch a swap** when both numbers are in range. For example,
> `[46.7787, 6.6594]` is accepted, but it points to the Horn of Africa instead
> of Yverdon.

This is an example of how to define a `location` property with this format in a
[Mongoose][mongoose] schema, following [Mongoose's own GeoJSON
pattern][mongoose-geojson]:

```js
import mongoose, { Schema } from 'mongoose';

// A GeoJSON point, used as a sub-schema (without its own _id).
const pointSchema = new Schema(
  {
    // A field *named* "type" must itself be declared with { type: String }.
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: isValidCoordinates,
        message:
          '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
      }
    }
  },
  { _id: false }
);

const placeSchema = new Schema({
  name: { type: String, required: true },
  location: { type: pointSchema, required: true }
});

// Create a geospatial index on the location property.
placeSchema.index({ location: '2dsphere' });

export default mongoose.model('Place', placeSchema);

// Validate a GeoJSON coordinates array (longitude, latitude and optional
// altitude).
function isValidCoordinates(value) {
  return (
    value.length >= 2 &&
    value.length <= 3 &&
    isLongitude(value[0]) &&
    isLatitude(value[1])
  );
}

function isLatitude(value) {
  return value >= -90 && value <= 90;
}

function isLongitude(value) {
  return value >= -180 && value <= 180;
}
```

A place is then created like this:

```js
await Place.create({
  name: 'HEIG-VD Yverdon',
  location: { type: 'Point', coordinates: [6.6594, 46.7787] }
});
```

### Make the location optional

Remove `required: true` from the `location` property:

```js
location: {
  type: pointSchema;
}
```

Documents without a location can then be saved, and geospatial queries simply
ignore them.

## Find nearby documents

Use [`$near`][near] to find documents close to a point, **sorted by distance**
(nearest first). `$maxDistance` is in **meters**:

```js
const places = await Place.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [6.64, 46.78] },
      $maxDistance: 5000
    }
  }
}).exec();
```

For example, this finds places in Yverdon, but not in Lausanne (about 30
kilometers away).

## Count and paginate

You can paginate the results of a `$near` query with `skip()` and `limit()` as
usual. But **counting** them fails:

```js
await Place.countDocuments({ location: { $near: { … } } }).exec();
// MongoServerError: $geoNear, $near, and $nearSphere are not allowed in this
// context, as these operators require sorting geospatial data. If you do not
// need sort, consider using $geoWithin instead.
```

To count, use [`$geoWithin`][geo-within] with `$centerSphere`, whose radius is
in **radians** (the distance in kilometers divided by the Earth's radius,
6378.1 km):

```js
const total = await Place.countDocuments({
  location: {
    $geoWithin: { $centerSphere: [[6.64, 46.78], 5 / 6378.1] }
  }
}).exec();
```

## Return distances

To include the distance to each document in the response, use a
[`$geoNear`][geo-near] stage, which must be the **first stage** of an
[aggregation pipeline][aggregation]:

```js
const places = await Place.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [6.64, 46.78] },
      distanceField: 'distance', // In meters
      maxDistance: 5000
    }
  }
]);
```

Each result has a `distance` property (e.g. `220` for Yverdon station, `1486`
for HEIG-VD Yverdon), and the results are sorted by distance. Like all
aggregation results, they are plain objects, not Mongoose documents.

[aggregation]: https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
[geo-near]: https://www.mongodb.com/docs/manual/reference/operator/aggregation/geonear/
[geo-within]: https://www.mongodb.com/docs/manual/reference/operator/query/geowithin/
[geojson]: https://geojson.org
[mongodb-geospatial]: https://www.mongodb.com/docs/manual/geospatial-queries/
[mongoose]: https://mongoosejs.com
[mongoose-geojson]: https://mongoosejs.com/docs/geojson.html
[near]: https://www.mongodb.com/docs/manual/reference/operator/query/near/
