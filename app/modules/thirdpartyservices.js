/**
 * Third party module to integrate with github api.
 */
const httpLibrary = require("axios")
const log = require('loglevel')
const appConfig = require('../../config/app_config')
const util = require("util")
require('dotenv').config()

log.setDefaultLevel(log.levels.DEBUG);

const environment = process.env.NODE_ENV || 'development';


/**
 * Finds the github organization with a given name.
 */
exports.findOrg = async (orgName) => {
    var timeOut = appConfig[environment].time_out;
    var baseUrl = appConfig[environment].github_base_url;
    var uri = util.format("%s/orgs/%s", baseUrl, orgName);

    log.info(`=== Url: ${uri}. Org Name: ${orgName} ====`);
    var options = {
      url: uri,
      method: 'GET',
      headers: {
        'User-Agent': 'request'
      },
      timeout: timeOut
    };
    return httpLibrary(options)
    .then(res => {
            if (res.status === 200) {
                return res.data.name;
            }
            return "";
        })
    .catch(err => {log.error(err); return "";});
}