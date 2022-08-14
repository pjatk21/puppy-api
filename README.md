# Puppy
GraphQL/~~REST~~ API dla wszystkich studentów PJATK.

## Dlaczego?
Mimo faktu, że Altapi stanowiło przełom jako usługa do planu zajęć, nie spełnia moich wysokich oczekiwań.

Puppy adresuje problemy związane z [Altapi](https://github.com/pjatk21/altapi)
 - Brak obsługi "rezerwacji"
 - Monolityczna aplikacja reactowa
 - Problematyczny protokół scrapowania
 - Brak obsługi kont dla studentów
 - Słaba jakość dokumentacji w OpenAPI

### Główne zmiany
 - Pełne wsparcie dla wszystkich wydarzeń z planu zajęć
 - Plan zajęć będzie dostępny jako:
   - GraphQL API (`/graphql`)
   - REST API (`/rest/v1`)
   - ICS (`/ics`)
 - Dodanie obsługi kont dla studentów (poprzez Google Identification Services), przechowujące informacje o:
   - Grupach studenckich
   - Prywatnych scrapperach
 - *GraphQL over WS* jako protokół komunikacji dla scrapperów
 - <small>szczeniaczki</small> 🐾 🐶 🥺

<details>
  <summary>Bardziej szczegółowe zmiany</summary>

  #### Baza danych
  W Altapi wykorzystywana była biblioteka `mongoose` (wraz z MongoDB). Zostanie ona zastąpiona przez ORM [Prisma](https://www.prisma.io/) wraz z Postgres.

  #### Scrappery
  Altapi było pozbawione jakiejkolwiek autentykacji czy autoryzacji. Scrappery były wewnątrz zaufanej sieci i całe dostarczanie danych było oparte wyłącznie o zaufanie. Tym razem każdy scrapper będzie miał przypisanego właściciela.

  #### Konwencje
  Poprzedni projekt całkowicie był napisany w konwencji *code first*. W tym projekcie jednak została zastosowana konwencja *schema first*, ponieważ brak dobrego *type reflection* w TypeScript utrudnia pracę na dłuższą metę.

  Również tym razem ESLint będzie miał surowsze zasady związane z pisaniem *type safe* kodu.

  #### Runtime
  Mimo, że NestJS, framework który został wykorzystany do tworzenia aplikacji, wykorzystuje domyślnie CommonJS, w tym projekcie wszystko wykorzystuje ES Modules oraz targetuje w najnowsze wersje Node'a.

  #### WASI/WASM (feat. Rust)
  W stabilnej fazie projektu zostaną zaimplementowane moduły WASI/WASM obsługę parsowania HTML'a otrzymanego z scrappera.

  #### SSR (feat. Vite)
  W tym projekcie zostanie zaimplementowana obsługa SSR dla *landing page*. Aplikacja do planu zajęć pozostanie jako SPA.

</details>
