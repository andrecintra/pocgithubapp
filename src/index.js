const express = require('express');
const GitHubService = require('./github-service');

const app = express();
app.use(express.json());

app.post('/event', function(req, res) {
  console.log('Github post', req.body);
  res.json({ ok: 1 });
});

app.get('/getfile/:fileName', async function(req, res) {
  const result = await GitHubService.getfile(req.params.fileName)
  res.json( {data: result.data }); 
});

app.post('/savefile', async function(req, res) {
  const result = await GitHubService.saveFile()
  res.json( {data: result.data }); 
});


app.listen(3000);



