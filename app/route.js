const Url = require('./url');
const validUrl = require('valid-url');

const baseUrl = "http://localhost:3000/";

const saveUrl = async (req, res, next) => {

    const { longUrl } = req.body;

    if (validateUrl(longUrl)) {
        const originUrl = await Url.findOne({ longUrl });
        if (!originUrl) {
            const code = generateShortUrl();
            const newUrl = new Url({
                longUrl: longUrl,
                shortUrl: baseUrl + code,
                code: code,
            });

            await newUrl.save();
            res.status(200).json({ "original_url": longUrl, "short_url": code })
        }
        else {
            res.status(200).json({ "original_url": originUrl.longUrl, "short_url": originUrl.code })
        }
    }
    else {
        res.status(400).json({ "error": "invalid URL" })
    }

}

const redirectUrl = async (req, res, next) => {
    const code = req.params.code;

    console.log("attempting redirects");
    
    if (code) {
        const url = await Url.findOne({ code });
        if (url) {
            res.redirect(url.longUrl);
        }
        res.status(400).json({ "error": "invalid URL" })
    }
    else {
        console.log("attempting error");
        res.status(400).json({ "error": "invalid URL" })
    }

}


function generateShortUrl() {
    return '_' + Math.random().toString(36).substr(2, 6);
}

function validateUrl (url) {
    var isValid = false;
 
    if (validUrl.isUri(url)){
        isValid = true;
    } else {
        isValid = false;
    }

    
    return isValid;
}

module.exports = { saveUrl, redirectUrl }