const utils = require('../utils');

module.exports = {
    description: 'generate a components',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'component name please',
            validate: utils.noEmpty('api js name'),
        },
    ],
    actions: () => {
        const actions = [
            {
                type: 'add',
                path: 'src/api/{{name}}.js',
                templateFile: 'plop-templates/api/index.hbs',
                data: {
                    name: '{{ name }}',
                },
            },
        ];

        return actions;
    },
};
