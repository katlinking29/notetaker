// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 7000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); 

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

// return the notes.html file
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Receive a new note, append it to the db.json file, and return the note. Also assigns the note a random id
app.post("/api/notes", function(req, res) {
  let note = (req.body)
  let id = uuidv4(); 
  note.id = id
  let notesArray;
  let savedNotes = fs.readFileSync("./db/db.json","utf-8");
  notesArray = JSON.parse(savedNotes);
  notesArray.push(note);
  
  fs.writeFile("./db/db.json", JSON.stringify(notesArray), function(error){
    if (error) {
      console.log(error);
    }
      console.log(notesArray); 
      return res.json(notesArray); 
  });
});

//Read the db.json file and return all saved notes as a JSON
app.get("/api/notes", function(req, res) {

  fs.readFile("./db/db.json", "utf-8", function(error, data){
    if (error) {
      return console.log(error);
    }

    return res.json(JSON.parse(data));
  });

});

// deletes the selected note based on the id. 
app.delete("/api/notes/:id", function(req, res){
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteid = req.params.id;
  console.log(`Deleting note with ID ${noteid}`);
  savedNotes = savedNotes.filter(currNote => {
      return currNote.id != noteid;
    })

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
});


// return the index.html file
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

  


  