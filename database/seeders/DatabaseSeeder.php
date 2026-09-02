<?php

use App\Enums\Gender;
use App\Enums\Status;
use App\Models\Example1;
use App\Models\Example2;
use App\Models\Example3;
use App\Models\Example4;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Example1::factory()->createMany([
            [
                'name' => 'Alex Rivera',
                'email' => 'alex.rivera@example.com',
                'phone' => '+1 555-0101',
                'department' => 'Engineering',
                'position' => 'Software Engineer',
                'join_date' => '2022-03-15',
                'gender' => Gender::Male,
                'status' => Status::Active,
            ],
            [
                'name' => 'Jordan Lee',
                'email' => 'jordan.lee@example.com',
                'phone' => '+1 555-0102',
                'department' => 'Marketing',
                'position' => 'Campaign Manager',
                'join_date' => '2021-08-01',
                'gender' => Gender::Female,
                'status' => Status::Active,
            ],
            [
                'name' => 'Sam Taylor',
                'email' => 'sam.taylor@example.com',
                'phone' => '+1 555-0103',
                'department' => 'Operations',
                'position' => 'Operations Lead',
                'join_date' => '2020-11-20',
                'gender' => Gender::Other,
                'status' => Status::Inactive,
            ],
        ]);

        Example2::factory()->createMany([
            [
                'name' => 'Casey Morgan',
                'email' => 'casey.morgan@example.com',
                'phone' => '+1 555-0201',
                'department' => 'Finance',
                'position' => 'Financial Analyst',
                'join_date' => '2023-01-10',
                'gender' => Gender::Female,
                'status' => Status::Active,
            ],
            [
                'name' => 'Riley Chen',
                'email' => 'riley.chen@example.com',
                'phone' => '+1 555-0202',
                'department' => 'Engineering',
                'position' => 'QA Engineer',
                'join_date' => '2022-06-22',
                'gender' => Gender::Male,
                'status' => Status::Active,
            ],
            [
                'name' => 'Taylor Brooks',
                'email' => 'taylor.brooks@example.com',
                'phone' => '+1 555-0203',
                'department' => 'Marketing',
                'position' => 'Content Strategist',
                'join_date' => '2019-04-05',
                'gender' => Gender::Other,
                'status' => Status::Inactive,
            ],
        ]);

        Example3::factory()->createMany([
            [
                'name' => 'Morgan Patel',
                'email' => 'morgan.patel@example.com',
                'phone' => '+1 555-0301',
                'department' => 'Operations',
                'position' => 'Logistics Coordinator',
                'join_date' => '2024-02-14',
                'gender' => Gender::Male,
                'status' => Status::Active,
            ],
            [
                'name' => 'Jamie Wright',
                'email' => 'jamie.wright@example.com',
                'phone' => '+1 555-0302',
                'department' => 'Engineering',
                'position' => 'DevOps Engineer',
                'join_date' => '2021-12-03',
                'gender' => Gender::Female,
                'status' => Status::Active,
            ],
            [
                'name' => 'Quinn Adams',
                'email' => 'quinn.adams@example.com',
                'phone' => '+1 555-0303',
                'department' => 'Finance',
                'position' => 'Accountant',
                'join_date' => '2018-09-18',
                'gender' => Gender::Other,
                'status' => Status::Inactive,
            ],
        ]);

        Example4::factory()->createMany([
            [
                'name' => 'Drew Martinez',
                'email' => 'drew.martinez@example.com',
                'phone' => '+1 555-0401',
                'department' => 'Engineering',
                'position' => 'Frontend Developer',
                'join_date' => '2023-07-01',
                'gender' => Gender::Male,
                'status' => Status::Active,
            ],
            [
                'name' => 'Avery Kim',
                'email' => 'avery.kim@example.com',
                'phone' => '+1 555-0402',
                'department' => 'Marketing',
                'position' => 'Brand Manager',
                'join_date' => '2022-02-18',
                'gender' => Gender::Female,
                'status' => Status::Active,
            ],
            [
                'name' => 'Reese Nguyen',
                'email' => 'reese.nguyen@example.com',
                'phone' => '+1 555-0403',
                'department' => 'Operations',
                'position' => 'Project Coordinator',
                'join_date' => '2020-05-12',
                'gender' => Gender::Other,
                'status' => Status::Inactive,
            ],
        ]);
    }
}
