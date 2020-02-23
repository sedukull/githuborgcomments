const OrgComment = require('../models/comment');
const thirdPartyServices = require('.././modules/thirdpartyservices');
const log = require('loglevel');
const appConfig = require('../../config/app_config');
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

    log.debug(`==== Org: ${orgName} isValid ===`); 

    // Create comment.
    const orgComment = new OrgComment({
        org: req.params.org,
        comment: req.body.comment,
        valid: true
    });


  // Save comment in the database.
  orgComment.save()
    .then(data => {
        res.send(data);
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

  if (req.params.limit) {
       limit = Number(req.params.limit);
  }
  if (req.params.page) {
      skip = Number(req.params.page);
  }
  log.info(`limit: ${limit}. page: ${req.params.page}.`);

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
  OrgComment.update({'org': req.params.org},{'valid': false},{'new': true, 'multi': true})
    .then(comments => {
        res.send({message: "comments deleted successfully!"});
      res.send(comments);
    }).catch(err => {
        log.warn(`comments deletion failed. Org: ${req.params.org}`);
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "comments not found with org " + req.params.org
            });                
        }
        return res.status(500).send({
            message: "Could not delete comments with org " + req.params.org
        });
    });
};
