"use strict";

function loadMediaMap(defaults, config) {
  // Create string.
  var mediaMapStringStart = '$h2-map-media: ("base": "screen",';
  var mediaMapStringContent = '';
  var mediaMapStringEnd = ');';
  var mediaConfig;
  // console.log(config.media);
  // console.log(defaults.media);
  // Check to see if the user has set media options in their config, and if not, load the defaults.
  if (config.media != null && config.media != undefined && config.media.length > 0) {
    mediaConfig = config.media;
  } else {
    mediaConfig = defaults.media;
  }
  // Loop through the media options and add them to the media map.
  mediaConfig.forEach(function(mediaQuery) {
    // console.log(mediaQuery);
    var mediaString = '"' + mediaQuery.name + '": ' + '"screen and (min-width: ' + mediaQuery.value + ')",';
    mediaMapStringContent = mediaMapStringContent.concat(mediaString);
    // console.log(mediaMapStringContent);
  });
  var mediaMap = mediaMapStringStart + mediaMapStringContent + mediaMapStringEnd;
  // console.log(mediaMap);
  // Pass the media map.
  return mediaMap;
}

module.exports = loadMediaMap;