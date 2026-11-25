<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PublicDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            DB::statement('LOCK TABLE users, buildings IN SHARE ROW EXCLUSIVE MODE');

            if (User::query()->exists() || Building::query()->exists()) {
                $this->command?->info('BlockBoard already contains data. Demo seeding skipped.');

                return;
            }

            $this->call(DatabaseSeeder::class);

            $publicAccounts = [
                'lastnik@blockboard.test',
                'jan@blockboard.test',
                'breznik@blockboard.test',
            ];

            DB::table('users')->whereNotIn('email', $publicAccounts)->update([
                'password' => Hash::make(Str::random(64)),
            ]);
        });
    }
}
