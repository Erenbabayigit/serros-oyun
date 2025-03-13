// netlify-functions/get-questions.js
const questions = require('../data/questions.json');

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(questions),
  };
};
