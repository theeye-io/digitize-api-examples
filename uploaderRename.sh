token=''

find . -maxdepth 1 -name '*.pdf' | while read filename;
do
	echo "${filename}"

	id=$(basename ${filename} | cut -d'.' -f'1')
	echo $id

	resId=$(curl -s -X POST -F file=@$filename "https://tagger-api-dev.theeye.io/api/documents/upload?access_token=${token}" | jq -r '.id')

	echo "uploaded as $resId"

	mv "${filename}" "uploaded/${resId}.pdf"
	mv "${id}-1.json" "uploaded/${resId}-1.json"
done

