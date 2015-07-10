var expect = require('expect.js');
var gm = require('../../index.js')
var async = require('async')
var fs = require('fs');

describe('should return 825x400 for every image', function() {
  this.timeout(150000);

  it('should return proper image size', function(done) {
    // create sizes Array
    var sizes = [];
    for (width = 10; width < 1000; width = width + 10) {
      for (height = 10; height < 1000; height = height + 10) {
        sizes.push([width, height])
      }
    }

    var ThumbnailLibrary = {
      test: function(suggestedSize, callback) {

        var filePath = __dirname + "/test-thumb-" + String(
            suggestedSize[0]) + "x" + String(suggestedSize[1]) +
          ".jpg";
        var resizedPath = __dirname + "/test-thumb-" + String(
            suggestedSize[0]) + "x" + String(suggestedSize[1]) +
          "-resized.jpg";

        // generate image and save
        gm(suggestedSize[0], suggestedSize[1], "#ddff99").write(
          filePath,
          function(err) {
            // open saved "original" image and resize
            gm(filePath)
              .thumb(
                825,
                400,
                resizedPath,
                100,
                'center',
                function(err) {
                  // open resized image
                  gm(resizedPath).size(function(err, size) {
                    // delete temp files
                    fs.unlinkSync(filePath);
                    fs.unlinkSync(resizedPath);

                    // send resize result
                    callback(null, {
                      original: {
                        width: suggestedSize[0],
                        height: suggestedSize[1]
                      },
                      resized: size,
                      requested: {
                        width: 825,
                        height: 400
                      }
                    })
                  })
                });
          });
      }
    };

    async.map(sizes, ThumbnailLibrary.test.bind(ThumbnailLibrary),
      function(err, results) {
        results.forEach(function(sizes) {
          console.log(sizes)
            // expect(sizes).to.have.property("width")
            // expect(sizes).to.have.property("height")
          expect(sizes.resized.width).to.equal(825);
          expect(sizes.resized.height).to.equal(400);
        })
        done()
      });

  });
});
