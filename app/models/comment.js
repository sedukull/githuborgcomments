/**
 * Comments model to persist the organization comments information in mongodb.  
 */
const mongoose = require('mongoose');

const OrgCommentSchema = mongoose.Schema({
    org: String,
    valid: Boolean,
    comment: String
}, {
    timestamps: true
});

OrgCommentSchema.statics.findOrgAndModify = function (query, sort, doc, options, callback){
  return this.collection.findAndModify(query, sort, doc, options, callback);
}

module.exports = mongoose.model('OrgComment', OrgCommentSchema);