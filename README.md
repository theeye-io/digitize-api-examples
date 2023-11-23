# digitize-api-examples


## descargar lista de comprobantes procesados (solo metadata)

aca se usa el token de la organizacion origen

```
token=''

curl -X GET \
 --header 'Accept: application/json' \
  --output lote.json \
    "https://digitize-api.theeye.io/api/Documents/report?access_token=${token}&filters%5Bfrom%5D=2023-03-01T00%3A00%3A00.000Z&filters%5Bto%5D=2023-04-01T00%3A00%3A00.000Z"
```

## download de comprobantes (files)

aca también se usa el token de la organizacion origen, de donde descargar los pdf y annotation

```
token=''

node downloader.js ./lote.json ${token}
```

esto descarga pdf y json.

la organizacion puede estar en modo procesamiento "immediate: false" para que los comprobantes queden en espera al ser importados de forma masiva

## upload de comprobantes.

aca se usa el token de la organizacion destino.

NOTA: al generar un nuevo token desde el panel de theeye se debe acceder al endpoint de authorize de digitize para registrar el token y poder utilizarlo.

```
token=''
bash submit.sh './annotations-0/' $token
```

## reprocesar comprobantes

se usa el token de la organización destino donde fueron subidos los documentos.

el parametro que recibe es donde fueron colocados todos los annotation generados y listos para reprocesar.

```
token=""
bash reprocesar.sh /opt/theeye/convert/20231002/ ${token}
```
