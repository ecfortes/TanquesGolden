

exports.viewTanks = async (req, res) => {
    const id = req.params.id;
    try {
        res.render('tanques',{});
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro');
    }
};
