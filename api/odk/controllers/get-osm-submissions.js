var fs = require('fs');
var settings = require('../../../settings');
var aggregateOsm = require('../osm/aggregate-osm');

/**
 * Aggregates together all of the OSM submissions
 * from ODK Collect / OpenMapKit Android to the
 * file system for the given form.
 */
module.exports = function (req, res, next) {
    var formName = req.params.formName;
    if (typeof formName === 'undefined' || formName === null) {
        res.status(400).json({
            status: 400,
            err: 'MISSING_PARAM',
            msg: 'You must specify a parameter for the formName in this end point.',
            path: '/odk/submissions/:formName.osm'
        });
    }
    var dir = settings.dataDir + '/submissions/' + formName;
    var osmFiles = [];

    // All of the submission dirs in the form directory
    fs.readdir(dir, function (err, submissionDirs) {
        if (err) {
            if (err.errno === -2) {
                // trying to open a directory that is not there.
                res.status(404).json({
                    status: 404,
                    msg: 'You are trying to receive aggregated OSM submissions from a form that does not exist or has no submissions. You may have misspelled the name of the form you are looking for. The name that you specified is: ' + formName,
                    err: err
                });
                return;
            }
            res.status(500).json({
                status: 500,
                msg: 'Problem reading submissionDirs.',
                err: err
            });
            return;
        }
        var len = submissionDirs.length;
        if (len === 0) {
            res.status(200).json([]);
            return;
        }

        // A structure to keep track of where we are while traversing directories
        // to find OSM files.
        var dirStat = {
            len: len,
            count: 0
        };

        for (var i = 0; i < len; i++) {
            dirStat.submissionDir = submissionDirs[i];
            dirStat.fullPath = dir + '/' + submissionDirs[i];
            if (dirStat.submissionDir[0] === '.') {
                ++dirStat.count;
                if (len === dirStat.count) {
                    aggregate(osmFiles, req, res);
                }
                continue;
            }
            findOsmFilesInDir(dirStat, osmFiles, req, res);
        }
    });
};

/**
 * Reads through all of the files in a submission directory and
 * appends the full OSM file path to the osmFiles array.
 *
 * @param dirStat  - the counters and paths of the directory we are async iterating through
 * @param osmFiles - all of the osm files we've found so far
 * @param req      = the http request
 * @param res      - the http response that needs to get resolved
 */
function findOsmFilesInDir(dirStat, osmFiles, req, res) {
    var fullPath = dirStat.fullPath;
    fs.readdir(fullPath, function (err, files) {
        if (err) {
            // trying to open a file instead of a directory, just continue on...
            if (err.errno === -20) {
                ++dirStat.count;
                return;
            }
            if (!res._headerSent) { // prevents trying to send multiple error responses on a single request
                res.status(500).json({
                    status: 500,
                    msg: 'There was a problem with reading the OSM files in the submissions directory.',
                    err: err
                });
            }
            return;
        }
        ++dirStat.count;
        for (var j = 0, len = files.length; j < len; j++) {
            var file = files[j];
            if (file.substring(file.length - 4) !== '.osm') continue; // Check if .osm file
            var longFilePath = fullPath + '/' + file;
            osmFiles.push(longFilePath);
        }
        if (dirStat.len === dirStat.count) {
            aggregate(osmFiles, req, res);
        }
    });
}

/**
 * Calls aggregate-osm middleware to read OSM edit files
 * and concatenate into a single OSM XML aggregation.
 *
 * @param osmFiles  - the JOSM OSM XML edits to aggregate
 * @param req       - the http request
 * @param res       - the http response
 */
function aggregate(osmFiles, req, res) {
    //We filter by the query parameters of the request
    aggregateOsm(osmFiles, req.query, function (err, osmXml) {
        if (err) {
            if (!res._headerSent) { // prevents trying to send multiple error responses on a single request
                res.status(500).json({
                    status: 500,
                    msg: 'There was a problem with aggregating OSM JOSM editor files in the submissions directory.',
                    err: err
                });
            }
            return;
        }
        res.set('Content-Type', 'text/xml').status(200).end(osmXml);
    });
}
