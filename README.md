# Share a bike

## Till Sebbe

Fyra saker som den ska låta och blinka på: 

1. När någon har snott den ska den låta högt och blinka tydligt i flera färger. 
2. När man larmar och larmar av cykeln. Typ som en bil blinkar med varningsblinkers och låter lite blip blip när man larmar. 
3. När man försöker hitta sin cykel när man är i närheten ska den låta högt, men inte illa. Den får gärna blinka lite vackra färger också så man hittar cykeln i mörkret. 
4. När någon hyr eller lämnar tillbaka ska den blinka och låta lite diskret (men tillräckligt högt för att mikrofon och sånt ska fånga upp ljudet i Dataton).

Implementera gärna också ett sätt att aktivera larmet från servern. Typ ett funktionsanrop där man kan aktivera och deaktivera larmet. För att vi ska kunna fixa vid pitchen. 

## Till Erik & William

1. Visualisera öppen data anrop
2. Implemtera Find-My-Bike knapp
3. Knapp för att låsa och låsa upp cykel som är hyrd


## Till Erik

1. Visa kommentarer
2. Visa testimonials och cirklar a la botillsammans!


## Till William

1. Push notifiering, eller nått sätt att visa om din egen cykel blivit stulen
2. Skicka GPS koordinater för var du befinner dig. 


## Till Fredrik 

1. Fixa in vägarbeten (med regexp)
2. Låsa upp cykel när man är i närheten. DONE
3. Låsa cykel när man går bort från den. DONE
4. Fixa pitch och förbereda sånt.
5. Samla in mer data för fler cyklar. 
6. Lyssna på A-event för att veta när larmet gått. 
7. Kolla igenom så att done() anropas på rätt ställen.
8. Ta bort koordinater som är uppenbart fel.    DONE

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


GET api/bike/:id/lock

Låser cykeln, returnerar true om electronen lyckats ta emot, annars false

GET api/bike/:id/unlock

Låser upp cykeln, returnerar true om electronen lyckats ta emot, annars false


GET api/bike/:id/find

Cykeln blippar till med ett glatt ljud

/bike/:id/return/:user

Return bike ID that was rented by user USER. Return true on success otherwise false. 

/bike/:id/rent/:user

User USER rent the bike ID. Return true if success. Otherwise false. 


/api/points
Ger koordinater till Point of Interests (sammanställt det som finns nedanför)


http://138.68.129.101/api/user/1/report/58.394628,15.560919
För att rapportera koordinaten för user 1. Observera formatet på koordinaten. Kommaseparerad och inget mellanslag. 



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

