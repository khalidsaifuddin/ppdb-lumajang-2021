// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.jsx';

// Init F7 Vue Plugin
Framework7.use(Framework7React)

//localStorage config
// localStorage.setItem('api_base','http://118.98.166.82:8881');
localStorage.setItem('api_base','https://be.diskuis.id');
// localStorage.setItem('api_base','http://117.53.47.43:8090');
// localStorage.setItem('google_api','188472097829-4h5peopg70ndp9g1p9seg1abgkg64ot4.apps.googleusercontent.com');

// // 026100
if(localStorage.getItem('kode_aplikasi') === 'MEJA'){
  
  // localStorage.setItem('google_api','582957663393-j04718ubtpq1ink0gicc5811jm6int7a.apps.googleusercontent.com');
  // localStorage.setItem('google_api','582957663393-qn8160pfr7fcgedsa00u56vc9mjl01lc.apps.googleusercontent.com');
  // localStorage.setItem('google_api','582957663393-mq35tdi3g211gsrfgggqp38pkhntm6gi.apps.googleusercontent.com');
  
  localStorage.setItem('google_api','582957663393-9iopgg1630qddhvpaa2lecjiol3cl2ce.apps.googleusercontent.com');

  // localStorage.setItem('judul_aplikasi','Diskuis');
  // localStorage.setItem('sub_judul_aplikasi','Pendidikan Digital');
  // localStorage.setItem('kode_aplikasi','MEJA');
  // localStorage.setItem('tema_warna_aplikasi','biru-1');
  // localStorage.setItem('wilayah_aplikasi','');
  // localStorage.setItem('kode_wilayah_aplikasi','026100');
  // localStorage.setItem('id_level_wilayah_aplikasi','2');
  // localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
  // localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
  // localStorage.setItem('versi_aplikasi','2020.02.01');
  // localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
  // localStorage.setItem('socket_url',"https://socket.diskuis.id");
  // localStorage.setItem('device','web');
  // localStorage.setItem('versi','3.1.6');

}

// localStorage.setItem('custom_logo_sekolah_nama','EDS Dikdasmen Mobile'); 
// localStorage.setItem('custom_logo_sekolah','/assets/img/logo-pmp.png');

// localStorage.setItem('custom_logo_sekolah_nama','MTS Miftahul Ulum Banyuputih');
// localStorage.setItem('custom_logo_sekolah','/assets/berkas/6ee33569-3f5e-45f3-a2a9-6eaccf0f1dfa.png');
// localStorage.setItem('custom_logo_sekolah','/assets/berkas/6ecf62a3-66fa-4b61-ac36-259e02715b16.jpg');

localStorage.setItem('custom_logo_sekolah_nama','PPDB Kab Lumajang 2021');
localStorage.setItem('custom_logo_sekolah','/assets/berkas/lumajang_logo_besar.png');

// localStorage.setItem('google_api','582957663393-fg6kneevl669rco78u7cmgdholp3ccjp.apps.googleusercontent.com');
// localStorage.setItem('judul_aplikasi','Diskuis (Beta)');
// localStorage.setItem('sub_judul_aplikasi','Dasbor Game Master');
// localStorage.setItem('kode_aplikasi','MEJA-GURU');
// localStorage.setItem('tema_warna_aplikasi','biru-1');
// localStorage.setItem('wilayah_aplikasi','');
// localStorage.setItem('kode_wilayah_aplikasi','026100');
// localStorage.setItem('id_level_wilayah_aplikasi','2');
// localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
// localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
// localStorage.setItem('versi_aplikasi','2020.02.01');
// localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
// localStorage.setItem('socket_url',"http://socket.diskuis.id:5000");
// // localStorage.setItem('socket_url',"http://117.53.47.43:5000");

// localStorage.setItem('google_api','582957663393-fg6kneevl669rco78u7cmgdholp3ccjp.apps.googleusercontent.com');
// localStorage.setItem('judul_aplikasi','Diskuis');
// localStorage.setItem('sub_judul_aplikasi','Dasbor Empu Diskuis');
// localStorage.setItem('kode_aplikasi','MEJA-EMPU');
// localStorage.setItem('tema_warna_aplikasi','biru-1');
// localStorage.setItem('wilayah_aplikasi','');
// localStorage.setItem('kode_wilayah_aplikasi','026100');
// localStorage.setItem('id_level_wilayah_aplikasi','2');
// localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
// localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
// localStorage.setItem('versi_aplikasi','2020.02.01');
// localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
// localStorage.setItem('socket_url',"http://117.53.47.43:5000");

localStorage.setItem('judul_aplikasi','PPDB Kab Lumajang 2021');
localStorage.setItem('sub_judul_aplikasi','Dinas Pendidikan Kabupaten Lumajang');
localStorage.setItem('kode_aplikasi','MEJA-PPDB');
// localStorage.setItem('kode_aplikasi','MEJA-PPDB-PUBLIK');
// localStorage.setItem('kode_aplikasi','MEJA-PPDB-DINAS');
localStorage.setItem('tema_warna_aplikasi','biru-1');
localStorage.setItem('wilayah_aplikasi','');
localStorage.setItem('kode_wilayah_aplikasi','026100');
localStorage.setItem('id_level_wilayah_aplikasi','2');
localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
localStorage.setItem('versi_aplikasi','2020.02.01');
localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
localStorage.setItem('socket_url',"https://socket.diskuis.id");
localStorage.setItem('device','web');
localStorage.setItem('versi','1.0.0');


// localStorage.setItem('initial_route','/DataPokokSekolah/');
// localStorage.setItem('show_toolbar','1');

// localStorage.setItem('google_api','582957663393-kp55jbquet0m0rlkkkskrahm2ruq8dfc.apps.googleusercontent.com');
// localStorage.setItem('api_base','http://mejabantu:8888');
// localStorage.setItem('google_api', '582957663393-hlr6l0a2oendcq6ul13n9pasi88mb7bc.apps.googleusercontent.com');
// localStorage.setItem('device','android');
localStorage.setItem('device','web');

document.title = localStorage.getItem('judul_aplikasi') + " - " + localStorage.getItem('sub_judul_aplikasi');

if(localStorage.getItem('sudah_login') === null ||localStorage.getItem('sudah_login') === ''){
  localStorage.setItem('sudah_login', '0');
}

if(localStorage.getItem('riwayat_kata_kunci') === null){
  localStorage.setItem('riwayat_kata_kunci', '');
}

// Mount React App
ReactDOM.render(
  <Provider store={store}>
    {React.createElement(App)}
  </Provider>,
  document.getElementById('app'),
);