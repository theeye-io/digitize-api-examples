dir=${1}
token=${2}

find ${dir} -maxdepth 1 -name '*-1.json' | while read filename;
do
	id=$(basename ${filename} | cut -d'-' -f'1')
	echo ${id}
	curl -X PUT --header 'Content-Type: application/json' \
	       	--header 'Accept: application/json' \
	       	-d '{}' "https://tagger-api-dev.theeye.io/api/Documents/${id}/reprocess?access_token=${token}"
done

