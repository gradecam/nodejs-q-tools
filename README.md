q-tools
=========

Extends [Q](https://github.com/kriskowal/q) with `map` and `each` methods.

Allows execution of a particular function for every value in an array. If the array
contains promises the supplied function will not be called until all promises have been
resolved.

## map

`map` returns an array with the results of calling `fn` for each item in the array.

```javascript
function double(x) {
    return x * 2;
}

var doubled = Q.map(original, double);

// if you want to do parallel processing use mapAsync instead.
var doubledParallel = Q.mapAsync(original, double);
```

## each

`each` returns the original array after having called `fn` for each item. Use this method instead
of map if you don’t need the transformed values.

```javascript
function double(x) {
    return x * 2;
}

Q.each(original, double);

// process `original` in parallell
Q.eachAsync(original, double);
```

