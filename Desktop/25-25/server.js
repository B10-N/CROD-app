 import express from 'express';
 import { MongoClient , ObjectId  } from 'mongodb';
 import dotenv from 'dotenv';
 dotenv.config()
 const PORT = process.env.PORT
 const app = express();

app.use(express.json())


const uri = process.env.MONGODB_URI
const client = new MongoClient(uri);
let dbName = 'moviesDB'
let db
const connectToDb = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        
    }
    catch(error){
        console.log(error)
    }


}


connectToDb()




app.post('/movies/add-movie' , async (req , res)=>{
    try{
        const movie = req.body
        // const result = await db.collection('movies').insertOne(movie)
        const result = await db.collection('movies').insertMany(movie)
        if(!result){
            res.status(500).send({message : 'Movie not added' })
        }
        res.status(201).json({message : 'Movie added successfully' , result})

    }catch{
        console.log(error)
        res.status(500).send('Cannot add movie')
    }
})



app.get ('/movies' , async (req , res)=>{
    try{
        const movies = await db.collection('movies').find().toArray()
        res.status(200).json(movies)
        }catch(error){
            console.log(error)
            res.status(500).send('Cannot fetch movies')
            }
            })


//            app.get('/movies/:id', async (req, res) => {
//          try {
//         const id = req.params.id
//         const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) })
//         if (!movie) {
//             res.status(404).send('Movie not found')
//         } else {
//             res.status(200).json(movie)
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send('Cannot fetch movie')
//     }
// })
           app.get('/movies/:title', async (req, res) => {
         try {
        const {title} = req.params
        const movie = await db.collection('movies').findOne({ title })
        if (!movie) {
            res.status(404).send('Movie not found')
        } else {
            res.status(200).json(movie)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Cannot fetch movie')
    }
})


app.put('/UpdateMovie/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updates = req.body
        const result = await db.collection('movies').updateOne({ _id: new ObjectId(id) }, { $set: updates })
        if (result.matchedCount === 0) { // Check if no movie was matched
            res.status(404).send('Movie not found')
        } else {
            res.status(200).json({ message: 'Movie updated successfully', result })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Cannot update movie')
    }
}) 


app.delete('/deleteMovie/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id)
            })
            if (result.deletedCount === 0) { // Check if no movie was deleted
                res.status(404).send('Movie not found')
                } else {
                    res.status(200).json({ message: 'Movie deleted successfully', result })
                    }
                    } catch (error) {
                        console.log(error)
                        res.status(500).send('Cannot delete movie')
                        }
                        })





 app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))