<template>
    <div>
        <h3>AKSES PATOPS VIA <b-badge variant="success">INTRANET</b-badge></h3>
        <small class="text-muted">opsional, kalau mau kecepatan akses rasa lokal</small>
        <p>
            By default jalur akses aplikasi adalah melalui internet. 
            Dikarenakan kondisi internet di terminal bandara soekarno hatta (terutama T3) yang kurang optimal,
            maka server aplikasi ini disetel sedemikian rupa sehingga bisa diakses via dua jalur, 
            <mark>internet</mark> dan <mark><a href="#akses-intranet">intranet</a></mark>
        </p>
        <h4 id="akses-intranet">Akses via INTRANET</h4>
        <p>
            Untuk menyetel jalur akses komputer agar menggunakan jalur intranet, ikuti langkah-langkah di bawah ini:
            <br>
            <span class="text-danger">JANGAN LUPA BACA CARA RESTORE SETTINGNYA <a href="#remove-akses-intranet">DI SINI</a></span>
        </p>
        <div>
            <h5>Download dan Jalankan Batch Scriptnya</h5>
            <div class="pl-3">
                <p>
                    Download Batch Script di 
                    <b-button variant="primary" size="sm" href="/static/force-intranet-path.bat" class="shadow">Sini</b-button>
                </p>
                
                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-intranet-01.png"/>
                    </template>
                    <p>
                        Akan Muncul Prompt seperti ini.
                    </p>
                    <p>
                        Klik <mark>Save File</mark> untuk mendownload batch scriptnya
                    </p>
                </b-media>
                
                <div class="my-4"/>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-intranet-02.png"/>
                    </template>
                    <p>
                        Setelah file didownload, buka lokasi folder tempat file didownload
                    </p>
                </b-media>

                <div class="my-4"/>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-intranet-03.png"/>
                    </template>
                    <p>
                        Saatnya menjalankan script yang baru kita download. Klik kanan file <strong>force-intranet-path.bat</strong>
                        , lalu pilih <mark>Run as Administrator</mark>
                    </p>
                    <p>
                        Akan muncul prompt untuk mengijinkan script dijalankan dengan privilege <em>Administrator</em>,
                        Klik <mark>Yes</mark> untuk mengijinkan (kalau tidak, script tidak bisa jalan)
                    </p>
                </b-media>

                <div class="my-4"/>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-intranet-04.png"/>
                    </template>
                    <p>
                        Apabila script berhasil dijalankan akan muncul tampilan seperti berikut
                    </p>
                </b-media>

                <p>
                    Apabila langkah di atas sudah dijalankan dengan sukses, 
                    maka sebaiknya browser direstart (tutup lalu buka kembali)
                </p>
            </div>
        </div>
        <hr/>
        <h4 id="remove-akses-intranet">Kembalikan setelan jalur seperti semula</h4>
        <p>
            Apabila dirasa jalur intranet sudah tidak diperlukan (misal karena setelan jaringan di pc berubah),
            atau karena di lokasi kerja tidak ada akses intranet ke server, ikuti langkah berikut:
        </p>
        <div>
            <h5>Download dan Jalankan Batch Scriptnya</h5>
            <div class="pl-3">
                <p>
                    Download batch script untuk merestore setting jalur akses di 
                    <b-button variant="primary" class="shadow" size="sm" href="/static/remove-intranet-path.bat">Sini</b-button>
                </p>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-remove-01.png"/>
                    </template>
                    <p>
                        Akan Muncul Prompt seperti ini.
                    </p>
                    <p>
                        Klik <mark>Save File</mark> untuk mendownload batch scriptnya
                    </p>
                </b-media>
                
                <div class="my-4"/>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-remove-02.png"/>
                    </template>
                    <p>
                        Setelah file didownload, buka lokasi folder tempat file didownload
                    </p>
                </b-media>

                <div class="my-4"/>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-remove-03.png"/>
                    </template>
                    <p>
                        Saatnya menjalankan script yang baru kita download. Klik kanan file <strong>remove-intranet-path.bat</strong>
                        , lalu pilih <mark>Run as Administrator</mark>
                    </p>
                    <p>
                        Akan muncul prompt untuk mengijinkan script dijalankan dengan privilege <em>Administrator</em>,
                        Klik <mark>Yes</mark> untuk mengijinkan (kalau tidak, script tidak bisa jalan)
                    </p>
                </b-media>

                <div class="my-4"/>

                <b-media>
                    <template #aside>
                        <b-img fluid src="/static/assets/media/tutor-intranet-04.png"/>
                    </template>
                    <p>
                        Apabila script berhasil dijalankan akan muncul tampilan seperti berikut
                    </p>
                </b-media>

                <p>
                    Apabila langkah di atas sudah dijalankan dengan sukses, 
                    maka sebaiknya browser direstart (tutup lalu buka kembali)
                </p>
            </div>
        </div>
    </div>
</template>