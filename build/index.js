const { exec } = require('child_process');

const arg = process.argv.splice(2)[0].substr(2);

exec(`sh ./build/shell/${arg}.sh`, [], null, (error) => {
    if (error) {
        throw new Error(error);
    }
});
