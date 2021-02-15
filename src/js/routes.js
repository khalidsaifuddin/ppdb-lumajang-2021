
// import HomePage from '../pages/home.jsx';
// import loadable from '@loadable/component'

import Beranda from '../pages/Beranda';
import ProfilPengguna from '../pages/ProfilPengguna';
import login from '../pages/login';

import LeftPage1 from '../pages/left-page-1.jsx';
import LeftPage2 from '../pages/left-page-2.jsx';
import NotFoundPage from '../pages/404.jsx';
import SettingsPage from '../pages/settings.jsx';

import pertanyaanPengguna from '../pages/Pertanyaan/pertanyaanPengguna';
import tampilPertanyaan from '../pages/Pertanyaan/tampilPertanyaan';
import pantauan from '../pages/Pertanyaan/pantauan';
import jawabPertanyaan from '../pages/Pertanyaan/jawabPertanyaan';
import notifikasi from '../pages/Notifikasi/notifikasi';
import ruang from '../pages/Ruang/ruang';
import tambahRuang from '../pages/Ruang/tambahRuang';
import tampilRuang from '../pages/Ruang/tampilRuang';
import kodeRuang from '../pages/Ruang/kodeRuang';
import tambahPertanyaanRuang from '../pages/Ruang/tambahPertanyaanRuang';
import kuis from '../pages/Kuis/kuis';
import tambahKuis from '../pages/Kuis/tambahKuis';
import kodeKuis from '../pages/Kuis/kodeKuis';
import gabungKuis from '../pages/Kuis/gabungKuis';
import gabungRuang from '../pages/Ruang/gabungRuang';
import praTampilKuis from '../pages/Kuis/praTampilKuis';
import kerjakanKuis from '../pages/Kuis/kerjakanKuis';
import hasilAkhirKuis from '../pages/Kuis/hasilAkhirKuis';
import peringkatKuis from '../pages/Kuis/peringkatKuis';
import praTampilRuang from '../pages/Ruang/praTampilRuang';
import BerandaGuru from '../pages/BerandaGuru';
import kuisAnda from '../pages/Kuis/kuisAnda';
import ruangAnda from '../pages/Ruang/ruangAnda';
import buatSesiKuis from '../pages/Kuis/buatSesiKuis';
import RiwayatSesiKuis from '../pages/Kuis/RiwayatSesiKuis';
import laporanHasilKuis from '../pages/Kuis/laporanHasilKuis';
import tampilPengguna from '../pages/Pengguna/tampilPengguna';
import cariKuis from '../pages/Kuis/cariKuis';
import BerandaEmpu from '../pages/BerandaEmpu';
import tampilKuis from '../pages/Kuis/tampilKuis';
import formPertanyaan from '../pages/Kuis/formPertanyaan';
import Pricing from '../pages/Pricing';
import statistikKuis from '../pages/Kuis/statistikKuis';
import daftar from '../pages/daftar';
import BerandaSekolah from '../pages/Sekolah/BerandaSekolah';
import formSekolah from '../pages/Sekolah/formSekolah';
import kodeSekolah from '../pages/Sekolah/kodeSekolah';
import daftarGuru from '../pages/Sekolah/daftarGuru';
import buatKodeSekolah from '../pages/Sekolah/buatKodeSekolah';
import gabungSekolah from '../pages/Sekolah/gabungSekolah';
import pengaturanPengguna from '../pages/Pengguna/pengaturanPengguna';
import kolaborasiKuis from '../pages/Kuis/kolaborasiKuis';
import tambahKolaborasiKuis from '../pages/Kuis/tambahKolaborasiKuis';
import KuisFavorit from '../pages/Kuis/KuisFavorit';
import Playlist from '../pages/Playlist/Playlist';
import formPlaylist from '../pages/Playlist/formPlaylist';
import TampilPlaylist from '../pages/Playlist/TampilPlaylist';
import TambahKuisPlaylist from '../pages/Playlist/TambahKuisPlaylist';
import kehadiranRuang from '../pages/Sekolah/kehadiranRuang';
import profilSekolah from '../pages/Sekolah/profilSekolah';
import tampilAktivitas from '../pages/tampilAktivitas';
import gantiGambar from '../pages/Pengguna/gantiGambar';
import tambahAnggotaRuang from '../pages/Ruang/tambahAnggotaRuang';
import BerandaPPDB from '../pages/PPDB/BerandaPPDB';
import formulirPendaftaran from '../pages/PPDB/formulirPendaftaran';
import jadwalPPDB from '../pages/PPDB/jadwalPPDB';
import formBiodata from '../pages/PPDB/formBiodata';
import PetaPD from '../pages/PPDB/PetaPD';
import formSekolahPilihan from '../pages/PPDB/formSekolahPilihan';
import pilihSekolahPilihan from '../pages/PPDB/pilihSekolahPilihan';
import formBerkas from '../pages/PPDB/formBerkas';
import formKonfirmasi from '../pages/PPDB/formKonfirmasi';
import HomePPDB from '../pages/PPDB/HomePPDB';
import HomePPDBDinas from '../pages/PPDB/HomePPDBDinas';

