const { MongoClient, Db } = require("mongodb")

module.exports = class Mongodb {
    db = null
    url = process.env.MONGO_URL ? process.env.MONGO_URL : ""
    /**
     * Pega o banco de dados
     * @returns {Promise<Db>}
     */
    async getDB() {
        return new Promise(res => {
            if (this.db === null) {
                MongoClient.connect(this.url, {
                    maxPoolSize: 40
                }, (err, db) => {
                    if (db)
                        this.db = db.db("stonkswallet");
                    res(this.db)
                })
            } else
                res(this.db)
        })
    }
}