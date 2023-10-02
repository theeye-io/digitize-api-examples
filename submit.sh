dir=${1}
token=${2}
mkdir "${dir}/uploaded"
find ${dir} -maxdepth 1 -name '*.pdf' | while read filename;
do
  echo "${filename}"
  id=$(basename ${filename} | cut -d'.' -f'1')
  echo $id
  resId=$(curl -s -X POST -F file=@$filename "https://tagger-api-dev.theeye.io/api/documents/upload?access_token=${token}" | jq -r '.id')
  echo "uploaded as ${resId}"
  mv "${filename}" "${dir}/uploaded/${resId}.pdf"
  mv "${dir}/${id}.json" "${dir}/uploaded/${resId}-1.json"
done

