
module.exports.index = async (req, res) => {
    try {
        res.render('marketplace/our-products');
    } catch (err) {
        res.status(500).send('Error loading our products');
    }
};
