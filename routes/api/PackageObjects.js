const { Router } = require('express')
const PackageObject = require('../../models/PackageObject')

const router = Router()

//
router.get('/', async (req, res) => {
    try {
        const packageObjects = await PackageObject.find()
        if (!packageObjects) throw new Error('No package objects')
        const sorted = packageObjects.sort((a, b) => {
            return (new Date(a.date).getTime() - new Date(b.date).getTime())
        })
        res.status(200).json(sorted)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
})

router.post('/', async (req, res) => {
    const newPackageObject = new PackageObject(req.body)
    try {
        const packageObjectItem = await newPackageObject.save()
        if (!packageObjectItem) throw new Error('Something went wrong saving the package object')
        res.status(200).json(packageObjectItem)
    } catch (error) {
       res.status(500).json({message: error.message})

    }
})   

router.put('/:id', async (req,res) => {
    const {id} = req.params

    try {
        const response = await PackageObject.findByIdAndUpdate(id, req.body)
        if (!response) throw new Error('Something went wrong')
        const updated = { ...response._doc, ...req.body } 
        res.status(200).json(updated)

    } catch (error) {
        res.status(500).json({ message: error.message})
    }


})


router.delete('/:id', async (req,res) => {
    const {id} = req.params

    try {
        const removed = await PackageObject.findByIdAndUpdate(id)
        if (!removed) throw new Error('Something went wrong')
        const updated = { ...response._doc, ...req.body }
        res.status(200).json(removed)

    } catch (error) {
        res.status(500).json({ message: error.message})
    }


})

module.exports = router
