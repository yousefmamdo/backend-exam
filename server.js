const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());
const PORT = process.env.PORT;
server.use(express.json());

const mongoose = require('mongoose');



mongoose.connect(process.env.Mongoose, {
    useNewUrlParser: true,

    useUnifiedTopology: true
});
const fruitSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String
});
const userSchema = new mongoose.Schema({
    email: String,
    fruits: [fruitSchema]
});
const fruitModel = mongoose.model('fruits', userSchema);



class fruitClass {
    constructor(name, image, price) {
        this.name = name,
            this.image = image,
            this.price = price
    }

}

server.get('/fruits', async (req, res) => {
    let url = 'https://fruit-api-301.herokuapp.com/getFruit'
    let ruselt = await axios.get(url)
    console.log(ruselt.data.fruits);
    let fruitsData = ruselt.data.fruits.map(item => {
        return new fruitClass(item.name, item.image, item.price)
    })
    res.send(fruitsData);
})
server.post('/addtofav', (req, res) => {
    let email = req.query.email;
    const { name, image, price } = req.body;
    fruitModel.find({ email: email }, (error, data) => {
        if (error) {
            res.send(error)
        } else {
            if (!Array.isArray(data.fruits)) {
                data.fruits = [];
            }
            fruitModel.push({
                email: email,
                name: name,
                image: image,
                price: price
            })
            fruitModel.save();
            res.send(fruitModel)

        }
    })

})

server.delete('/deletefrut', (req, res) => {
    let email = req.query.email;
    let index = Number(req.params.idx)
    fruitModel.find({ email: email }, (error, data) => {
        if (error) {
            res.send(error0)
        } else {
            let filtered = fruitModel.filter((item, itemIdx) => {
                if (itemIdx !== index) {
                    return item;
                }


            })
            fruitModel.fruits = filtered
            fruitModel.fruits.save();
            res.send(fruitModel.fruits)
        }
    })
}

    server.put('/uabdate', (req, res) => {
    let email = req.query.email;
    let index = (req.params.idx);
    const { name, image, price } = req.body;
    fruitModel.find({ email: email }, (error, data) => {
        if (error) {
            res.send(error0)
        } else {
            fruitModel.fruits.splice(index, 1, {
                name: name,
                image: image,
                price: price
            })
            fruitModel.fruits.save()
            res.send(fruitModel.fruits)
        }

    })
}

server.listen(PORT, console.log(`listening on port ${PORT}`));