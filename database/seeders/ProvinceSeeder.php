<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Province;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(CountrySeeder::class);

        $country = Country::query()->where('code', 'ID')->firstOrFail();

        foreach ($this->provinces() as $name) {
            Province::query()->firstOrCreate([
                'country_id' => $country->id,
                'name' => $name,
            ]);
        }
    }

    /**
     * @return list<string>
     */
    private function provinces(): array
    {
        return [
            'Aceh',
            'Sumatera Utara',
            'Sumatera Barat',
            'Riau',
            'Jambi',
            'Sumatera Selatan',
            'Bengkulu',
            'Lampung',
            'Kepulauan Bangka Belitung',
            'Kepulauan Riau',
            'DKI Jakarta',
            'Jawa Barat',
            'Jawa Tengah',
            'DI Yogyakarta',
            'Jawa Timur',
            'Banten',
            'Bali',
            'Nusa Tenggara Barat',
            'Nusa Tenggara Timur',
            'Kalimantan Barat',
            'Kalimantan Tengah',
            'Kalimantan Selatan',
            'Kalimantan Timur',
            'Kalimantan Utara',
            'Sulawesi Utara',
            'Sulawesi Tengah',
            'Sulawesi Selatan',
            'Sulawesi Tenggara',
            'Gorontalo',
            'Sulawesi Barat',
            'Maluku',
            'Maluku Utara',
            'Papua',
            'Papua Barat',
            'Papua Selatan',
            'Papua Tengah',
            'Papua Pegunungan',
            'Papua Barat Daya',
        ];
    }
}
