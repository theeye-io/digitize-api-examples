token=${TAGGER_API_TOKEN}
curl "https://tagger-api-dev.theeye.io/api/Documents/report?access_token=${token}" --output current.json
