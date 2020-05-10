import express from 'express';

const app = express();

const html = `
    <html>
        <script src="/static/index.es5.js"></script>
        <body>
            <h1>Source Maps are awesome!</h1>
        </body>
    </html>
`;

app.use('/static', express.static('build'));
app.get('/', (req, res) => res.send(html));

app.listen(4400, () => console.log('App Listening on Port ' + 4400));
