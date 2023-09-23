const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator')


//route 1: get all the notes, Get "api/notes/fetchallnotes". login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
})

//route 2: add a new notes, post "api/notes/addnote". login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'discription must be 5 char long').isLength({ min: 5 })
], async (req, res) => {

    // if there are error return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, description, tag } = req.body;
        const note = await new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(note)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal server error")
    }


})

//route 3: update an existing note, PUT "api/notes/updatenote". login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const{title,description,tag}=req.body
        //create a newNote object
        const newNote={};
        if(title){newNote.title= title};
        if(description){newNote.description= description};
        if(tag){newNote.tag= tag};


        //find the note to be updated and update it
        let note=await Note.findById(req.params.id)
        if(!note){
            return res.status(404).send("not found")
        }
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("not allowed")
        }

        note=await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new: true})
        res.json(note);

    } catch (error) {
        console.log(error.message)  
        res.status(500).send("Internal server error")
    }
}) 

//route 4: dlete an existing note, Delete "api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //find the note to be deleted and delete it
        let note=await Note.findById(req.params.id)
        if(!note){
            return res.status(404).send("not found")
        }
        //if user is not same
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("not allowed")
        }

        note=await Note.findByIdAndDelete(req.params.id)
        res.json({"Sucees": "Note has been deleted"});

    } catch (error) {
        console.log(error.message)  
        res.status(500).send("Internal server error")
    }
}) 
module.exports = router