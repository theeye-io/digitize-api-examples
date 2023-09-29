token=${TAGGER_ACCESS_TOKEN}

find ./uploaded/ -maxdepth 1 -name '*.pdf' | while read filename;
do
	id=$(basename ${filename} | cut -d'.' -f'1')

	curl -X PUT --header 'Content-Type: application/json' \
	       	--header 'Accept: application/json' \
	       	-d '{}' "https://tagger-api-dev.theeye.io/api/Documents/${id}/reprocess?access_token=${token}"
done

