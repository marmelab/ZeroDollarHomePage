export default entry => {
    if (entry.c) return entry.c[0];
    return entry;
};
