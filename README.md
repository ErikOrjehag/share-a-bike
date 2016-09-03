# Share a bike

## Eget API

GET /api/user/:id

{
  "id": 1,
  "email": "erik@orjehag.se",
  "full_name": "Erik Örjehag",
  "profile_text": "This is a cool service!",
  "rating": 5,
  "image_url": "/images/erik.png"
}


## Points of interest (POIs)

Cykelparkering: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=cykelparkering&version=1.1.0&

Cykelpumpar: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=cykelpumpar&version=1.1.0&

Köpcentrum: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=kopcentrum&version=1.1.0&

Resecentrum: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=resecentrum&version=1.1.0&

Turistinfo: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=turistinfo&version=1.1.0&

Lekplatser: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=lekplatser&version=1.1.0&

Museum: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=museum&version=1.1.0&

Badplatser i kommunen: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=bad_ute&version=1.1.0&

Bibliotek: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=bibliotek&version=1.1.0&

Busshållplatser: 
http://kartan.linkoping.se/isms/poi?service=wfs&request=getfeature&typename=busshallplats&version=1.1.0&

## Vägarbeten 

Vägarbeten på kommunala vägar. Använder en key som Fredrik har skapat idag: 
http://opendata.linkoping.se/ws_opendata/main.asmx/VagarbeteAlla?CustomKey=35d30b1596bc4aae87638b36f3053292

## Vägtrafikolyckor

