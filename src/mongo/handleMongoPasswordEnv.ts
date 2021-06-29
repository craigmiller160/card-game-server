const handleMongoPasswordEnv = () => {
    if (!process.env.MONGO_PASSWORD) {
        process.env.MONGO_PASSWORD = process.env.MONGO_ROOT_PASSWORD;
    }
};

export default handleMongoPasswordEnv;