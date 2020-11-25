const utils = require('../utils');

module.exports = {
    description: 'generate a components',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'component name please',
            validate: utils.noEmpty('components name'),
        },
    ],
    actions: () => {
        const actions = [
            {
                type: 'add',
                path: 'src/view/components/{{name}}/index.vue',
                templateFile: 'plop-templates/component/index.hbs',
                data: {
                    name: '{{ name }}',
                },
            },
        ];

        return actions;
    },
};
