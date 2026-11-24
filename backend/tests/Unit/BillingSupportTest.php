<?php

use App\Support\Dates;
use App\Support\Money;
use Carbon\CarbonImmutable;

it('premakne decembrski obračun v januar naslednjega leta', function () {
    expect(Dates::nextPeriod(CarbonImmutable::parse('2027-12-31'))->toDateString())
        ->toBe('2028-01-01');
});

it('premakne januarski obračun v februar brez preskoka meseca', function () {
    expect(Dates::nextPeriod(CarbonImmutable::parse('2027-01-31'))->toDateString())
        ->toBe('2027-02-01');
});

it('uporabi dan plačila iz nastavitev stavbe', function () {
    expect(Dates::dueDate(CarbonImmutable::parse('2027-05-18'), 8)->toDateString())
        ->toBe('2027-05-08');
});

it('omeji rok plačila na zadnji dan neprestopnega februarja', function () {
    expect(Dates::dueDate(CarbonImmutable::parse('2027-02-01'), 31)->toDateString())
        ->toBe('2027-02-28');
});

it('upošteva 29. februar pri roku plačila v prestopnem letu', function () {
    expect(Dates::dueDate(CarbonImmutable::parse('2028-02-01'), 31)->toDateString())
        ->toBe('2028-02-29');
});

it('prikaže mesec obračuna v slovenščini', function () {
    expect(Dates::period(CarbonImmutable::parse('2027-05-01')))->toBe('maj 2027');
});

it('ohrani predznak dobropisa in tisočiško ločilo', function () {
    expect(Money::format(-126005))->toBe('-1.260,05 €');
});

it('prikaže ničelno obveznost z dvema decimalkama', function () {
    expect(Money::format(0))->toBe('0,00 €');
});
