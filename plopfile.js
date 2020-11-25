const viewGenerator = require('./plop-templates/view/prompt');
const componentGenerator = require('./plop-templates/component/prompt');
const apiGenerator = require('./plop-templates/api/prompt.js');
const routerGenerator = require('./plop-templates/router/prompt.js');
const storeGenerator = require('./plop-templates/store/prompt.js');

module.exports = function (plop) {
    plop.setGenerator('view', viewGenerator);
    plop.setGenerator('component', componentGenerator);
    plop.setGenerator('api', apiGenerator);
    plop.setGenerator('router', routerGenerator);
    plop.setGenerator('store', storeGenerator);
};
