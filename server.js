import express  from "express";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


app.post('/api/add-data', async(req,res) => {
    const {inputData} = req.body;
    inputData.images = JSON.parse(inputData.images)
    const imageData = inputData.images.map(url => ({url}));

    try{
        const newData = await prisma.product.create({
            data:{
             title: inputData.title,
             description: inputData.description,
             price: parseInt(inputData.price),
             discountPercentage: parseFloat(inputData.discountPercentage),
             rating: parseFloat(inputData.rating),
             stock: parseInt(inputData.stock),
             brand: inputData.brand,
             category: inputData.category,
             thumbnail:inputData.thumbnail,
            images: {
                create: imageData
            }
            }
        })
        await prisma.$disconnect()
        res.status(201).json(newData);
    }catch(error){
        console.log('error is ', error)
        await prisma.$disconnect()
        res.status(500).json({error: 'Internal server error'})
    }

})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});