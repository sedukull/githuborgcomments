# Summary.
- RESTful Node js service wrapper to retrieve comments against the given github organization. 
- API's to persist, retrieve comments for a given organization. 
- Comments are persisted in mongodb.
- Comments are still available post delete.
- Uses Node.js, express and MongoDB.

## List of API's and use cases:

** GET /orgs/:org/comments **
   - Retrieves the list of all comments against the given github organization. 
   - Returns the comments which are not soft deleted. 
   - Returns all the comments for the given organization.
   - However, the number of comments to be returned can be configured by default. Please check app.config.json

** GET /orgs/:org/comments/:limit **
   - Retrieves the given number of comments for the given organization. 
   - Number of comments are limited by the <limit> request param.
 
** GET /orgs/:org/comments?limit=1&page=1 **
   - Returns the comments for a given org paginated with given page size.
   - Retrieves the comments for the given org.
   - Number of comments per page are limited by <limit> request param.
   - Leverages the mongo limit and skip logic for server side pagination.
    
** POST /orgs/:org/comments {'comment': <comment info>} **
   - Posts the comments against the given org.
   - Comments are persisted in mongodb, only 1. If the input org string is not empty (and) 2. Input org is available in the github org listing.
   - If validated correctly for input org, persists the comment in mongodb.
   - The input comment size is limited to 100 characters. 
   - The validation for comment size to 100 characters can be controleld through config setting. Refer /config/app.config.json.
  
  
** DELETE /orgs/:org/comments **
  - Deletes the comments against the given org. 
  - Its a soft delete operation. 
  - The comments are still available in MongoDB for audit.

** GET Http://localhost:<portnumber>
  - Returns all the endpoints implemented by the service.
 

## prerequisites

- Mongodb has to be installed and configured: Ref database.config.json
- For github integration, token and flag to use the api key can be configured in app.config.json. Please check 'auth' section.

## Setup Information

1. Install dependencies

```bash
npm install
```

2. Run the service

```bash
node app.js
```
