class CatalogController {
    constructor(CatalogModel) {
        this.CatalogModel = CatalogModel;
    }

    async createCatalogItem(req, res) {
        try {
            const newItem = new this.CatalogModel(req.body);
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getCatalogItems(req, res) {
        try {
            const items = await this.CatalogModel.find();
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCatalogItem(req, res) {
        try {
            const updatedItem = await this.CatalogModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(updatedItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteCatalogItem(req, res) {
        try {
            const deletedItem = await this.CatalogModel.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default CatalogController;