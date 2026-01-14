# Projekt "Cozy Cat Intranet" (DT193G)

Den här delen av projektet är ett API skapat med ramverket Hapi.js. API:et innehåller routes för full CRUD-funktionalitet för produkter, produktkategorier och användare för det fiktiva företaget Cozy Cats intranät. Det innehåller även routes för inloggning och registrering. 

Lösningen för det här projektet utgörs av två delar:

* REST API: Presenteras i detta repository
* Användargrässnitt: **[Användargränssnitt](https://github.com/gustafsson96/project-dt193g-frontend.git)** 

Länk till den publicerade webbtjänsten: **[API](https://project-dt193g-backend.onrender.com/)**

## Funktionalitet
* **Hapi.js:** API:et är skapat med ramverket Hapi.js och körs med en Hapi-server. 
* **JWT:** Autentisering med JWT
* **Password hasing:** Hasha lösenord med bcrypt
* **CRUD produkter:** Routes för full CRUD för produkter
* **CRUD produktkategorier:** Routes för full CRUD för produktkategorier
* **CRUD användare:** Routes för full CRUD för användare
* **Skyddade routes:** Alla routes förutom inloggning och registrering kräver autentisering med jwt
* **PostgreSQL:** Data lagras i en Postgres-databas. 

## API Endpoints

| Metod | Endpoint | Beskrivning | Skyddad med JWT |
|-------|----------|-------------|----------------|
| GET | / | Presenterar ett välkomstmeddelande. | Nej |
| POST | /signup | Registrerar nya användare. Lösenord hashas med bcrypt innan de lagras i databasen. | Nej |
| POST | /login | Autentiserar en användare baserat på användarnamn och lösenord och returnerar ett JWT-token. | Nej |
| GET | /categories | Hämtar alla lagrade kategorier. | Ja |
| POST | /categories | Skapar en ny kategori. | Ja |
| PUT | /categories/{id} | Uppdaterar en befintlig kategori baserat på id. | Ja |
| DELETE | /categories/{id} | Raderar en kategori baserat på id. | Ja |
| GET | /products | Hämtar alla lagrade produkter. Har stöd för filtrering baserat på kategori. | Ja |
| POST | /products | Skapar en ny produkt. | Ja |
| PUT | /products/{id} | Uppdaterar en befintlig produkt baserat på id. | Ja |
| PATCH | /products/{id}/amount | Uppdaterar lagersaldo för en befintlig produkt baserat på id. | Ja |
| DELETE | /products/{id} | Raderar en produkt baserat på id. | Ja |
| GET | /users | Hämtar samtliga användare. | Ja |
| POST | /users | Skapar en ny användare. | Ja |
| PUT | /users/{id} | Uppdaterar en befintlig användare baserat på id. | Ja |
| DELETE | /users/{id} | Raderar en användare baserat på id. | Ja |

## Lokal installation

1. Klona projektet: git clone https://github.com/gustafsson96/project-dt193g-backend.git 
2. Navigera projektmappen: cd projekt-namn
3. Installera npm-paket: npm install
4. Skapa en lokal PostgreSQL-databas med namnet: intern_app_db
5. Skapa en .env-fil i projektets rotmapp och lägg till följande variabel: JWT_SECRET=hemlig_nyckel_här
6. Kör installationsskriptet för att skapa nödvändiga tabeller i databasen: node install.js
7. Starta Hapi-servern: npm run start

## Publicering

API:et har publicerats till Render via följande steg: 
1. Gå in på https://render.com och logga in via GitHub. 
2. Klicka på "New" och välj "Web Service".
3. Sök efter Github-repositoryt för API:et. 
4. Fyll i ett namn för web servicen. 
5. Säkerställ att fälten är ifyllda enligt följande:
    * Language: Node
    * Branch: main
    * Build Command: npm install
    * Start Command: node server.js
6. För Instance Type, välj "Free". 
7. Lägg till Environment Variables för databasanslutning och JWT.
8. Klicka på "Deploy Web Service". 