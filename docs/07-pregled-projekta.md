# 07 – Pregled prevzetega projekta BlockBoard

Pregled izhaja iz izvorne veje `main` pri commitu `4c3d68c`. Vue SPA komunicira z Laravel REST API-jem prek sejnih piškotkov Sanctum. Pravice izhajajo iz članstva v stavbi. Prehode stanj obravnavajo namenske končne točke in storitveni razredi, kritične omejitve, kot je prepoved prekrivanja rezervacij, pa uveljavlja tudi PostgreSQL. [Arhitektura](04-arhitektura-in-tehnoloski-sklad.md) in [arhitekturne odločitve](adr/)

## Implementirano za MVP

| Funkcionalnost | Kaj je na voljo |
| --- | --- |
| F1 – Najemi | Osnutki z deleži sostanovalcev, povabila, aktivacija, skupna potrditev odpovedi in samodejni zaključek ob izteku. |
| F2 – Mesečne obveznosti | Samodejni obračun najemnine, mesečni povzetki, pregled in izvor obveznosti ter evidentiranje plačil, zamud in dobropisov. |
| F3 – Položnice | Delitev s predogledom po dnevih bivanja. Položnice stavbe se razdelijo po površini, osebah ali na enake dele. |
| F4 – Skupni prostori | Tedenski koledar, rezervacije brez prekrivanja, tedenska omejitev stanovanja in obračun rezervacije. |
| F7 – Okvare | Prijava s fotografijami, določitev plačnika, dodelitev izvajalcu, termin, poročilo, zaključek in obračun stroška. |
| F8 – Pregled stavbe | Zasedenost stanovanj, zamude pri plačilih, odprte okvare in iztek najemov. |
| F9 – Obvestila | Objave za stavbo ali nadstropje, potrditev branja in pregled obveščenosti po stanovanjih. |

Primopredajni zapisniki (F5) in obračun varščine (F6) sta predvidena za naslednjo različico. Pri najemu se znesek varščine že beleži. [Obseg funkcionalnosti](02-funkcionalnosti-in-obseg.md)

## Pregled petih uporabniških zgodb

Izbrane zgodbe in merila izhajajo iz [specifikacije](05-uporabniske-zgodbe.md).

| Zgodba | Ocena in ugotovitve |
| --- | --- |
| **US-01 – Ustvarjanje in aktivacija najema** | **Zadošča.** Obvezna polja in vsota deležev se preverijo, najem se najprej shrani kot osnutek, povabilo za novega uporabnika pa velja sedem dni. Aktivacija spremeni zasedenost stanovanja. Ob obstoječem aktivnem najemu ali najemu v odpovednem roku se prikaže povezava do njega. [Ustvarjanje](../backend/tests/Feature/Leases/CreateLeaseTest.php), [povabilo](../backend/tests/Feature/Leases/TenantInvitationTest.php), [aktivacija](../backend/tests/Feature/Leases/ActivateLeaseTest.php) |
| **US-06 – Delitev položnice stanovanja** | **Zadošča.** Predogled upošteva dneve bivanja, vključno z dnevoma vselitve in izselitve. Delitev je natančna do centa, znesek za prazno stanovanje krije lastnik, shranjevanje položnice in obveznosti za naslednji mesec pa je transakcijsko. [Testi delitve](../backend/tests/Feature/Bills/ApartmentBillTest.php) |
| **US-08 – Rezervacija skupnega prostora** | **Zadošča.** Tedenski koledar skrije imena drugih najemnikov. Sistem preveri polurne termine, obratovalni čas in tedensko omejitev vseh sostanovalcev, PostgreSQL pa prepreči hkratno rezervacijo istega termina. Plačljiv termin se zaračuna naslednji mesec, pri brezplačnem obveznost ne nastane. [Testi rezervacij](../backend/tests/Feature/Bookings/BookingTest.php) |
| **US-09 – Prijava okvare** | **Delno zadošča pri dobesednem branju meril.** Prijava podpira obvezna polja, do pet fotografij JPG ali PNG do 10 MB, prikaz privzetega plačnika, e-pošto lastniku ter časovnico z avtorjem in časom. Lokacijo v svojem stanovanju lahko izbere tudi najemnik v odpovednem roku, medtem ko merilo izrecno navaja aktiven najem. [Validacija](../backend/app/Http/Requests/StoreRepairRequest.php), [testi prijav](../backend/tests/Feature/Repairs/ReportRepairTest.php) |
| **US-15 – Pregled obveščenosti stanovanj** | **Zadošča.** Ponovna potrditev branja ne podvoji zapisa. Za obveščeno stanovanje zadošča en najemnik. Lastnik vidi seznam stanovanj brez potrditve z imeni in telefoni najemnikov. Obseg vključuje samo zasedena stanovanja med naslovniki. [Testi obveščenosti](../backend/tests/Feature/Announcements/AnnouncementReadTest.php) |

## Lokalno preverjanje

Aplikacijo sem zagnal z Node.js 24, PHP 8.4 in PostgreSQL 17 s svežo bazo in demo podatki. Prek Vue razvojnega strežnika sem preveril sejno prijavo vseh treh vlog ter dostop do pregleda stavbe za lastnika, do najema za najemnika in do dodeljenih okvar za izvajalca. V ločeni testni bazi je uspelo 170 testov Pest, na frontendu pa 21 testov Vitest.
