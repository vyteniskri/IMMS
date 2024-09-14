•	**Projekto pavadinimas**.

Internetinė moksleivių mokymosi svetainė.

•	**Sistemos paskirtis**.

Ši sistema suteiks moksleiviams galimybę internete spręsti mokytojų įkeltą mokomąją medžiagą. Mokinys galės pasirinkti mokymosi temą, tos temos konkrečią užduotį ir rašyti komentarus į bendrą komentarų sekciją skirtą klausimams ir atsakymams. Į komentarus galės atsakinėti mokytojai ir kiti moksleiviai. 

•	**Funkciniai reikalavimai**.

1.	Taikomosios srities objektai ir jų hierarchinis ryšys.

    Tema -> užduotis -> komentaras.

2.	API metodai.

    Tema.

      o	GET /api/temos: Gauti visų temų sąrašą.

      o	POST /api/temos: Sukurti naują temą.

      o	GET /api/temos/{id}: Gauti konkrečią temą pagal ID.

      o	PUT /api/temos/{id}: Atnaujinti esamą temą.

      o	DELETE /api/temos/{id}: Ištrinti temą.

    Užduotis.
  	
    o	GET /api/uzduotys: Gauti visų užduočių sąrašą.
  	
    o	POST /api/uzduotys: Sukurti naują užduotį.
  	
    o	GET /api/uzduotys/{id}: Gauti konkrečią užduotį pagal ID.
  	
    o	PUT /api/uzduotys/{id}: Atnaujinti esamą užduotį.
  	
    o	DELETE /api/uzduotys/{id}: Ištrinti užduotį.
  	
    Komentaras
  	
    o	GET /api/komentarai: Gauti visų komentarų sąrašą.
  	
    o	POST /api/komentarai: Sukurti naują komentarą.
  	
    o	GET /api/komentarai/{id}: Gauti konkretų komentarą pagal ID.
  	
    o	PUT /api/komentarai/{id}: Atnaujinti esamą komentarą.
  	
    o	DELETE /api/komentarai/{id}: Ištrinti komentarą.

4.	Hierarchinis API metodas.

    GET /api/temos/{id}/uzduotys: Gauti visų konkrečios temos užduočių sąrašą.

5.	Rolės.

    o	Svečias: gali peržiūrėti temas ir užduotis, bet negali jų komentuoti.

    o	Moksleivis: gali peržiūrėti temas ir užduotis bei jas komentuoti.

    o	Mokytojas: gali peržiūrėti, kurti, redaguoti, trinti temas ir užduotis bei jas komentuoti.

    o	Administratorius: turi visas teisias. Gali kurti, redaguoti, trinti temas ir užduotis bei valdyti vartotojų paskyras.

•	**Pasirinktų technologijų aprašymas**.

Front-end: JavaScript ir React.js.

Back-end: Node.js su Express ir PostgreSQL duomenų bazė.

