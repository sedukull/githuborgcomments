const OrgComment = require('../models/comment');
const thirdPartyServices = require('.././modules/thirdpartyservices');
const log = require('loglevel');
const appConfig = require('../../config/app_config');
const url = require('url');

require('dotenv').config()

const environment = process.env.NODE_ENV || 'development';

log.setDefaultLevel(log.levels.INFO);

// Create and save the new comment.
exports.create = async (req, res) => {

    // Validate the request empty body.
    if(!req.body) {
        return res.status(400).send('Request body is missing')
    }

    // Validate the empty comment. 
    if(!req.body.comment) {
        log.debug("Invalid comment received")
        return res.status(400).send({
          message: "Comment can not be empty",
        });
    }
 
    // Validate the comment length based upon config. If comment length > 100, reject it.
    if (appConfig[environment].request_validation === true) {
        if (req.body.comment.length > 100) {
            log.debug("Input comment length is greater than 100 chars");
            return res.status(400).send({
                message: "Input comment should not be more than 100 chars.",
            });
        }
    }

    var orgName = req.params.org;

    // Validate that the input org is the valid github org, otherwise return.
    var githubOrgName = await thirdPartyServices.findOrg(orgName);
    
    if (githubOrgName.toLowerCase() !== orgName.toLowerCase()) {
        log.info(`Org: ${orgName} is not present in github`);
        return res.status(400).send({
          message: `Please enter a valid org. Given org: ${orgName} is not present at github`,
        });
    }

    log.info(`==== Org: ${orgName} is available in github ===`); 

    // Create comment.
    const orgComment = new OrgComment({
        org: req.params.org,
        comment: req.body.comment,
        valid: true
    });

  // Save comment in the database.
  orgComment.save()
    .then(
        data => {
        log.info("Comment saved to DB");
        res.status(200).send(data);
    }).catch(err => {
        log.warn(`comment not saved. Org: ${orgName}`);
        res.status(500).send({
            message: err.message || "Comment not saved. Please try again."
        });
    });
};

// Retrieve and return all comments from the database.
exports.findAll = (req, res) => {
  var limit = 0;
  var skip = 0;

  var queryData = url.parse(req.url, true).query;

  if (req.params.limit) {
       limit = Number(req.params.limit);
  }

  if (queryData.limit) {
      limit = Number(queryData.limit);
  }

  if (queryData.page) {
      skip = Number(queryData.skip);
  }

  log.info(`limit: ${limit}. page: ${skip}.`);

  OrgComment.find({'org': req.params.org, 'valid': true}).limit(limit).skip(skip * limit)
    .then(comments => {
        res.send(comments.map(item => ({'comment': item.comment, 'created date': item.createdAt})));
    }).catch(err => {
        log.warn(`Retrieving comments failed for Org: ${req.params.org}. Error: ${err}`);
        res.status(500).send({
            message: err.message || "Comments cannot be retrieved. Please try again."
        });
    });
};

// Delete (soft) comments for the specified org in the request.
exports.delete = (req, res) => {
  OrgComment.updateMany({'org': req.params.org},{'valid': false},{'new': true, 'multi': true})
    .then(comments => {
        res.send({message: "comments deleted successfully!"});
    }).catch(err => {
        log.warn(`comments deletion failed. Org: ${req.params.org}`, err);
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "comments not found with org " + req.params.org
            });                
        } else {
          return res.status(500).send({
            message: "Could not delete comments with org " + req.params.org
        });
       }
    });
};
