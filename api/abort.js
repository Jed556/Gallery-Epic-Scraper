// Simplified abort endpoint placeholder for parity with legacy server (stateless on serverless).
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    res.status(200).json({ success: true, message: 'Abort acknowledged (no persistent session state).' });
};
