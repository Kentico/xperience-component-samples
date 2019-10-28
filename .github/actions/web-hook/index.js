const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios").default;

try {
    const url = core.getInput("url");

    core.debug(`Argument url: ${url}`);
    core.debug(`Payload: ${JSON.stringify(github.context.payload, undefined, 2)}`);

    axios({
        url,
        method: "POST",
        data: github.context.payload,
        headers: {
            "Content-type": "application/json",
        }
    }).then(function (response) {
        core.debug(`Remote server responds with status: ${response.status} ${response.statusText}`);
    }).catch(function (reason) {
        core.warning(reason);
    });

} catch (e) {
    core.setFailed(e.message);
}
