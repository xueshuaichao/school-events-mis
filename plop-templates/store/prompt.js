const utils = require('../utils');

module.exports = {
    description: 'generate a components',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'store name please',
            validate: utils.noEmpty('store name'),
        },
    ],
    actions: () => {
        const actions = [
            {
                type: 'add',
                path: 'src/store/module/{{ name }}.js',
                templateFile: 'plop-templates/store/index.hbs',
                data: {
                    name: '{{ name }}',
                },
            },
        ];

        return actions;
    },
};
