module.exports = (app) => {
    const orgs = require('../controllers/org.controller');

    // Create and save new comment against the given org.
    app.post('/orgs/:org/comments', orgs.create);

    // Retrieve all comments against the given org.
    app.get('/orgs/:org/comments/:limit', orgs.findAll);

    // Delete(soft) comments for an org.
    app.delete('/orgs/:org', orgs.delete);
}