const adminMiddleware = (req, res, next) => {
    const { role } = req.body;

    if (role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }

    next();
};

export default adminMiddleware;
