const utils = require('../utils');

module.exports = {
    description: 'generate a view',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'view name please eg "index.vue; home/home.vue"',
            validate: utils.noEmpty('name'),
        },
        {
            type: 'list',
            name: 'blocks',
            message: 'choice a view template',
            default: 'list',
            choices: ['list', 'detail', 'edit', 'default'],
        },
    ],
    actions: () => {
        const actions = [
            {
                type: 'add',
                path: 'src/view/{{name}}',
                templateFile: 'plop-templates/view/{{ blocks }}.hbs',
                data: {
                    name: '{{ name }}',
                },
            },
        ];

        return actions;
    },
};
