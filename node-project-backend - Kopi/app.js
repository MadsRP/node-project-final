import express from "express";
import cors from "cors";
import * as fs from "fs";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
const artists = JSON.parse(fs.readFileSync("./artists.json"));
let artist;

app.get(`/`, (req, res) => {
  console.log("Hello");
  res.send("Hi");
});

app.get(`/artists`, (req, res) => {
  res.send(artists);
});

app.get("/artists/:uid", (req, res) => {
  const uid = Number(req.params?.uid);
  console.log(uid);
  const result = artists.find((artist) => artist.uid === uid);
  res.json(result);
});

app.post(`/artists`, async (req, res) => {
  const newArtist = req.body;
  console.log(newArtist.uid);
  artists.push(newArtist);
  fs.writeFile(`./artists.json`, JSON.stringify(artists), (err) => {
    if (err) {
      console.log("err");
    } else {
      console.log("File written successfully\n");
      res.send(artists);
    }
  });
});

app.delete("/artists/:uid", (req, res) => {
  const uid = Number(req.params?.uid);
  const deleteArtist = artists.find((artist) => artist.uid === uid);
  const index = artists.indexOf(deleteArtist);
  artists.splice(index, 1);
  fs.writeFile(`./artists.json`, JSON.stringify(artists), (err) => {
    if (err) {
      console.log("err");
    } else {
      console.log("File written successfully\n");
      res.send(artists);
    }
  });
  console.log(artists);
});

app.put(`/artists/:uid`, (req, res) => {
  const uid = Number(req.params.uid);
  console.log(uid);
  let artistToUpdate = artists.find((artist) => artist.uid === uid);
  console.log(artistToUpdate);
  let index = artists.indexOf(artistToUpdate);

  Object.assign(artistToUpdate, req.body);
  console.log(req.body);
  artists[index] = artistToUpdate;

  fs.writeFile("./artists.json", JSON.stringify(artists), (err) => {
    if (err) {
      console.log("err");
    } else {
      console.log("File written successfully\n");
      res.send(artists);
    }
  });
});

app.listen(3005, () => {
  console.log("Server on port http://localhost:3005/");
});
