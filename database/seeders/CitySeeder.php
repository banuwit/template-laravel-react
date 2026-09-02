<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\Province;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use RuntimeException;

class CitySeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call(ProvinceSeeder::class);

        $country = Country::query()->where('code', 'ID')->firstOrFail();
        $provinceIds = Province::query()
            ->where('country_id', $country->id)
            ->pluck('id', 'name');

        foreach ($this->cities() as $provinceName => $cityNames) {
            $provinceId = $provinceIds[$provinceName] ?? throw new RuntimeException("Province [{$provinceName}] was not found.");

            foreach ($cityNames as $name) {
                City::query()->firstOrCreate([
                    'province_id' => $provinceId,
                    'name' => $name,
                ]);
            }
        }
    }

    /**
     * @return array<string, list<string>>
     */
    private function cities(): array
    {
        return [
            'Aceh' => ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam'],
            'Sumatera Utara' => ['Medan', 'Binjai', 'Pematangsiantar', 'Tanjungbalai', 'Sibolga', 'Tebing Tinggi', 'Padangsidimpuan', 'Gunungsitoli'],
            'Sumatera Barat' => ['Padang', 'Bukittinggi', 'Padang Panjang', 'Payakumbuh', 'Solok', 'Sawahlunto', 'Pariaman'],
            'Riau' => ['Pekanbaru', 'Dumai'],
            'Jambi' => ['Jambi', 'Sungai Penuh'],
            'Sumatera Selatan' => ['Palembang', 'Prabumulih', 'Pagar Alam', 'Lubuklinggau'],
            'Bengkulu' => ['Bengkulu'],
            'Lampung' => ['Bandar Lampung', 'Metro'],
            'Kepulauan Bangka Belitung' => ['Pangkalpinang'],
            'Kepulauan Riau' => ['Batam', 'Tanjung Pinang'],
            'DKI Jakarta' => ['Jakarta'],
            'Jawa Barat' => ['Bandung', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya', 'Banjar'],
            'Jawa Tengah' => ['Semarang', 'Surakarta', 'Magelang', 'Pekalongan', 'Salatiga', 'Tegal', 'Purwokerto'],
            'DI Yogyakarta' => ['Yogyakarta'],
            'Jawa Timur' => ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Mojokerto', 'Madiun', 'Pasuruan', 'Probolinggo', 'Batu'],
            'Banten' => ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon'],
            'Bali' => ['Denpasar'],
            'Nusa Tenggara Barat' => ['Mataram', 'Bima'],
            'Nusa Tenggara Timur' => ['Kupang'],
            'Kalimantan Barat' => ['Pontianak', 'Singkawang'],
            'Kalimantan Tengah' => ['Palangka Raya'],
            'Kalimantan Selatan' => ['Banjarmasin', 'Banjarbaru'],
            'Kalimantan Timur' => ['Samarinda', 'Balikpapan', 'Bontang'],
            'Kalimantan Utara' => ['Tarakan'],
            'Sulawesi Utara' => ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu'],
            'Sulawesi Tengah' => ['Palu'],
            'Sulawesi Selatan' => ['Makassar', 'Parepare', 'Palopo'],
            'Sulawesi Tenggara' => ['Kendari', 'Baubau'],
            'Gorontalo' => ['Gorontalo'],
            'Sulawesi Barat' => ['Mamuju'],
            'Maluku' => ['Ambon', 'Tual'],
            'Maluku Utara' => ['Ternate', 'Tidore Kepulauan'],
            'Papua' => ['Jayapura'],
            'Papua Barat' => ['Manokwari'],
            'Papua Selatan' => ['Merauke'],
            'Papua Tengah' => ['Nabire'],
            'Papua Pegunungan' => ['Wamena'],
            'Papua Barat Daya' => ['Sorong'],
        ];
    }
}
