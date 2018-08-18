const express = require('express')
const router = express.Router()
const categoryClient = require('../dbClients/categoriesDB')
const articleClient = require('../dbClients/articlesDB')
const WeegieDB = require('./../dbClients/weegieQuestionDB')
const path = require('path')
const imagesDir = path.dirname(require.main.filename) + '/../public/images'
const knex = require("../dbClients/connection");

/* GET Articles page. */

function getLanguages(){
  return knex.select().from("languages");
};

router.get('/languages', async (req, res) =>{
     const response = await getLanguages()
    res.status(200).json({ success: true, response })
})

router.get('/articles', function (req, res, next) {
  const callBack = (error, articles) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
    } else {
      res.json(articles)
    }
  }
  const { language = 'en' } = req.query

  articleClient.findArticles({ visible: true, language: language }, callBack)
})

router.post('/addArticle', function (req, res) {
  const article = JSON.parse(req.body.article)

  const callback = (article) => {
    if (req.files) {
      const image = req.files.image

      image.mv(`${imagesDir}/${article._id}.png`, (err) => {
        if (err) {
          console.error(err)
        } else console.log('image has uploades')
      })
    }
    return res.send(200)
  }
  const onError = (e) => {
    res.status(500)
    res.json({ error: 'An error has been occurred' })
  }
  articleClient.addArticle(article, callback).catch(onError)
})

router.post('/weegie/user/answer', (req, res) => {
  const findQuestionCb = (err, data) => {
    if (err) { return err }
    let similarQuestions = []
    let allQuestions = data
    let userAnswer = req.body

    allQuestions.map((question) => {
      userAnswer.map((answer) => {
        if (question._id === answer.title) {
          similarQuestions.push(question)
        }
      })
    })

    const checkAnswers = (questions, answers) => {
      let result = {}
      let wrongAnswersList = []
      let corretAnswers = 0
      let wrongAnswers = 0
      answers.map((answer) => {
        questions.map((question) => {
          if (question._id === answer.title) {
            if (question.answer === answer.answer) {
              corretAnswers++
            } else {
              wrongAnswers++
              wrongAnswersList.push(question)
            }
          }
        })
      })
      result.wrongAnswersList = wrongAnswersList
      result.correctAnswers = corretAnswers
      result.wrongAnswers = wrongAnswers
      console.log(result)
      res.send(result)
    }
    checkAnswers(similarQuestions, userAnswer)
  }

  WeegieDB.findQuestions({}, findQuestionCb)
})
/* GET Single Articles */
router.get('/articles/:articleId', function (req, res, next) {
  const articleId = req.params.articleId
  const callBack = (error, singleArticles) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
    } else {
      res.json(singleArticles)
    }
  }
  articleClient.findArticleById(articleId, callBack)
})
router.get('/categories', function (req, res, next) {
  const callback = (error, data) => {
    if (error) {
      next(error)
    } else {
      res.json(data)
    }
  }
  categoryClient.findCategories({ visible: true }, callback)
})

/* GET Single Category's articles */
router.get('/categories/:categoryId', function (req, res, next) {
  const categoryId = req.params.categoryId
  const callBack = (error, articles) => {
    if (error) {
      console.error(error)
      res.sendStatus(500)
    } else {
      res.json(articles)
    }
  }
  const { language = 'en' } = req.query

  articleClient.findArticles({ category: categoryId, 'visible': true, language: language }, callBack)
})

router.get('/weegie', (req, res, next) => {
  const callback = (error, question) => {
    if (error) {
      next(error)
    } else {
      let shuffle = (array) => {
        let temporaryValue
        let randomIndex
        let currentIndex = array.length

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
        // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex)
          currentIndex -= 1

          // And swap it with the current element.
          temporaryValue = array[currentIndex]
          array[currentIndex] = array[randomIndex]
          array[randomIndex] = temporaryValue
        }

        return res.json(question)
      }

      shuffle(question)
    }
  }
  WeegieDB.findQuestions({}, callback)
})
module.exports = router
