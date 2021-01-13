export default function handler(req, res) {
    const {
        query: { name },
    } = req
    res.status(200).json({'message': `Hello ${name}`})
}