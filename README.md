# BlockBoard

[![CI/CD](https://github.com/JakaM1/block-board/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/JakaM1/block-board/actions/workflows/ci-cd.yml)

[Javni demo na Renderju](https://blockboard-jakam1.onrender.com)

BlockBoard je spletna aplikacija za vodenje najemniške stavbe, v kateri ima vsa stanovanja en lastnik. Na enem mestu vodi celotno najemno razmerje, od vselitve do vračila varščine:

- najeme z življenjskim ciklom in več sostanovalci,
- mesečne obveznosti in delitev položnic po dnevih bivanja,
- rezervacije skupnih prostorov brez prekrivanja,
- primopredajne zapisnike s primerjavo stanja ob vselitvi in izselitvi,
- obračun varščine z odbitki, vezanimi na razlike v zapisniku,
- prijave okvar s pravilom plačnika in dodelitvijo izvajalcu.

Aplikacijo uporabljajo tri vloge: **lastnik stavbe**, **najemnik** in **izvajalec del**.

## Uporabljene tehnologije

| Področje | Tehnologije |
| --- | --- |
| Frontend | Vue 3.5, TypeScript, Vite 8, Vue Router 5, Pinia, Tailwind CSS, Axios |
| Backend | PHP 8.4, Laravel 13, Eloquent ORM, Laravel Queue, Laravel Scheduler |
| Podatkovna baza | PostgreSQL 18 |
| Avtentikacija | Laravel Sanctum (sejni piškotki), Laravel Policies |
| Lokalni razvoj | Docker, Docker Compose, Mailpit, Git |
| Testiranje | Pest, Vitest |

## Dokumentacija

Dokumentacija je v direktoriju [docs/](docs/):

1. [Zasnova rešitve](docs/01-zasnova-resitve.md)
2. [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
3. [Podatkovni model](docs/03-podatkovni-model.md)
4. [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
5. [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
6. [Wireframes](docs/06-wireframes.md)
7. [Pregled prevzetega projekta](docs/07-pregled-projekta.md)

### Arhitekturne odločitve (ADR)

Arhitekturne odločitve so zapisane v [docs/adr/](docs/adr/) po minimalni predlogi [MADR](https://github.com/adr/madr/blob/develop/template/adr-template-minimal.md) ([adr-template.md](docs/adr/adr-template.md)).

| ADR | Odločitev |
| --- | --- |
| [0001](docs/adr/0001-locena-spa-in-rest-api.md) | Ločena Vue SPA in REST API |
| [0002](docs/adr/0002-laravel-kot-zaledno-ogrodje.md) | Laravel kot zaledno ogrodje |
| [0003](docs/adr/0003-postgresql-kot-podatkovna-baza.md) | PostgreSQL kot podatkovna baza |
| [0004](docs/adr/0004-avtentikacija-s-sejnim-piskotkom.md) | Avtentikacija s sejnim piškotkom |
| [0005](docs/adr/0005-vloga-vezana-na-clanstvo-v-stavbi.md) | Vloga vezana na članstvo v stavbi |
| [0006](docs/adr/0006-namenske-koncne-tocke-za-prehode-stanj.md) | Namenske končne točke za prehode stanj |
| [0007](docs/adr/0007-poslovna-logika-v-storitvenih-razredih.md) | Poslovna logika v storitvenih razredih |
| [0008](docs/adr/0008-lokalno-okolje-z-docker-compose.md) | Lokalno okolje z Docker Compose |

Nove pomembne odločitve se dodajo kot nov ADR z naslednjo številko. Če se sprejeta odločitev spremeni, nastane nov ADR, ki v kontekstu navede, katerega nadomešča (na primer »Nadomešča [ADR-0003](docs/adr/0003-postgresql-kot-podatkovna-baza.md)«), v starem ADR pa se pod naslov doda opomba »Nadomeščeno z ADR-XXXX«.

## Lokalni zagon

Za zagon potrebujete samo [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ali Docker Engine z Docker Compose). PHP, Composer, Node in PostgreSQL se zaženejo v vsebnikih.

```bash
git clone https://github.com/klemencic/block-board.git
cd block-board

cp backend/.env.example backend/.env
docker compose build api
docker compose run --rm api composer install
docker compose up -d
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate --seed
```

Storitvi `api` in `worker` uporabljata isto PHP sliko, zato jo zgradimo enkrat. Prvi zagon traja nekaj minut, ker se prenesejo slike in odvisnosti. Storitev `web` ob zagonu sama izvede `npm install`, napredek pa lahko spremljate z `docker compose logs -f web`.

| Naslov | Vsebina |
| --- | --- |
| http://localhost:5173 | Aplikacija (Vue SPA) |
| http://localhost:8000 | Laravel API |
| http://localhost:8025 | Mailpit – vsa poslana e-pošta |

### Demo računi

Vsi računi imajo geslo `geslo123`.

| Vloga | E-naslov |
| --- | --- |
| Lastnik stavbe | `lastnik@blockboard.test` |
| Najemnik (stanovanje 2C) | `jan@blockboard.test` |
| Izvajalec del | `breznik@blockboard.test` |

Demo stavba »Stavba Lipa« ustreza wireframom: 10 od 12 stanovanj je zasedenih, zamude znašajo 960,00 €, odprte so 4 prijave okvar (»Bojler ne greje vode« v 2C čaka na potrditev), v koledarju so rezervacije skupne sobe, objavljeni sta dve obvestili. Drugi najemniki imajo e-naslove oblike `ime@blockboard.test` (npr. `nik@`, `sara@`, `maja@`, `marko@`), izvajalec elektrike pa `hribar@blockboard.test`.

### Implementirane funkcionalnosti (MVP)

| Funkcionalnost | Zgodbe | Kje v aplikaciji |
| --- | --- | --- |
| F1 Najem z življenjskim ciklom | US-01, US-02 | Lastnik: *Najemi* (nov najem, aktivacija). Najemnik: *Moj najem* (odpoved s potrditvijo vseh sostanovalcev). |
| F2 Mesečne obveznosti | US-03, US-04, US-05 | Samodejno ustvarjanje najemnin (`charges:generate`), najemnik: *Moje obveznosti*, lastnik: *Obveznosti* (plačila, dobropisi, filtri). |
| F3 Delitev položnic | US-06, US-07 | Lastnik: *Položnice* (predogled deležev po dnevih bivanja, delitev stavbe po površini, osebah ali na enake dele). |
| F4 Rezervacija skupnih prostorov | US-08 | *Skupni prostori* (tedenski koledar, tedenska omejitev stanovanja, cena v naslednjem obračunu). |
| F7 Prijave okvar s pravilom plačnika | US-09 – US-12 | *Okvare* / *Prijave okvar* / *Moji nalogi* (prijava s fotografijami, potrditev in dodelitev, termin in poročilo izvajalca, zaključek z obračunom). |
| F8 Pregled stavbe | US-13 | Lastnik: *Pregled stavbe* (zasedenost, zamude, okvare, najemi, ki se iztekajo). |
| F9 Novice in obvestila | US-14, US-15 | *Obvestila* (objava za stavbo ali nadstropje, potrditev branja, obveščenost stanovanj). |

Vsa e-pošta (povabila, odpovedi, mesečni povzetki, okvare, obvestila) se pošlje prek vrste opravil v storitvi `worker` in je vidna v Mailpit na http://localhost:8025. Časovno vodena opravila (`leases:end-due`, `charges:generate`) poganja razporejevalnik v isti storitvi, ročno pa jih zaženete z `docker compose exec api php artisan charges:generate`.

### Pogosti ukazi

```bash
docker compose exec api php artisan migrate:fresh --seed   # ponastavi bazo in demo podatke
docker compose exec api vendor/bin/pest                    # testi backenda (Pest)
docker compose exec web npm test                           # testi frontenda (Vitest)
docker compose logs -f worker                              # vrsta opravil in razporejevalnik
docker compose down                                        # ustavi vse storitve
```

Testi backenda uporabljajo ločeno bazo `blockboard_test`, ki se ustvari ob prvem zagonu storitve `db`.

## Razvojni proces

Veja `main` je zaščitena. Spremembe se razvijajo na ločenih vejah in se v `main` združijo prek pull requesta. Prisilno prepisovanje zgodovine in brisanje veje `main` nista dovoljena.

## CI/CD

Workflow se sproži ob pull requestu v `main` in ob pushu na `main`. Za združitev so obvezna opravila `lint`, `build` in `test`.

| Opravilo | Kaj izvede |
| --- | --- |
| `lint` | Preveri Vue in TypeScript z ESLint ter PHP z Laravel Pint. |
| `build` | Zgradi Vue in zapakira Laravel z odvisnostmi v Docker sliko. Po poskusnem zagonu s PostgreSQL shrani sliko v artefakt `blockboard-image`. Gradnje ponovno uporabijo predpomnjene Docker plasti. |
| `test` | Zažene Vitest in Pest s testno bazo PostgreSQL. Poročili o pokritosti shrani v artefakt `coverage`. Namestitvi odvisnosti uporabljata predpomnilnika npm in Composer. |
| `deploy` | Samo ob pushu na `main` po uspešnih preverjanjih prenese artefakt `blockboard-image`, ga objavi v GHCR in Renderju posreduje digest slike. Po stanju `live` preveri javni naslov in ga objavi v [okolju production](https://github.com/JakaM1/block-board/deployments/production). |

### Nastavitev Render

Javni demo teče v Frankfurtu na brezplačni spletni storitvi in brezplačni bazi PostgreSQL. Baza poteče po 30 dneh. Po mirovanju lahko prvi dostop traja dlje, fotografije pa se ob ponovni namestitvi ne ohranijo. Pošiljanje e-pošte je nastavljeno na dnevnik aplikacije. [Omejitve brezplačnega paketa](https://render.com/docs/free)

1. Po prvi združitvi v `main` opravilo `deploy` objavi sliko `ghcr.io/jakam1/block-board:<SHA>`. Ustvari Render PostgreSQL in **Web Service** v isti regiji. Pri spletni storitvi izberi **Existing Image** in uporabi URL te slike. Nastavi zdravstveni pregled na `/up`. [Predpripravljene slike na Renderju](https://render.com/docs/deploying-an-image)
2. Na plačljivem paketu lahko priklopiš trajni disk na `/var/www/backend/storage/app/private`, da se fotografije ohranijo ob ponovni namestitvi. Apache, delavec vrste in razporejevalnik tečejo v istem vsebniku. [Trajni diski](https://render.com/docs/disks)
3. V Renderju nastavi okoljske spremenljivke iz spodnje tabele. Aplikacija ob zagonu izvede migracije. Za prijavo v novi bazi pripravi podatke o stavbi in lastniški račun s svojim geslom. Lokalni demo računi imajo javno znano geslo in so namenjeni lokalnemu zagonu.
4. V okolju `production` v forku dodaj skrivnost `RENDER_API_KEY` in spremenljivko `RENDER_SERVICE_ID` z identifikatorjem spletne storitve (`srv-…`). Ključ potrebuje dostop za branje konfiguracije spletne storitve ter zagon in spremljanje namestitev. Po nastavitvi ponovno zaženi neuspešno opravilo `deploy` ali združi naslednji pull request. [Pravice ključa API](https://render.com/docs/api-keys#permissions)

Vue se zgradi z `VITE_API_URL=/`. Apache na istem javnem izvoru postreže Vue in posreduje zahteve Laravelu. Tako Sanctum uporablja sejne piškotke na isti domeni.

| Spremenljivke na Renderju | Vrednosti |
| --- | --- |
| `PORT` | `10000` |
| `APP_KEY` | Stabilen ključ Laravel, ustvarjen z `php artisan key:generate --show`. |
| `APP_URL`, `FRONTEND_URL` | Javni naslov storitve HTTPS, npr. `https://blockboard.onrender.com`. |
| `SANCTUM_STATEFUL_DOMAINS`, `SESSION_SECURE_COOKIE` | Javna domena brez `https://`, npr. `blockboard.onrender.com`, ter `true`. |
| `APP_NAME`, `APP_LOCALE`, `APP_TIMEZONE` | `BlockBoard`, `sl`, `Europe/Ljubljana`. |
| `DB_CONNECTION`, `DB_URL` | `pgsql` ter interni povezovalni URL baze PostgreSQL. |
| `SESSION_DRIVER`, `QUEUE_CONNECTION`, `CACHE_STORE` | `database` za vse tri. |
| `MAIL_MAILER` | `log` za demo. Za pošiljanje povabil in obvestil nastavi `smtp` ter podatke ponudnika v `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` in `MAIL_FROM_ADDRESS`. |

## Struktura repozitorija

```text
block-board/
  frontend/            Vue SPA (Vite, TypeScript, Tailwind)
  backend/             Laravel API (Sanctum, Pest)
  docker/              Dockerfile za PHP in začetni skript baze
  docs/                dokumentacija, wireframes in ADR
  docker-compose.yml   storitve api, worker, db, web in mail
```
