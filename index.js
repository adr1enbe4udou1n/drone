require('dotenv').config();
const slugify = require('slugify');

const port = parseInt(process.env.PORT || '3000', 10);

let express = require('express'),
  http = require('http'),
  app = express(),
  bodyParser = require('body-parser'),
  childprocess = require('child_process'),
  path = require('path');

app.use(bodyParser.json());

app.post(process.env.WEBHOOK_PATH || '/deploy', (req, res) => {
  if (!req.body || !req.body.repository || !req.body.repository.name) {
    return res.status(400).json({
      message: 'Invalid request!'
    });
  }

  let name = slugify(req.body.repository.name, {
    lower: true
  });

  let projectDir = path.join(process.env.PROJECTS_ROOT, name);

  childprocess.exec(`cd ${projectDir} && git pull`);

  const date = new Date();
  console.log(`${projectDir} pulled at ${date.toString()} !`);

  res.status(200).json({
    message: 'Git Hook received!'
  });
});

http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
