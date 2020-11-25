const utils = require('../utils');

module.exports = {
    description: 'generate a components',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'router name please',
            validate: utils.noEmpty('router name'),
        },
    ],
    actions: () => {
        const actions = [
            {
                type: 'add',
                path: 'src/router/{{ name }}.js',
                templateFile: 'plop-templates/router/index.hbs',
                data: {
                    name: '{{ name }}',
                },
            },
        ];

        return actions;
    },
};
