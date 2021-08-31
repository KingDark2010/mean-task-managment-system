const {app, Port} = require('./src/app');

app.listen(Port, () => {
    console.log(`server is running on port ${Port}`)
});
