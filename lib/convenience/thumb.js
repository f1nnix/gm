/**
 * Extend proto.
 */

module.exports = function(proto) {

  proto.thumb = function thumb(w, h, name, quality, align, progressive,
    callback) {
    var self = this,
      args = Array.prototype.slice.call(arguments);

    callback      = args.pop();
    w             = args.shift();
    h             = args.shift();
    name          = args.shift();
    quality       = args.shift() || 63;
    align         = args.shift() || 'topleft';
    var interlace = args.shift() ? 'Line' : 'None';

    self.size(function(err, size) {
      if (err) return callback.apply(self, arguments);

      var requestedWidth  = parseInt(w, 10);
      var requestedHeight = parseInt(h, 10);
      var actualWidth     = size.width;
      var actualHeight    = size.height;
      var newWidth        = 0;
      var newHeight       = 0;

      if (requestedWidth / requestedHeight > actualWidth / actualHeight) {
        // touches on right side, crop bottom
        newWidth  = requestedWidth;
        newHeight = requestedWidth * actualHeight / actualWidth;
      } else {
        // touches on down, crop right
        newHeight = requestedHeight;
        newWidth  = requestedHeight * actualWidth / actualHeight;
      }


      // if (align == 'center') {
      //   if (w < w1) {
      //     xoffset = (w1-w)/2;
      //   }
      //   if (h < h1) {
      //     yoffset = (h1-h)/2;
      //   }
      // }
      self
        .quality(quality)
        // .in("-size", w1+"x"+h1)
        .resize(newWidth, newHeight, "!")
        // .crop(w, h, xoffset, yoffset)
        .crop(requestedWidth, requestedHeight)
        // .interlace(interlace)
        // .noProfile()
        .write(name, function() {
          callback.apply(self, arguments)
        });
    });

    return self;
  }
}
