var express = require('express');
var router = express.Router();
const fs = require('fs');

let resultObject = {
    status: "",
    result: "",
    errorCode: 0,
    errorMessage: ""
}


router.get('/', function (req, res, next) {

    let requestedWords = req.originalUrl.replace('/', '');

    if (requestedWords == "" || requestedWords == null || requestedWords == undefined) {
        resultObject.status = "ERROR"
        resultObject.result = ""
        resultObject.errorCode = 1
        resultObject.errorMessage = "No search word has been found"
        return res.render('result', resultObject)
    }

    let initializePromise = initialize();

    initializePromise.then(result => {

        let anagrams = findAnagrams(requestedWords, result);
        resultObject.status = "SUCCESS"
        resultObject.result = anagrams
        resultObject.errorCode = 0
        resultObject.errorMessage = ""

        return res.render('result', resultObject)
    }, (err) => {
        resultObject.status = "ERROR"
        resultObject.result = ""
        resultObject.errorCode = 2
        resultObject.errorMessage = err

        return res.render('result', resultObject)
    })

})




const initialize = () => {

    return new Promise(function (resolve, reject) {
        try {
            let contents = fs.readFileSync('./data/wordlist.txt', 'utf8');
            resolve(contents)
        } catch (err) {
            reject(err)
        }
    })

}

const findAnagrams = (requestedWords, content) => {
    let resultData = []
    let wordsArray = requestedWords.split(',');
    let contentArray = content.toString().split('\n')

    wordsArray.forEach(element => {
        let str1 = regularize(element);
        let item = {
            requestedWord: element,
            anagrams: ""
        }

        let index = resultData.findIndex(item => item.requestedWord == element)
        if (index < 0) {
            contentArray.forEach(contentElement => {
                if (element != contentElement) {
                    let str2 = regularize(contentElement);
                    if (regularize(str1) == regularize(str2)) {
                        item.anagrams += (item.anagrams == "" ? contentElement : ', ' + contentElement)
                    }
                }
            })

            resultData.push(item)
        }

    });

    return resultData
}

const regularize = (str) => {
    return str.toLowerCase().split('').sort().join('').trim();
}

module.exports = router;