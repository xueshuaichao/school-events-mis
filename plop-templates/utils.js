const noEmpty = name => (v) => {
    if (!v || v.trim === '') {
        return `${name} is required`;
    }
    return true;
};

module.exports = {
    noEmpty,
};
