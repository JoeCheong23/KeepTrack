const { Router } = require('express')
const PackageObject = require('../../models/PackageObject')

const router = Router()

//
router.get('/', async (req, res) => {
    try {
        const packageObjects = await PackageObject.find();
        if (!packageObjects) throw new Error('No package objects')
        const sorted = packageObjects.sort((a, b) => {
            return (new Date(a.date).getTime() - new Date(b.date).getTime())
        })
        res.status(200).json(sorted);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
})

router.post('/', async (req, res) => {
    const newPackageObject = new PackageObject(req.body)
    try {
        console.log(req.body);
        const packageObjectItem = await newPackageObject.save();
        if (!packageObjectItem) throw new Error('Something went wrong saving the package object');
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(error.message);

    }
})   

router.put('/:trackingNumber', async (req,res) => {
    const {trackingNumber} = req.params;
    const updatedObject = {
        status: req.body.status,
        location: req.body.location
    };

    try {
        const response = await PackageObject.findOneAndUpdate({trackingNumber: trackingNumber}, updatedObject );
        if (!response) throw new Error('Something went wrong')
        res.status(200).json(response);


    } catch (error) {
        res.status(500).json({ message: error.message})
    }


})

router.put('/userEditing/:trackingNumber', async (req,res) => {
    const {trackingNumber} = req.params;
    const updatedObject = {
        cost: req.body.cost,
        description: req.body.description,
    };

    try {
        const response = await PackageObject.findOneAndUpdate({trackingNumber: trackingNumber}, updatedObject );
        if (!response) throw new Error('Problem updating the tracking object')
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: error.message});
    }


})


router.delete('/:trackingNumber', async (req,res) => {
    const {trackingNumber} = req.params

    try {
        const removed = await PackageObject.deleteMany({trackingNumber: trackingNumber})
        if (!removed) throw new Error('Problem with deleting')
        res.status(200).json(removed)

    } catch (error) {
        res.status(500).json({ message: error.message})
    }


})

module.exports = router