// console.log(localStorage.getItem('kode_aplikasi'));

var routes = [
  {
    path: '/',
    component: 
    (localStorage.getItem('sekolah_id_beranda') === '' || localStorage.getItem('sekolah_id_beranda') === null) ? 
      (localStorage.getItem('kode_aplikasi') === 'MEJA' ? 
        Beranda : 
        (localStorage.getItem('kode_aplikasi') === 'MEJA-GURU' ? 
          BerandaGuru : 
          (localStorage.getItem('kode_aplikasi') === 'MEJA-PPDB' ? 
            HomePPDB :
            (localStorage.getItem('kode_aplikasi') === 'MEJA-PPDB-DINAS' ?
            HomePPDBDinas : 
            BerandaEmpu
            )
          )
        )
      ) : 
    BerandaSekolah,
  },
  {
    path: '/PPDB/:pengguna_id/:sekolah_id',
    component: BerandaPPDB
  },
  {
    path: '/HomePPDB/:pengguna_id/:sekolah_id',
    component: HomePPDB
  },
  {
    path: '/formulirPPDB/:pengguna_id/:sekolah_id',
    component: formulirPendaftaran
  },
  {
    path: '/jadwalPPDB/:pengguna_id/:sekolah_id',
    component: jadwalPPDB
  },
  {
    path: '/formBiodata/:peserta_didik_id/:pengguna_id/:sekolah_id',
    component: formBiodata
  },
  {
    path: '/formSekolahPilihan/:peserta_didik_id/:pengguna_id/:sekolah_id',
    component: formSekolahPilihan
  },
  {
    path: '/formBerkas/:peserta_didik_id/:pengguna_id/:sekolah_id',
    component: formBerkas
  },
  {
    path: '/formBerkas/:peserta_didik_id/:pengguna_id/:sekolah_id/:jalur_id',
    component: formBerkas
  },
  {
    path: '/formKonfirmasi/:peserta_didik_id/:pengguna_id/:sekolah_id',
    component: formKonfirmasi
  },
  {
    path: '/pilihSekolahPilihan/:peserta_didik_id/:pengguna_id/:sekolah_id',
    component: pilihSekolahPilihan
  },
  {
    path: '/pilihSekolahPilihan/:peserta_didik_id/:pengguna_id/:sekolah_id/:jalur_id',
    component: pilihSekolahPilihan
  },
  {
    path: '/pilihSekolahPilihan/:peserta_didik_id/:pengguna_id/:sekolah_id/:jalur_id/:urut_pilihan',
    component: pilihSekolahPilihan
  },
  {
    path: '/petaPD/:peserta_didik_id',
    component: PetaPD
  },
  {
    path: '/petaPD/:pengguna_id/:sekolah_id/:peserta_didik_id/:lintang/:bujur',
    component: PetaPD
  },
  {
    path: '/buatSesiKuis/:kuis_id',
    component: buatSesiKuis
  },
  {
    path: '/buatSesiKuis/:kuis_id/:kuis_orang_lain',
    component: buatSesiKuis
  },
  {
    path: '/KuisAnda',
    component: kuisAnda,
    keepAlive: false
  },
  {
    path: '/gabungKuis',
    component: gabungKuis,
    keepAlive: false
  },
  {
    path: '/gabungRuang',
    component: gabungRuang,
    keepAlive: false
  },
  {
    path: '/Pricing',
    component: Pricing,
    keepAlive: true
  },
  {
    path: '/Kuis/:pengguna_id',
    component: kuis,
    keepAlive: false
  },
  {
    path: '/aktivitas/:pertanyaan_id',
    component: tampilAktivitas,
    keepAlive: false
  },
  {
    path: '/KuisFavorit/:pengguna_id',
    component: KuisFavorit,
    keepAlive: false
  },
  {
    path: '/KuisFavorit/',
    component: KuisFavorit,
    keepAlive: false
  },
  {
    path: '/Playlist/',
    component: Playlist,
    keepAlive: false
  },
  {
    path: '/formPlaylist/',
    component: formPlaylist,
    keepAlive: false
  },
  {
    path: '/formPlaylist/:playlist_id',
    component: formPlaylist,
    keepAlive: false
  },
  {
    path: '/TampilPlaylist/:playlist_id',
    component: TampilPlaylist,
    keepAlive: false
  },
  {
    path: '/TambahKuisPlaylist/:playlist_id',
    component: TambahKuisPlaylist,
    keepAlive: false
  },
  {
    path: '/KuisAnda/:pengguna_id',
    component: kuisAnda,
    keepAlive: false
  },
  {
    path: '/peringkatKuis/:sesi_kuis_id',
    component: peringkatKuis,
    keepAlive: false
  },
  {
    path: '/statistikKuis/:sesi_kuis_id',
    component: statistikKuis,
    keepAlive: false
  },
  {
    path: '/RiwayatSesiKuis/:kuis_id',
    component: RiwayatSesiKuis
  },
  {
    path: '/hasilAkhirKuis/:kuis_id',
    component: hasilAkhirKuis
  },
  {
    path: '/hasilAkhirKuis/:kuis_id/:sesi_kuis_id',
    component: hasilAkhirKuis
  },
  {
    path: '/KodeKuis/:sesi_kuis_id',
    component: kodeKuis
  },
  {
    path: '/kerjakanKuis/:kuis_id',
    component: kerjakanKuis
  },
  {
    path: '/kerjakanKuis/:kuis_id/:kode_sesi',
    component: kerjakanKuis
  },
  {
    path: '/kerjakanKuis/:kuis_id/:kode_sesi/:nomor',
    component: kerjakanKuis
  },
  {
    path: '/praTampilKuis/:kode_kuis',
    component: praTampilKuis
  },
  {
    path: '/praTampilKuis/:kode_kuis/:kuis_id',
    component: praTampilKuis
  },
  {
    path: '/ikutiKuis/:kode_kuis',
    component: praTampilKuis
  },
  {
    path: '/tampilKuis/:kuis_id',
    component: tampilKuis
  },
  {
    path: '/formPertanyaan/:kuis_id',
    component: formPertanyaan
  },
  {
    path: '/formPertanyaan/:kuis_id/:pertanyaan_kuis_id',
    component: formPertanyaan
  },
  {
    path: '/praTampilRuang/:kode_ruang',
    component: praTampilRuang
  },
  {
    path: '/tambahKuis/',
    component: tambahKuis
  },
  {
    path: '/cari/',
    component: cariKuis
  },
  {
    path: '/tambahKuis/:pengguna_id',
    component: tambahKuis
  },
  {
    path: '/tambahKuis/:pengguna_id/:kuis_id',
    component: tambahKuis
  },
  {
    path: '/tambahKuisRuang/:pengguna_id/:ruang_id',
    component: tambahKuis
  },
  {
    path: '/laporanHasilKuis/:ruang_id',
    component: laporanHasilKuis
  },
  {
    path: '/Ruang',
    component: ruang
  },
  {
    path: '/RuangAnda',
    component: ruangAnda
  },
  {
    path: '/tambahRuang',
    component: tambahRuang
  },
  {
    path: '/tambahRuangSekolahBaru/:sekolah_id',
    component: tambahRuang
  },
  {
    path: '/tambahRuang/:ruang_id',
    component: tambahRuang
  },
  {
    path: '/tampilRuang/:ruang_id',
    component: tampilRuang
  },
  {
    path: '/kehadiranRuang/:ruang_id/:sekolah_id/:tahun_ajaran_id',
    component: kehadiranRuang
  },
  {
    path: '/kodeRuang/:ruang_id',
    component: kodeRuang
  },
  {
    path: '/sekolah/:sekolah_id',
    component: profilSekolah
  },
  {
    path: '/tambahPertanyaanRuang/:ruang_id',
    component: tambahPertanyaanRuang
  },
  {
    path: '/pertanyaanPengguna/:pengguna_id',
    component: pertanyaanPengguna
  },
  {
    path: '/pantauan/:pengguna_id',
    component: pantauan
  },
  {
    path: '/tampilPertanyaan/:pertanyaan_id',
    component: tampilPertanyaan
  },
  {
    path: '/jawabPertanyaan/:pertanyaan_id',
    component: jawabPertanyaan
  },
  {
    path: '/buatKodeSekolah/:sekolah_id',
    component: buatKodeSekolah
  },
  {
    path: '/notifikasi',
    component: notifikasi
  },
  {
    path: '/login',
    component: login,
  },
  {
    path: '/login/:param_1/:param_2',
    component: login,
  },
  {
    path: '/daftar/',
    component: daftar,
  },
  {
    path: '/daftar/:param_1/:param_2',
    component: daftar,
  },
  {
    path: '/ProfilPengguna',
    component: ProfilPengguna,
    // keepAlive: true,
  },
  {
    path: '/BerandaSekolah/',
    component: BerandaSekolah
  },
  {
    path: '/gabungSekolah/',
    component: gabungSekolah
  },
  {
    path: '/kodeSekolah/:sekolah_id/:undangan_sekolah_id',
    component: kodeSekolah
  },
  {
    path: '/daftarGuru/:sekolah_id',
    component: daftarGuru
  },
  {
    path: '/formSekolah/:sekolah_id',
    component: formSekolah
  },
  {
    path: '/tampilPengguna/:pengguna_id',
    component: tampilPengguna,
    // keepAlive: true,
  },
  {
    path: '/ProfilPengguna/:pengguna_id',
    component: ProfilPengguna,
    // keepAlive: true,
  },
  {
    path: '/tambahKolaborasiKuis/:kuis_id',
    component: tambahKolaborasiKuis,
    // keepAlive: true,
  },
  {
    path: '/kolaborasiKuis/:kuis_id',
    component: kolaborasiKuis,
    // keepAlive: true,
  },
  {
    path: '/gantiGambar/:pengguna_id',
    component: gantiGambar
  },
  {
    path: '/tambahAnggotaRuang/:ruang_id/:sekolah_id',
    component: tambahAnggotaRuang
  },
  {
    path: '/pengaturanPengguna/:pengguna_id/:sekolah_id',
    component: pengaturanPengguna,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },
  {
    path: '/left-page-1/',
    component: LeftPage1,
  },
  {
    path: '/left-page-2/',
    component: LeftPage2,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
