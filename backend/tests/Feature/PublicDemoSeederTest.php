<?php

use App\Models\Building;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PublicDemoSeeder;
use Illuminate\Support\Facades\Hash;

it('seeds only the three public logins with the demo password and is safe to rerun', function () {
    $this->seed(PublicDemoSeeder::class);
    $this->seed(PublicDemoSeeder::class);

    $publicLogins = User::query()->get()
        ->filter(fn (User $user) => Hash::check(DatabaseSeeder::PASSWORD, $user->password))
        ->pluck('email')->sort()->values()->all();

    expect($publicLogins)->toBe([
        'breznik@blockboard.test',
        'jan@blockboard.test',
        'lastnik@blockboard.test',
    ])->and(Building::query()->count())->toBe(1);
});

it('preserves an existing installation', function () {
    $owner = User::factory()->create();
    $originalPassword = $owner->password;

    $this->seed(PublicDemoSeeder::class);

    expect(User::query()->count())->toBe(1)
        ->and($owner->refresh()->password)->toBe($originalPassword)
        ->and(Building::query()->count())->toBe(0);
});
