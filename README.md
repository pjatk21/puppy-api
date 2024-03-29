> **Warning**
>
> Ten projekt został porzucony.
>
> Sprawdź [CaaTS](https://caats.app/), to jest prawdopodbnie to czego szukasz.


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
   - Google Calendar
 - Dodanie obsługi kont dla studentów (poprzez Google Identification Services), przechowujące informacje o:
   - Grupach studenckich
   - Prywatnych scraperach
 - *GraphQL over WS* jako protokół komunikacji dla scraperów
 - <small>szczeniaczki</small> 🐾 🐶 🥺

<details>
  <summary>Bardziej szczegółowe zmiany</summary>

  #### Baza danych
  W Altapi wykorzystywana była biblioteka `mongoose` (wraz z MongoDB). Zostanie ona zastąpiona przez ORM [Prisma](https://www.prisma.io/) wraz z Postgres.

  #### Scrapery
  Altapi było pozbawione jakiejkolwiek autentykacji czy autoryzacji. Scrapery były wewnątrz zaufanej sieci i całe dostarczanie danych było oparte wyłącznie o zaufanie. Tym razem każdy scraper będzie miał przypisanego właściciela.

  #### Konwencje
  Poprzedni projekt całkowicie był napisany w konwencji *code first*. W tym projekcie jednak została zastosowana konwencja *schema first*, ponieważ brak dobrego *type reflection* w TypeScript utrudnia pracę na dłuższą metę.

  Również tym razem ESLint będzie miał surowsze zasady związane z pisaniem *type safe* kodu.

  #### Runtime
  Mimo, że NestJS, framework który został wykorzystany do tworzenia aplikacji, wykorzystuje domyślnie CommonJS, w tym projekcie wszystko wykorzystuje ES Modules oraz targetuje w najnowsze wersje Node'a.

  #### WASI/WASM (feat. Rust)
  W stabilnej fazie projektu zostaną zaimplementowane moduły WASI/WASM obsługę parsowania HTML'a zapewniające otrzymanego z scrapera.

  #### SSR (feat. Vite)
  W tym projekcie zostanie zaimplementowana obsługa SSR dla *landing page*. Aplikacja do planu zajęć pozostanie jako SPA.

</details>

## Uruchamianie

### Pierwszwe uruchomienie oraz aktualizacje

```bash
git clone https://github.com/pjatk21/puppy-api puppy && cd puppy
cp docker/examples/.*.env .
# tutaj uzupełnij swoje klucze
docker-compose pull
docker-compose up -d database
docker-compose run --rm api yarn prisma migrate deploy
```

### Uruchamianie aplikacji

```bash
docker-compose up -d
```

### Podłączanie scraperów

```
docker run --rm -d -e PUPPY_GATEWAY="https://puppy.kpostek.dev" -e SCRAPER_TOKEN="<token scrapera>" ghcr.io/pjatk21/puppy-scrapy
```
