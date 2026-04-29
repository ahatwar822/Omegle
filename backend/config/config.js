
const PORT = process.env.PORT
if(!PORT) {
    console.warn("Setup PORT Environment Variable!!")
    process.exit(1)
}
const CORS_ORIGIN = process.env.CORS_ORIGIN
if(!CORS_ORIGIN) {
    console.warn("Setup CORS_ORIGIN Environment Variable!!")
    process.exit(1)
}
const CORS_METHODS = ["GET","POST"]

module.exports = {
    PORT,
    CORS_ORIGIN,
    CORS_METHODS
}