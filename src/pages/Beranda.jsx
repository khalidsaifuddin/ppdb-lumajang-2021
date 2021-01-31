import React, {Component} from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  Card,
  BlockTitle,
  List,
  ListItem,
  Row,
  Col,
  Button,
  Icon,
  SkeletonText,
  CardHeader,
  CardContent,
  CardFooter,
  Subnavbar,
  ListItemContent,
  Badge,
  ListInput,
  Popover, Progressbar
} from 'framework7-react';

import { Doughnut, Bar, Radar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import TypographyComponent from 'framework7/components/typography/typography';
import { getSPMKabupatenPerKecamatan, getGtkJenisPie, daftar } from '../store/actions';

import io from 'socket.io-client';

import moment from 'moment';
import ruang from './Ruang/ruang';
import AktivitasReducer from '../store/reducers/Aktivitas.reducers';

import localForage from 'localforage';

import { Offline, Online } from "react-detect-offline";
import AktivitasSosial from './AktivitasSosial';

class Beranda extends Component {

  state = {
    error: null,
    loading: true,
    data: {
      r_kelas: [],
      perpustakaan: []
    },
    pertanyaan: {
      rows: [],
      total: 0
    },
    users: [],
    loadingPertanyaan: true,
    notifikasi: {
      rows: [],
      total: 0
    },
    linimasa: {
      rows: [],
      total: 0
    },
    startLinimasa: 0,
    aktivitas: (localStorage.getItem('user') ? (localStorage.getItem('getAktivitas:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getAktivitas:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} ),
    startAktivitas: 0,
    mapel: (localStorage.getItem('user') ? (localStorage.getItem('getMapel:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getMapel:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : []) : [] ),
    rata_kuis: (localStorage.getItem('user') ? (localStorage.getItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id) && localStorage.getItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id) !== 'undefined' ? JSON.parse(localStorage.getItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {}) : {} ),
    pengaturan_pengguna: {},
    sekolah_pengguna: (localStorage.getItem('user') ? (localStorage.getItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} ),
    kuis_trending: (localStorage.getItem('user') ? (localStorage.getItem('getKuisTrending:'+JSON.parse(localStorage.getItem('user')).pengguna_id) ? JSON.parse(localStorage.getItem('getKuisTrending:'+JSON.parse(localStorage.getItem('user')).pengguna_id)) : {rows: [],total: 0}) : {rows: [],total: 0} ),
    sekolah: {
      rows: [],
      total: 0
    },
    loading_kuis: {},
    unduh_kuis: {},
    kuis_tersimpan: {
      rows: [],
      total: 0
    },
    tab_aktif: 'guru'
  };


  bulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
]

  formatAngka = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  backClick = () => {

    let properti = 'beranda';
    // alert('tes');
    // console.log(this.props.f7router.url.replace("/","").replace("/",""));
    // console.log(this.props.tabBar);
    for (var property in this.props.tabBar) {
        // console.log(this.state.tabBar[property]);
        this.props.tabBar[property] = false;
    }
    if(this.props.f7router.url.replace("/","").replace("/","") !== ""){
        properti = this.props.f7router.url.replace("/","").replace("/","");
    }
    this.props.tabBar[properti] = true;

    this.props.setTabActive(this.props.tabBar);
    // console.log(this.props.tabBar.beranda);
  }   

  componentDidMount = () => {

    // this.props.getNotifikasiRedis({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, tipe: 'belum_dibaca'}).then((result)=>{
    //   this.setState({
    //     notifikasi: result.payload
    //   })
    // })

    // console.log('beranda');
    // console.log(this.state.sekolah_pengguna)

    // console.log(this.props.window_dimension)

    if(parseInt(localStorage.getItem('sudah_login')) !== 1){
      this.$f7router.navigate('/login/');
    }

    // console.log(this.$f7route.url.split("#"));

    let arrUrl_1 = this.$f7route.url.split("#");

    if(arrUrl_1.length > 1){
      // ada url masuk
      let arrUrl_2 = arrUrl_1[1].split("/");

      // console.log(arrUrl_2);

      if(arrUrl_2[0] === 'gabungKuis'){
        // this.$f7.dialog.preloader();
        this.$f7router.navigate('/praTampilKuis/'+arrUrl_2[1]);
      }

      if(arrUrl_2[0] === 'gabungRuang'){
        // this.$f7.dialog.preloader();
        this.$f7router.navigate('/praTampilRuang/'+arrUrl_2[1]);
      }
    }else{
      // nggak ada
    }

    // if(localStorage.getItem('current_url') !== ''){
    //   this.$f7route.navigate(localStorage.getItem('current_url'))
    // }

    // let socket = io(localStorage.getItem('socket_url'));

    // socket.on('updateUserList', (users) => {
    //     this.setState({
    //         users
    //     },()=>{
    //         // console.log(this.state.users);
    //     });
    // });

    if(parseInt(localStorage.getItem('sudah_login')) === 1){

      localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ).then((value)=>{
        this.setState({
            kuis_tersimpan: {
                rows: value,
                total: value.length
            }
        },()=>{
            console.log(this.state.kuis_tersimpan)
        })
      })
      
      this.setState({
        routeParamsNotifikasi: {
          pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
          start: this.state.startLinimasa,
          dibaca: "1"
        }
      },()=>{
        
        this.props.getNotifikasiRedisBelumDibaca({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id, tipe: 'belum_dibaca'}).then((result)=>{
        //   this.setState({
        //     notifikasi: result.payload
        //   })
        // })
        // this.props.getNotifikasi(this.state.routeParamsNotifikasi).then((result)=>{
          // this.props.getPertanyaan(this.state.routeParams).then((result)=>{
            this.setState({
              // pertanyaan: this.props.pertanyaan,
              // notifikasi: this.props.notifikasi,
              // loadingPertanyaan: false,
              notifikasi: result.payload,
              routeParamsMapel: {
                limit: 5,
                trending: 'Y'
              }
            },()=>{
              // this.props.getLinimasa(this.state.routeParamsNotifikasi).then((result)=>{
              //   this.setState({
              //     linimasa: {
              //       rows: [
              //         ...this.state.linimasa.rows,
              //         ...this.props.linimasa.rows
              //       ],
              //       total: (parseInt(this.state.linimasa.total)+parseInt(this.props.linimasa.total))
              //     }
              //   });
              // });
              
              this.props.getMapel(this.state.routeParamsMapel).then((result)=>{
                this.setState({
                  mapel: this.props.mapel
                },()=>{
                  localStorage.setItem('getMapel:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.props.mapel))
                })
              });

              this.props.getAktivitas(this.state.routeParamsNotifikasi).then((result)=>{
                this.setState({
                  aktivitas: {
                    rows: [
                      ...this.state.aktivitas.rows,
                      ...this.props.aktivitas.rows
                    ],
                    total: (parseInt(this.state.aktivitas.total)+parseInt(this.props.aktivitas.total))
                  }
                },()=>{
                  localStorage.setItem('getAktivitas:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.state.aktivitas))
                });
              });
            });
          // });
  
        });

        this.props.getKuisDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  
        
        this.props.getRuangDiikuti(this.state.routeParamsNotifikasi).then((result)=>{
          
        });  
        
        this.props.getLeaderboardPengguna({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
          
        });  
        
        this.props.getKuisTrending(this.state.routeParams).then((result)=>{
          this.setState({
            ...this.state,
            kuis_trending: this.props.kuis_trending
          },()=>{

            localStorage.setItem('getKuisTrending:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.props.kuis_trending))

          })
        }); 

        this.props.getRataKuis(this.state.routeParamsNotifikasi).then((result)=>{
          //do nothing
          this.setState({
            ...this.state,
            rata_kuis: this.props.rata_kuis[0]
          },()=>{

            localStorage.setItem('getRataKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.props.rata_kuis[0]))

          })
        });

        this.props.getPengaturanPengguna(this.state.routeParamsNotifikasi).then((result)=>{
          this.setState({
            ...this.state,
            pengaturan_pengguna: this.props.pengaturan_pengguna.rows[0]
          },()=>{
            //cek sekolah aktifnya
            if(this.state.pengaturan_pengguna && parseInt(this.state.pengaturan_pengguna.tampilkan_beranda_sekolah) === 1){
              //berarti langsung nampilin beranda sekolah
              this.setState({
                routeParamsSekolah: {
                  ...this.state.routeParamsSekolah,
                  pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
                  aktif: 1
                }
              },()=>{
                
                this.props.getSekolah(this.state.routeParamsSekolah).then((result)=>{
                  this.setState({
                    sekolah: this.props.sekolah
                  },()=>{
                    //dapat sekolahnya nggak?
                    if(this.state.sekolah.total > 0){

                      localStorage.setItem('sekolah_id_beranda',this.props.sekolah.rows[0].sekolah_id);
  
                      if(parseInt(this.state.pengaturan_pengguna.custom_logo_sekolah) === 1){
  
                        localStorage.setItem('custom_logo_sekolah', this.props.sekolah.rows[0].gambar_logo);
                        localStorage.setItem('custom_logo_sekolah_nama', this.props.sekolah.rows[0].nama);
  
                      }
  
                      
                      if(localStorage.getItem('device') === 'android'){
                          window.location.reload(true);
                      }else{
                          window.location.href="/";
                      }
                      
                    }
                  });
                });
              });
            }
          });
        });

        this.props.getSekolahPengguna(this.state.routeParamsNotifikasi).then((result)=>{

          if(this.props.sekolah_pengguna.total > 0){

            this.setState({
              ...this.state,
              sekolah_pengguna: this.props.sekolah_pengguna
            },()=>{

              localStorage.setItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.props.sekolah_pengguna))

              // console.log(localStorage.getItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id))
            
            })

          }

        }); 

      });

    }

  }

  // simpanPantauan = (pertanyaan_id) => {
  //   // alert(pertanyaan_id);
  //   this.setState({
  //     routeParamsPantauan: {
  //       pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id,
  //       pertanyaan_id: pertanyaan_id
  //     }
  //   },()=>{
  //     this.props.simpanPantauan(this.state.routeParamsPantauan).then((result)=>{

  //       this.props.getPertanyaan(this.state.routeParams).then((result)=>{
  //         this.setState({
  //           pertanyaan: this.props.pertanyaan,
  //           notifikasi: this.props.notifikasi,
  //           loadingPertanyaan: false,
  //         });
  //       });

  //     })
  //   });
  // }
  ikutiPengguna = (pengguna_id, aktivitas_id, index) => {
    this.setState({
        routeParamsPengikut: {
            pengguna_id: pengguna_id,
            pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
            soft_delete: 0
        },
        disabledButtonMengikuti: true
    },()=>{
        this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
          this.props.getAktivitas(this.state.routeParamsNotifikasi).then((result)=>{
            this.setState({
              aktivitas: this.props.aktivitas
            });
          });
        });
    });
  }

  stopIkutiPengguna = (pengguna_id, aktivitas_id) => {
    this.setState({
        routeParamsPengikut: {
            pengguna_id: pengguna_id,
            pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
            soft_delete: 1
        },
        disabledButtonMengikuti: true
    },()=>{
        this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
          this.props.getAktivitas(this.state.routeParamsNotifikasi).then((result)=>{
            this.setState({
              aktivitas: this.props.aktivitas
            });
          });
        });
    });
  }
  gantiDasborGameMaster = () => {
    // localStorage.setItem('google_api','582957663393-fg6kneevl669rco78u7cmgdholp3ccjp.apps.googleusercontent.com');
    localStorage.setItem('judul_aplikasi','Diskuis (Beta)');
    localStorage.setItem('sub_judul_aplikasi','Dasbor Game Master');
    localStorage.setItem('kode_aplikasi','MEJA-GURU');
    localStorage.setItem('tema_warna_aplikasi','biru-1');
    localStorage.setItem('wilayah_aplikasi','');
    localStorage.setItem('kode_wilayah_aplikasi','026100');
    localStorage.setItem('id_level_wilayah_aplikasi','2');
    localStorage.setItem('jenjang_aplikasi','5-6-13-15-29'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
    localStorage.setItem('semester_id_aplikasi','20191'); // 5=SD, 6=SMP, 13=SMA, 15=SMK, 29=SLB, 1=PAUD
    localStorage.setItem('versi_aplikasi','2020.02.01');
    localStorage.setItem('logo_aplikasi',"https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png");
    // localStorage.setItewm('socket_url',"http://socket.diskuis.id:5000");
    // localStorage.setItem('socket_url',"http://117.53.47.43:5000");

    // window.location.href="/";
    if(localStorage.getItem('device') === 'android'){
        window.location.reload(true);
    }else{
        window.location.href="/";
    }
  }

  unduhKuis = (sesi_kuis_id, kuis_id, kode_sesi) => {
    this.setState({
      ...this.state,
      loading_kuis: {
        ...this.state.loading_kuis,
        [sesi_kuis_id]: true
      },
      unduh_kuis: {
        sesi_kuis_id: sesi_kuis_id,
        kuis_id: kuis_id,
        kode_sesi: kode_sesi
      }
    },()=>{

      this.props.getKuis(this.state.unduh_kuis).then((result)=>{
          this.setState({
            ...this.state
            // loading_kuis: {
            //   ...this.state.loading_kuis,
            //   [sesi_kuis_id]: false
            // }
          },()=>{
            // console.log(JSON.stringify(this.props.kuis).length)

            localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.props.kuis).then((valueId)=>{
              
              localForage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.kode_sesi, this.props.kuis).then((valueKode)=>{
                // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ))
                // console.log(valueKode)
                
                let daftar_kuis_tersimpan = [];

                localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ).then((result)=>{
                  // console.log(result)
                  if(result){
                    //ada
                    daftar_kuis_tersimpan = [
                      ...result,
                      ...this.props.kuis.rows
                    ]
                  }else{
                    //tidak ada
                    daftar_kuis_tersimpan = [
                      ...this.props.kuis.rows
                    ]
                  }

                  localForage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, daftar_kuis_tersimpan )

                  localStorage.setItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id, this.state.unduh_kuis.sesi_kuis_id)

                })

                // if(typeof(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id )) !== 'undefined'){
                //   console.log('ada')
                // }else{
                //   console.log('nggak ada')
                // }


                // if(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id )){

                  // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ))

                //   daftar_kuis_tersimpan = [
                //     ...localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id ),
                //     ...this.props.kuis.rows
                //   ]
                // }else{
                //   daftar_kuis_tersimpan = [
                //     ...this.props.kuis.rows
                //   ]
                // } 
    
                // localForage.setItem( 'daftar_kuis_tersimpan:'+JSON.parse( localStorage.getItem('user') ).pengguna_id, daftar_kuis_tersimpan )
    
                // console.log(localForage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+this.state.unduh_kuis.kuis_id+':'+this.state.unduh_kuis.sesi_kuis_id))
                // console.log(localForage.getItem( 'daftar_kuis_tersimpan:'+JSON.parse(localStorage.getItem('user')).pengguna_id))
                
              })

            })



          })
      })

      setTimeout(() => {
        
        this.setState({
          ...this.state,
          loading_kuis: {
            ...this.state.loading_kuis,
            [sesi_kuis_id]: false
          }
        })

      }, 3000);

    })
  }

  gantiTabGuruSiswa = (tab_aktif) => {
    this.setState({
      tab_aktif: tab_aktif
    })
  }

  render()
    {
        // console.log(localStorage.getItem('semester_id_aplikasi'));
        return (
          <Page name="Beranda" hideBarsOnScroll>
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <Navbar 
              sliding={false} 
              // large
            >
                <NavLeft>
                    <Link iconIos="f7:menu" iconAurora="f7:menu" iconMd="material:menu" panelOpen="left" className="sideMenuToggle" />
                </NavLeft>
                <NavTitle>
                  {/* {localStorage.getItem('judul_aplikasi')} */}
                  <img src={localStorage.getItem('api_base')+'/assets/berkas/diskuis_red.png'}  style={{height:'30px', margin:'auto', marginTop:'10px'}} />
                </NavTitle>
                {/* <NavTitleLarge style={{color:(localStorage.getItem('tema_warna_aplikasi') === 'biru-1' ? '#369CF4' : '#FA5F0C')}}>{localStorage.getItem('judul_aplikasi')}</NavTitleLarge> */}
                <NavRight>
                    {parseInt(localStorage.getItem('sudah_login')) === 1 &&
                    <>
                    {/* {localStorage.getItem('kode_aplikasi') === 'MEJA' &&
                    <Button raised fill href="#" style={{marginLeft:'0px', marginRight:'8px'}} onClick={()=>window.open('https://app.diskuis.id/gamemaster/')}>
                      <i className="icon f7-icons" style={{fontSize:'20px'}}>bolt_fill</i> 
                      Dasbor Game Master
                    </Button>
                    } */}
                    <Link iconOnly href="/notifikasi" style={{marginLeft:'0px'}}> 
                      <Icon ios={this.state.notifikasi.total > 0 ? "f7:bell_fill" : "f7:bell"} aurora={this.state.notifikasi.total > 0 ? "f7:bell_fill" : "f7:bell"} md={this.state.notifikasi.total > 0 ? "material:bell_fill" : "material:bell"} tooltip="Notifikasi">
                        {this.state.notifikasi.total > 0 && <Badge color="red">{this.state.notifikasi.total}</Badge>}
                      </Icon>
                    </Link>
                    <Link iconOnly href="/Cari" style={{marginLeft:'0px'}}> 
                      <Icon ios="f7:search" tooltip="Pencarian">
                      </Icon>
                    </Link>
                    {/* <Link style={{marginLeft:'0px'}} iconIos="f7:plus_app" iconAurora="f7:plus_app" iconMd="material:plus_app" tooltip="Buat Pertanyaan Baru" href="/tambahPertanyaan"></Link> */}
                    {/* <Link href="/ProfilPengguna">
                      <img style={{height:'30px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                    </Link> */}
                    </>
                    }
                </NavRight>
            </Navbar>
            }
            {parseInt(localStorage.getItem('sudah_login')) === 1 &&
            <div className="merahAtas">
              <Offline>
                <Card className="off_indi">
                  <CardContent>
                    Anda Sedang Offline! Anda masih dapat mengakses dan mengerjakan kuis yang telah tersimpan di aplikasi, namun beberapa fitur lain tidak akan berjalan dengan optimal sampai Anda kembali online
                  </CardContent>
                </Card>
              </Offline>
              <Row noGap>
                {/* <Col width="100" width="100">
                  <Row>
                    <Col width="100">
                      <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                        <img style={{height:'7vh', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                      </Link>
                    </Col>
                    <Col width="100">
                      <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                        <b style={{fontSize:'30px', fontWeight:'bold'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                      </Link>
                      <br/>
                      <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                        <span style={{fontSize:'15px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                      </Link>
                    </Col>
                  </Row>
                </Col> */}
                <Col width="100" tabletWidth="50">
                  <Row>
                    <Col width="20" tabletwidth="15" desktopWidth="10">
                      <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                        <img style={{width:'50px', height:'50px', borderRadius:'50%', marginLeft:'0px', border:'1px solid #cccccc'}} src={JSON.parse(localStorage.getItem('user')).gambar} />
                      </Link>
                    </Col>
                    <Col width="80" tabletwidth="85" desktopWidth="90" style={{paddingLeft:'8px'}}>
                      <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                        <b style={{fontSize:'22px', fontWeight:'bold'}}>{JSON.parse(localStorage.getItem('user')).nama}</b><br/>
                      </Link>
                      <br/>
                      <Link href={"/tampilPengguna/"+JSON.parse(localStorage.getItem('user')).pengguna_id} style={{color:'white'}}>
                        <span style={{fontSize:'13px'}}>{JSON.parse(localStorage.getItem('user')).username}</span><br/>
                      </Link>
                      {/* <Row>
                        <Col width="100">
                          <br/>
                          <Row>
                            <Col width="30">
                              <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Poin:<br/>
                              <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>money_dollar_circle_fill</i>&nbsp;<b className="angkaPoin">0</b>
                              <div style={{fontSize:'10px'}}>Riwayat Poin</div>
                            </Col>
                            <Col width="30">
                              Kuis Diikuti:<br/>
                              <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;<b className="angkaPoin">{this.state.rata_kuis ? this.state.rata_kuis.total : "0"}</b>
                              <div style={{fontSize:'10px'}}>Kuis</div>
                            </Col>
                            <Col width="40">
                            <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Skor Rata-rata<br/>
                              <i className="icon f7-icons" style={{fontSize:'20px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;
                              <b style={{fontSize:'20px', fontWeight:'bold'}}>{this.state.rata_kuis ? parseFloat(this.state.rata_kuis.rata).toFixed(2) : '0'}</b>
                              {this.state.rata_kuis &&
                              <div style={{fontSize:'10px'}}>dari total {this.state.rata_kuis.total} kuis</div>
                              }
                            </Col>
                          </Row>
                        </Col>
                      </Row> */}
                    </Col>
                    <Col width="100">
                      <br/>
                      <Row>
                        <Col width="30">
                          <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Poin:<br/>
                          <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>money_dollar_circle_fill</i>&nbsp;<b className="angkaPoin">0</b>
                          <div style={{fontSize:'10px'}}>Riwayat Poin</div>
                        </Col>
                        <Col width="30">
                          Kuis Diikuti:<br/>
                          <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;<b className="angkaPoin">{this.state.rata_kuis ? this.state.rata_kuis.total : "0"}</b>
                          <div style={{fontSize:'10px'}}>Kuis</div>
                        </Col>
                        <Col width="40">
                        <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'18px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Skor Rata-rata<br/>
                          <i className="icon f7-icons" style={{fontSize:'20px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;
                          <b style={{fontSize:'20px', fontWeight:'bold'}}>{this.state.rata_kuis.rata ? parseFloat(this.state.rata_kuis.rata).toFixed(2) : '0'}</b>
                          {this.state.rata_kuis &&
                          <div style={{fontSize:'10px'}}>dari total {this.state.rata_kuis.total} kuis</div>
                          }
                        </Col>
                      </Row>
                    </Col>
                    {/* <Col width="100">
                      <br/>
                      <Row>
                        <Col width="30">
                          <Link href="#" popoverOpen=".popover-menu-poin"><i className="icon f7-icons" style={{fontSize:'20px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Poin:<br/>
                          <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>money_dollar_circle_fill</i>&nbsp;<b className="angkaPoin">0</b>
                          <div style={{fontSize:'10px'}}>Riwayat Poin</div>
                        </Col>
                        <Col width="30">
                          Kuis Diikuti:<br/>
                          <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;<b className="angkaPoin">{this.state.rata_kuis ? this.state.rata_kuis.total : "0"}</b>
                          <div style={{fontSize:'10px'}}>Kuis</div>
                        </Col>
                        <Col width="40">
                        <Link href="#" popoverOpen=".popover-menu-rata"><i className="icon f7-icons" style={{fontSize:'20px', color:'white'}}>question_circle_fill</i></Link>&nbsp;Skor Rata-rata<br/>
                          <i className="icon f7-icons" style={{fontSize:'25px', color:'#FDDD02'}}>gamecontroller_alt_fill</i>&nbsp;
                          <b style={{fontSize:'25px', fontWeight:'bold'}}>{this.state.rata_kuis ? parseFloat(this.state.rata_kuis.rata).toFixed(2) : '0'}</b>
                          {this.state.rata_kuis &&
                          <div style={{fontSize:'10px'}}>dari total {this.state.rata_kuis.total} kuis</div>
                          }
                        </Col>
                      </Row>
                    </Col> */}
                    <Col width="100">
                      <h1 className="judulDasbor">Dasbor Umum</h1>
                      {/* <Card className="divLeaderboard" style={{marginLeft:'0px', marginRight:'0px'}}>
                        <div className="judulLeaderboard">Top 10 Leaderboard Poin</div>
                        <CardContent className="kontenLeaderboard overflowCard">
                          {this.props.leaderboard_pengguna.rows.map((optionBoard)=>{
                            return (
                              <div className="divDummy" style={{border:(optionBoard.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '2px solid #972d1e' : 'none')}}>
                                <Row noGap>
                                  <Col width="100" style={{paddingTop:'4px'}}>
                                    <div className="fotoLeaderboard" style={{backgroundImage:'url('+optionBoard.gambar+')', backgroundSize:'cover'}}>&nbsp;</div>
                                  </Col>
                                  
                                  <Col width="100" style={{paddingTop:'4px'}}>
                                    <div className="namaLeaderboard">
                                    <b style={{fontSize:'11px'}}>#{(this.props.leaderboard_pengguna.rows.indexOf(optionBoard)+1)}</b>&nbsp;
                                    <span style={{
                                      fontWeight:(optionBoard.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'bold' : 'normal'                                      
                                    }}
                                    >{optionBoard.nama}</span>
                                    </div>
                                    <div className="poinLeaderboard">
                                      {this.formatAngka(optionBoard.poin)}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )
                          })}
                          
                        </CardContent>
                        <CardContent style={{textAlign:'right'}}>
                          <Button onClick={()=>this.$f7router.navigate('/Leaderboard/')} className="color-theme-deeporange bawahCiri" raised fill style={{marginTop:'-8px', display:'inline-flex'}}>
                            Selengkapnya
                          </Button>
                        </CardContent>
                      </Card> */}
                    </Col>
                    {/* <Col width="100" className="hilangDiDesktop">
                      <Button 
                          raised 
                          fill 
                          large 
                          href="#" 
                          className="color-theme-deeporange bawahCiri"
                          style={{marginTop:'16px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'500px', fontSize:'12px'}} 
                          // style={{marginTop:'8px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                          // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                          onClick={this.gantiDasborGameMaster}
                          // className="bawahCiri cardBorder-20"
                        >
                          <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                          Masuk Dasbor Game Master (Guru)
                        </Button>
                    </Col> */}
                  </Row>
                  <Popover className="popover-menu-rata">
                    <div style={{margin:'8px'}}>Skor rata-rata adalah skor rata-rata dari total kuis yang telah Kamu ikuti</div>
                  </Popover>
                  <Popover className="popover-menu-poin">
                    <div style={{margin:'8px'}}>Poin adalah poin yang Kamu dapat dari aktivitas kamu di diskuis seperti mengerjakan kuis, membuat kuis, dll</div>
                  </Popover>
                </Col>
                <Col width="0" tabletWidth="50" className="hilangDiMobile" style={{marginTop:'0px'}}>
                  
                  {/* <div style={{textAlign:'center', marginLeft:'16px'}}>
                    <Button 
                      raised 
                      style={{
                        background: (this.state.tab_aktif === 'guru' ? '#952B1E' : 'white'),
                        color: (this.state.tab_aktif !== 'guru' ? '#952B1E' : 'white'),
                        margin:'0px', 
                        marginLeft:'0px', 
                        marginBottom:'8px', 
                        display:'inline-flex'
                      }}
                      onClick={()=>this.gantiTabGuruSiswa('guru')}
                    >
                      <i className="icon f7-icons" style={{fontSize:'20px'}}>person_2_alt</i>&nbsp;
                      Guru
                    </Button>
                    <Button 
                      raised 
                      style={{
                        background: (this.state.tab_aktif === 'siswa' ? '#952B1E' : 'white'), 
                        color: (this.state.tab_aktif !== 'siswa' ? '#952B1E' : 'white'),
                        margin:'0px', 
                        marginLeft:'4px', 
                        marginBottom:'8px', 
                        display:'inline-flex'
                      }}
                      onClick={()=>this.gantiTabGuruSiswa('siswa')}
                    >
                      <i className="icon f7-icons" style={{fontSize:'20px'}}>person_3_fill</i>&nbsp;
                      Siswa
                    </Button>
                  </div> */}
                  {this.state.sekolah_pengguna.total > 0 &&
                  <>
                    <Card style={{margin:'0px', marginLeft:'16px'}}>
                      <CardContent className={"color-theme-deeporange"} style={{color:'black'}}>
                        <div style={{width:'100%', maxWidth:'600px', margin:'auto'}}>
                          {/* <Card style={{margin:'0px'}}>
                            <CardContent style={{padding:'8px'}}> */}
                                <Row>
                                  <Col width="70" tabletWidth="70" style={{display:'inline-flex'}}>
                                    <div style={{width:'45px',border:'0px solid #ccc'}}>
                                      <img src={"https://be.diskuis.id"+this.state.sekolah_pengguna.rows[0].gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/>
                                    </div>
                                    <div style={{width:'100%',border:'0px solid #ccc', marginLeft:'8px', minHeight:'55px'}}>
                                      <b>{this.state.sekolah_pengguna.rows[0].jabatan_sekolah}</b> di <b>{this.state.sekolah_pengguna.rows[0].nama_sekolah}</b>
                                      <br/>
                                      <Button raised fill small style={{fontSize:'9px', height:'15px', padding:'4px', display:'inline-flex', marginTop:'0px', marginRight:'4px'}} className={(parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? 'color-theme-teal' : 'color-theme-orange')}>
                                          {parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? <><i className="icons f7-icons" style={{fontSize:'10px'}}>checkmark_seal_fill</i>&nbsp;Terverifikasi</> : 'Belum Terverifikasi'}
                                      </Button>
                                      <span style={{fontSize:'10px'}}>
                                        Sejak {moment(this.state.sekolah_pengguna.rows[0].create_date).format('D') + ' ' + this.bulan[(moment(this.state.sekolah_pengguna.rows[0].create_date).format('M')-1)] + ' ' + moment(this.state.sekolah_pengguna.rows[0].create_date).format('YYYY')}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col width="30" tabletWidth="30" style={{display:'inline-grid'}}>
                                    {/* <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/'+(parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 ? 'menuSekolahGuru' : 'menuSekolahSiswa')+'/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                      <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                      Menu
                                    </Button> */}
                                    <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/sekolah/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                      <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                      Laman
                                    </Button>
                                  </Col>
                                  {parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 &&
                                  <Col width="100" tabletWidth="100" style={{display:'inline-grid'}}>
                                    <Row>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/profilGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'30px', padding:'8px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'30px'}}>person_crop_rectangle</i>
                                            <br/>Profil
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/kehadiranGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'50px', padding:'8px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'30px'}}>checkmark_rectangle</i>
                                            <br/>Kehadiran
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/kehadiranHarianGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'50px', padding:'8px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>calendar</i>
                                            <br/>Rekap
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                    </Row>
                                  </Col>
                                  }
                                  {parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 2 &&
                                  <Col width="100" tabletWidth="100" style={{display:'inline-grid'}}>
                                    <Row>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/profilSiswa/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'30px', padding:'8px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'30px'}}>person_crop_rectangle</i>
                                            <br/>Profil
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/kehadiranSiswa/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'50px', padding:'8px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'30px'}}>checkmark_rectangle</i>
                                            <br/>Kehadiran
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                      <Col width="33">
                                        <Link style={{width:'100%'}} href={"/kehadiranHarianSiswa/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                        <Card style={{width:'100%', margin:'4px'}}>
                                          <CardContent style={{textAlign:'center', minHeight:'50px', padding:'8px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>calendar</i>
                                            <br/>Rekap
                                          </CardContent>
                                        </Card>  
                                        </Link>
                                      </Col>
                                    </Row>
                                  </Col>
                                  }
                                </Row>
                            {/* </CardContent>
                          </Card> */}
                        </div>
                        {this.state.sekolah_pengguna.total > 1 &&
                        <div style={{width:'100%', textAlign:'center', marginTop:'8px'}}>
                          <Link href={"/daftarSekolahGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id}>+{parseInt(this.state.sekolah_pengguna.total)-1} sekolah lainnya</Link>
                        </div>
                        }
                        {this.state.sekolah_pengguna.total === 1 &&
                        <div style={{width:'100%', textAlign:'center', marginTop:'8px'}}>
                          <Link href={"/gabungSekolah/"}>Gabung ke sekolah lain</Link>
                        </div>
                        }
                      </CardContent>
                    </Card>
                  </>
                  }
                  {this.state.sekolah_pengguna.total < 1 &&
                  <Card style={{margin:'0px', marginLeft:'16px'}}>
                    <CardContent>
                      <div style={{width:'100%', textAlign:'center', marginBottom:'8px', color:'black'}}>
                        Punya kode undangan sekolah?
                      </div>
                      <Button onClick={()=>this.$f7router.navigate('/gabungSekolah/')} raised fill className="bawahCiriHijau color-theme-teal" style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} >
                        <i className="icons f7-icons" style={{fontSize:'15px'}}>person_badge_plus_fill</i>&nbsp;
                        Gabung ke Sekolah
                      </Button>
                    </CardContent>
                  </Card>
                  }
                  <Card style={{margin:'0px', marginTop:'16px', marginLeft:'16px'}}>
                    <CardContent style={{padding:'0px'}}>
                      <Button 
                        raised 
                        fill 
                        large 
                        href="#" 
                        className="color-theme-deeporange bawahCiri"
                        style={{fontSize:'12px'}} 
                        // style={{marginTop:'16px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'500px', fontSize:'12px'}} 
                        // style={{marginTop:'8px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                        // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                        onClick={this.gantiDasborGameMaster}
                        // className="bawahCiri cardBorder-20"
                      >
                        <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                        Masuk Dasbor Game Master (Guru)
                      </Button>
                    </CardContent>  
                  </Card>
                </Col>

                {/* <Col width="100">
                  <Card className="divLeaderboard" style={{marginLeft:'0px', marginRight:'0px'}}>
                    <div className="judulLeaderboard">Top 10 Leaderboard Poin</div>
                    <CardContent className="kontenLeaderboard overflowCard">
                      {this.props.leaderboard_pengguna.rows.map((optionBoard)=>{
                        return (
                          <div className="divDummy" style={{border:(optionBoard.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '2px solid #972d1e' : 'none')}}>
                            <Row noGap>
                              <Col width="100" style={{paddingTop:'4px'}}>
                                <div className="fotoLeaderboard" style={{backgroundImage:'url('+optionBoard.gambar+')', backgroundSize:'cover'}}>&nbsp;</div>
                              </Col>
                              
                              <Col width="100" style={{paddingTop:'4px'}}>
                                <div className="namaLeaderboard">
                                <b style={{fontSize:'11px'}}>#{(this.props.leaderboard_pengguna.rows.indexOf(optionBoard)+1)}</b>&nbsp;
                                <span style={{
                                  fontWeight:(optionBoard.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'bold' : 'normal')                                      
                                }}
                                >{optionBoard.nama}</span>
                                </div>
                                <div className="poinLeaderboard">
                                  {this.formatAngka(optionBoard.poin)}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        )
                      })}
                      
                    </CardContent>
                    <CardContent style={{textAlign:'right'}}>
                      <Button onClick={()=>this.$f7router.navigate('/Leaderboard/')} className="color-theme-deeporange bawahCiri" raised fill style={{marginTop:'-8px', display:'inline-flex'}}>
                        Selengkapnya
                      </Button>
                    </CardContent>
                  </Card>
                </Col> */}

              </Row>
            </div>
            }
            <div className="cardAtas">
            
              <div>&nbsp;</div>
              <Row noGap style={{marginBottom:'50px'}}>
                {/* <Col width="100" tabletWidth="100">
                  <Card className="cardAtas">
                    <CardContent className={"color-theme-deeporange"}>
                      <Button 
                        raised 
                        fill 
                        large 
                        href="#" 
                        style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                        // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                        onClick={this.gantiDasborGameMaster}
                        className="bawahCiri cardBorder-20"
                      >
                        <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                        Dasbor Game Master (Guru)
                      </Button>
                    </CardContent>
                  </Card>
                </Col> */}
                <Col width="100" className="hilangDiDesktop">
                  <Card>
                    <CardContent style={{padding:'0px'}}>
                      <Button 
                          raised 
                          fill 
                          large 
                          href="#" 
                          className="color-theme-deeporange bawahCiri"
                          style={{marginTop:'16px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'100%', fontSize:'12px'}} 
                          // style={{marginTop:'8px', marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} 
                          // onClick={()=>window.location.href='https://app.diskuis.id/gamemaster/'} 
                          onClick={this.gantiDasborGameMaster}
                          // className="bawahCiri cardBorder-20"
                        >
                          <i className="icon f7-icons" style={{fontSize:'30px'}}>person_alt_circle</i> &nbsp;
                          Masuk Dasbor Game Master (Guru)
                        </Button>
                    </CardContent>
                  </Card>
                </Col>
                
                {/* menu mikroservice */}
                {/* <Col width="100">
                  <Card>
                    <CardContent style={{padding:'0px'}}>
                      
                      <Row style={{justifyContent:'end'}}>
                        <Col width="25" tabletWidth="15" desktopWidth="10">
                          <Link href="/Kategori/" style={{width:'100%'}}>
                            <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343'}}>
                              <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                <img src="/static/icons/book.png" style={{height:'40px'}} />&nbsp;
                                <br/>
                                Kategori
                              </CardContent>    
                            </Card>
                          </Link>
                        </Col>
                        <Col width="25" tabletWidth="15" desktopWidth="10">
                          <Link href="/Kuis/" style={{width:'100%'}}>
                            <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343'}}>
                              <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                <img src="/static/icons/gc.png" style={{height:'40px'}} />&nbsp;
                                <br/>
                                Kuis
                              </CardContent>    
                            </Card>
                          </Link>
                        </Col>
                        <Col width="25" tabletWidth="15" desktopWidth="10">
                          <Link href="/Ruang/" style={{width:'100%'}}>
                            <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343'}}>
                              <CardContent style={{padding:'4px'}} className="kontenMenuBerandaKecil">
                                <img src="/static/icons/room2.png" style={{height:'40px'}} />&nbsp;
                                <br/>
                                Ruang
                              </CardContent>    
                            </Card>
                          </Link>
                        </Col>
                        <Col width="25" tabletWidth="15" desktopWidth="10">
                          <Link href="/PPDB-Lumajang/" style={{width:'100%'}}>
                            <Card className="menuBerandaKecil" style={{width:'100%', color:'#434343'}}>
                              <CardContent style={{padding:'4px', fontSize:'10px'}} className="kontenMenuBerandaKecil">
                                <img src="/static/icons/lumajang_logo.png" style={{height:'40px'}} />&nbsp;
                                <br/>
                                PPDB Lumajang
                                <br/>
                                2021
                              </CardContent>    
                            </Card>
                          </Link>
                        </Col>
                        
                      </Row>

                    
                    </CardContent>
                  </Card>
                </Col> */}
                
                <Col width="100" tabletWidth="100">
                  {this.state.sekolah_pengguna.total > 0 &&
                  <Card className="hilangDiDesktop">
                    <CardContent className={"color-theme-deeporange"}>
                      <div style={{width:'100%', maxWidth:'600px', margin:'auto'}}>
                        <Card style={{margin:'0px'}}>
                          <CardContent style={{padding:'8px'}}>
                              <Row>
                                <Col width="70" tabletWidth="80" style={{display:'inline-flex'}}>
                                  <div style={{width:'45px',border:'0px solid #ccc'}}>
                                    <img src={"https://be.diskuis.id"+this.state.sekolah_pengguna.rows[0].gambar_logo} style={{width:'100%', border:'1px solid #ccc', borderRadius:'10px'}}/>
                                  </div>
                                  <div style={{width:'100%',border:'0px solid #ccc', marginLeft:'8px'}}>
                                    <b>{this.state.sekolah_pengguna.rows[0].jabatan_sekolah}</b> di <b>{this.state.sekolah_pengguna.rows[0].nama_sekolah}</b>
                                    <br/>
                                    <Button raised fill small style={{fontSize:'9px', height:'15px', padding:'4px', display:'inline-flex', marginTop:'0px', marginRight:'4px'}} className={(parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? 'color-theme-teal' : 'color-theme-orange')}>
                                        {parseInt(this.state.sekolah_pengguna.rows[0].valid) === 1 ? <><i className="icons f7-icons" style={{fontSize:'10px'}}>checkmark_seal_fill</i>&nbsp;Terverifikasi</> : 'Belum Terverifikasi'}
                                    </Button>
                                    <span style={{fontSize:'10px'}}>
                                      Sejak {moment(this.state.sekolah_pengguna.rows[0].create_date).format('D') + ' ' + this.bulan[(moment(this.state.sekolah_pengguna.rows[0].create_date).format('M')-1)] + ' ' + moment(this.state.sekolah_pengguna.rows[0].create_date).format('YYYY')}
                                    </span>
                                  </div>
                                </Col>
                                <Col width="30" tabletWidth="20" style={{display:'inline-grid'}}>
                                  {/* <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/'+(parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 ? 'menuSekolahGuru' : 'menuSekolahSiswa')+'/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                    <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                    Menu
                                  </Button> */}
                                  <Button raised fill className="bawahCiriBiru color-theme-blue" onClick ={()=>this.$f7router.navigate('/sekolah/'+this.state.sekolah_pengguna.rows[0].sekolah_id)}>
                                      <i className="icons f7-icons" style={{fontSize:'15px'}}>ellipsis_vertical_circle</i>&nbsp;
                                      Laman
                                    </Button>
                                </Col>
                                {parseInt(this.state.sekolah_pengguna.rows[0].jabatan_sekolah_id) === 1 &&
                                <Col width="100" tabletWidth="100" style={{display:'inline-grid'}}>
                                  <Row>
                                    <Col width="33">
                                      <Link style={{width:'100%'}} href={"/profilGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                      <Card style={{width:'100%', margin:'4px'}}>
                                        <CardContent style={{textAlign:'center', minHeight:'30px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>person_crop_rectangle</i>
                                          <br/>Profil
                                        </CardContent>
                                      </Card>  
                                      </Link>
                                    </Col>
                                    <Col width="33">
                                      <Link style={{width:'100%'}} href={"/kehadiranGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                      <Card style={{width:'100%', margin:'4px'}}>
                                        <CardContent style={{textAlign:'center', minHeight:'50px'}}>
                                          <i className="icons f7-icons" style={{fontSize:'30px'}}>checkmark_rectangle</i>
                                          <br/>Kehadiran
                                        </CardContent>
                                      </Card>  
                                      </Link>
                                    </Col>
                                    <Col width="33">
                                      <Link style={{width:'100%'}} href={"/kehadiranHarianGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id}>
                                      <Card style={{width:'100%', margin:'4px'}}>
                                        <CardContent style={{textAlign:'center', minHeight:'50px'}}>
                                        <i className="icons f7-icons" style={{fontSize:'30px'}}>calendar</i>
                                          <br/>Rekap
                                        </CardContent>
                                      </Card>  
                                      </Link>
                                    </Col>
                                  </Row>
                                </Col>
                                }
                              </Row>
                          </CardContent>
                        </Card>
                      </div>
                      {this.state.sekolah_pengguna.total > 1 &&
                      <div style={{width:'100%', textAlign:'center', marginTop:'8px'}}>
                        <Link href={"/daftarSekolahGuru/"+JSON.parse(localStorage.getItem('user')).pengguna_id}>+{parseInt(this.state.sekolah_pengguna.total)-1} sekolah lainnya</Link>
                      </div>
                      }
                      {this.state.sekolah_pengguna.total === 1 &&
                      <div style={{width:'100%', textAlign:'center', marginTop:'8px'}}>
                        <Link href={"/gabungSekolah/"}>Gabung ke sekolah lain</Link>
                      </div>
                      }
                    </CardContent>
                  </Card>
                  }
                  {this.state.sekolah_pengguna.total < 1 &&
                  <Card className="hilangDiDesktop">
                    <CardContent>
                      <div style={{width:'100%', textAlign:'center', marginBottom:'8px'}}>
                        Punya kode undangan sekolah?
                      </div>
                      <Button onClick={()=>this.$f7router.navigate('/gabungSekolah/')} raised fill className="bawahCiriHijau color-theme-teal" style={{marginLeft:'0px', marginRight:'8px', width:'100%', maxWidth:'400px', margin:'auto'}} >
                        <i className="icons f7-icons" style={{fontSize:'15px'}}>person_badge_plus_fill</i>&nbsp;
                        Gabung ke Sekolah
                      </Button>
                    </CardContent>
                  </Card>
                  }
                </Col>
                <Col width="100" tabletWidth="60">
                  <Card className="cardBorder-20 hilangDiDesktop">
                    <CardContent className="cari_kuis ikutiKuisBeranda">
                      <Row>
                        <Col width="0" tabletWidth="0"></Col>
                        <Col width="100" tabletWidth="100">
                          {/* <Card>
                              <CardContent style={{background:'transparent'}}> */}
                                <List noHairlinesMd>
                                  <ListInput
                                    outline
                                    large
                                    // label="Cari Kuis"
                                    floatingLabel
                                    type="text"
                                    placeholder="Ikuti Kuis menggunakan kode ..."
                                    clearButton
                                    onFocus={()=>this.$f7router.navigate('/gabungKuis/')}
                                    // style={{width:'100%',maxWidth:'500px'}}
                                  ></ListInput>
                                  <ListItem>
                                    <Button className={"bawahCiriBiru cardBorder-20"} large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                      <i className="icons f7-icons">play_fill</i>&nbsp;
                                      Ikuti Kuis
                                    </Button>
                                  </ListItem>
                                </List>
                                <br/>
                              {/* </CardContent>
                            </Card> */}
                        </Col>
                        <Col width="0" tabletWidth="0"></Col>
                      </Row>
                    </CardContent>
                  </Card>
                  <AktivitasSosial tipe="publik" />
                </Col>
                <Col width="100" tabletWidth="40">
                  <Card className="cardBorder-20 hilangDiMobile">
                    <CardContent className="cari_kuis ikutiKuisBeranda">
                      <Row>
                        <Col width="0" tabletWidth="0"></Col>
                        <Col width="100" tabletWidth="100">
                          {/* <Card>
                              <CardContent style={{background:'transparent'}}> */}
                                <List noHairlinesMd>
                                  <ListInput
                                    outline
                                    large
                                    // label="Cari Kuis"
                                    floatingLabel
                                    type="text"
                                    placeholder="Ikuti Kuis menggunakan kode ..."
                                    clearButton
                                    onFocus={()=>this.$f7router.navigate('/gabungKuis/')}
                                    // style={{width:'100%',maxWidth:'500px'}}
                                  ></ListInput>
                                  <ListItem>
                                    <Button className={"bawahCiriBiru cardBorder-20"} large fill raised style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/gabungKuis/')}>
                                      <i className="icons f7-icons">play_fill</i>&nbsp;
                                      Ikuti Kuis
                                    </Button>
                                  </ListItem>
                                </List>
                                <br/>
                              {/* </CardContent>
                            </Card> */}
                        </Col>
                        <Col width="0" tabletWidth="0"></Col>
                      </Row>
                    </CardContent>
                  </Card>

                  <Card className={"cardBorder-20"}>
                    <CardContent>
                      <Row noGap>
                        <Col width="70">
                          <h1 className="h1-beranda">Peringkat Poin</h1>
                        </Col>
                        <Col width="30">
                          <Button className="color-theme-deeporange" raised fill href={"/Leaderboard/"} style={{marginTop:'8px'}}>
                            Semua
                          </Button>
                        </Col>
                      </Row>
                      <div className="overflowCardVert">
                        
                        {this.props.leaderboard_pengguna.rows.map((option)=>{
                            return (
                                <Card style={{border:(option.pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? '2px solid #FF6B22' : 'none')}}>
                                    <CardContent style={{padding:'8px'}}>
                                        {/* {option.nama} */}
                                        <Row>
                                            <Col width="10" tabletWidth="10" desktopWidth="10" style={{fontSize:'15px', fontWeight:'bold', paddingTop:'14px'}}>
                                                #{(this.props.leaderboard_pengguna.rows.indexOf(option)+1)}
                                            </Col>
                                            <Col width="20" tabletWidth="20" desktopWidth="15">
                                                <img src={option.gambar} style={{width:'50px', height:'50px', borderRadius:'50%'}} />
                                            </Col>
                                            <Col width="45" tabletWidth="45" desktopWidth="60">
                                                <Link href={"/TampilPengguna/"+option.pengguna_id}><b>{option.nama}</b></Link>
                                                <br/><span style={{fontSize:'10px'}}>{option.username}</span>
                                            </Col>
                                            <Col width="25" tabletWidth="25" desktopWidth="15" style={{textAlign:'right', display:(parseInt(this.props.leaderboard_pengguna.rows.indexOf(option)) === 0 ? 'inline-table' : 'block')}}>
                                                <b style={{fontSize:'15px', color:'#558b2f'}}>{this.formatAngka(option.poin)}</b>
                                                {parseInt(this.props.leaderboard_pengguna.rows.indexOf(option)) === 0 &&
                                                <img src="/static/icons/piala.png" style={{height:'15px', marginLeft:'4px'}} />
                                                }
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>
                            )
                        })}

                      </div>
                    </CardContent>
                  </Card>

                  <Card className={"cardBorder-20"}>
                    <CardContent>
                      <Row noGap>
                        <Col width="70">
                          <h1 className="h1-beranda">Kuis Tersimpan</h1>
                        </Col>
                        <Col width="30">
                          <Button className="color-theme-deeporange" raised fill href={"/KuisFavorit/"+((localStorage.getItem('user') !== null && localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')).pengguna_id  :  null)} style={{marginTop:'8px'}}>
                            Semua
                          </Button>
                        </Col>
                      </Row>
                      <div className="overflowCard">
                        {parseInt(this.state.kuis_tersimpan.total) < 1 &&
                        <div className="kosong">
                        Belum ada kuis tersimpan di aplikasi ini
                        </div>
                        }
                        {this.state.kuis_tersimpan.rows.map((option)=>{
                          return (
                            <>
                            {option.sesi_kuis_id &&                          
                            <Card className={"cardBorder-20 overflowCard-inner"} style={{width:"200px"}}>
                              <CardContent 
                                className="cardBorder-20"
                                style={{
                                    background:'#37474F',
                                    backgroundImage:'url("'+'https://be.diskuis.id'+'/assets/berkas/'+option.gambar_kuis+'")', 
                                    // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                    backgroundSize:'cover',
                                    height:'100px'
                                }}
                              >
                                  <h2 style={{
                                      marginTop:'0px', 
                                      background:'rgba(0, 0, 0, 0.6)', 
                                      color:'white',
                                      padding:'4px',
                                      marginBottom:'0px',
                                      fontSize:'15px'
                                  }}>
                                      {option.judul}
                                  </h2>
                                  <h3 style={{
                                      marginTop:'0px', 
                                      background:'rgba(0, 0, 0, 0.6)', 
                                      color:'white',
                                      padding:'4px',
                                      marginBottom:'0px',
                                      fontSize: '12px',
                                      fontWeight:'none'
                                  }}>
                                      Oleh {option.pengguna}
                                  </h3>
                                  <div style={{fontSize:'10px', fontStyle:'italic', background:'rgba(0, 0, 0, 0.6)', padding:'4px', color:'white'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div>
                              </CardContent>
                              <CardContent style={{
                                  background:'white', 
                                  height:'30px',
                                  overflow: 'hidden'
                              }}>
                                  <Row noGap>
                                      {/* <Col width={100}>
                                        <div style={{fontSize:'10px'}}>Terakhir diakses pada tanggal {option.akses_terakhir}</div>    
                                      </Col>
                                      <Col width={100}>
                                        <div style={{fontSize:'10px'}}>{option.jumlah_peserta} peserta total</div>    
                                      </Col> */}
                                      <Col width={100}>
                                        {localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                        <Button className="color-theme-teal cardBorder-20" style={{marginTop:'8px', border:'1px solid teal'}}>
                                          <i className="icons f7-icons" style={{fontSize:'20px', color:'#F44336'}}>heart_fill</i>&nbsp;
                                          <span>Kuis Tersimpan</span>
                                        </Button>
                                        }
                                      </Col>
                                  </Row>
                              </CardContent>
                              <CardFooter>
                                <Button className="bawahCiriBiru cardBorder-20" raised fill style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/praTampilKuis/'+option.kode_sesi+'/'+option.kuis_id)}>
                                  <i className="icon f7-icons" style={{fontSize:'20px'}}>play_fill</i>&nbsp;
                                  Ikuti kuis
                                </Button>
                              </CardFooter>
                            </Card>
                            }
                            </>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={"cardBorder-20"}>
                    <CardContent>
                      <Row noGap>
                        <Col width="70">
                          <h1 className="h1-beranda">Kategori</h1>
                        </Col>
                        <Col width="30">
                          <Button className="color-theme-deeporange" raised fill href="/kategori/" style={{marginTop:'8px'}}>
                            Semua
                          </Button>
                        </Col>
                      </Row>
                      <div className="overflowCard">
                        {this.state.mapel.map((option)=>{
                          return (
                            <Card className={"cardBorder-20 overflowCard-inner"} style={{margin:'8px', width:'200px', background:'url('+option.gambar_latar+') no-repeat center center / cover',minHeight:'60px', textAlign:'right',color:'white', fontWeight:'bold'}}>
                              <CardContent className="cardBorder-20" style={{minHeight:'80px',background:'rgba(0, 0, 0, 0.4)'}}>
                                <Link href={"/daftarKuis/"+option.mata_pelajaran_id} style={{display:'block'}}>
                                    <div style={{color:'white', fontSize:'20px', textShadow:'2px 2px #434343'}}>
                                        {option.nama}
                                    </div>
                                    <div style={{color:'white',fontSize:'12px', textShadow:'2px 2px #434343'}}>
                                        ({option.total ? option.total : '0'} kuis)
                                    </div>
                                </Link>
                              </CardContent>
                            </Card>
                          )
                        })}
                        {/* <Card className={"cardBorder-20 overflowCard-inner"}>
                          <CardContent>
                            &nbsp;tes
                          </CardContent>
                        </Card> */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={"cardBorder-20"}>
                    <CardContent>
                      <Row noGap>
                        <Col width="70">
                          <h1 className="h1-beranda">Kuis Trending</h1>
                        </Col>
                        <Col width="30">
                        </Col>
                      </Row>
                      <div className={"overflowCard"}>
                        {this.state.kuis_trending.rows.map((option)=>{
                          return (
                            <>
                            {option.sesi_kuis_id &&                          
                            <Card className={"cardBorder-20 overflowCard-inner"} style={{width:"200px"}}>
                              <CardContent 
                                className="cardBorder-20"
                                style={{
                                    background:'#37474F',
                                    backgroundImage:'url("'+'https://be.diskuis.id'+'/assets/berkas/'+option.gambar_kuis+'")', 
                                    // backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+option.gambar_kuis+'")', 
                                    backgroundSize:'cover',
                                    height:'100px'
                                }}
                              >
                                  <h2 style={{
                                      marginTop:'0px', 
                                      background:'rgba(0, 0, 0, 0.6)', 
                                      color:'white',
                                      padding:'4px',
                                      marginBottom:'0px',
                                      fontSize:'15px'
                                  }}>
                                      {option.judul}
                                  </h2>
                                  <h3 style={{
                                      marginTop:'0px', 
                                      background:'rgba(0, 0, 0, 0.6)', 
                                      color:'white',
                                      padding:'4px',
                                      marginBottom:'0px',
                                      fontSize: '12px',
                                      fontWeight:'none'
                                  }}>
                                      Oleh {option.pengguna}
                                  </h3>
                                  <div style={{fontSize:'10px', fontStyle:'italic', background:'rgba(0, 0, 0, 0.6)', padding:'4px', color:'white'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div>

                                  {/* <div style={{fontSize:'10px', fontStyle:'italic'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div> */}
                              </CardContent>
                              <CardContent style={{
                                  background:'white', 
                                  // background:'rgba(0, 0, 0, 0.6)', 
                                  height:'80px',
                                  overflow: 'hidden'
                              }}>
                                  <Row noGap>
                                      {/* <Col width={100} style={{marginBottom:'8px', borderBottom:'1px solid #cccccc'}}>
                                        <div style={{fontSize:'10px', fontStyle:'italic'}}>{option.keterangan ? option.keterangan : <>Tidak ada deskripsi</>}</div>    
                                      </Col> */}
                                      <Col width={100}>
                                        <div style={{fontSize:'10px'}}>Terakhir diakses pada tanggal {option.akses_terakhir}</div>    
                                      </Col>
                                      <Col width={100}>
                                        <div style={{fontSize:'10px'}}>{option.jumlah_peserta} peserta total</div>    
                                      </Col>
                                      <Col width={100}>
                                        {this.state.loading_kuis[option.sesi_kuis_id] &&
                                        <Progressbar infinite></Progressbar>
                                        }
                                        {/* {localForage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id).then((value)=>{
                                          if(!value){
                                            return (
                                              <Button className="cardBorder-20" style={{marginTop:'8px', border:'1px solid #cccccc'}} onClick={()=>this.unduhKuis(option.sesi_kuis_id, option.kuis_id, option.kode_sesi)}>
                                                <i className="icons f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>arrow_down_circle</i>&nbsp;
                                                <span style={{color:'#434343'}}>Unduh Kuis</span>
                                              </Button>      
                                            )
                                          }else{
                                            return (
                                              <Button className="color-theme-teal cardBorder-20" style={{marginTop:'8px', border:'1px solid teal'}}>
                                                <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_down_circle</i>&nbsp;
                                                <span>Kuis Tersimpan</span>
                                              </Button>
                                            )
                                          }
                                        })} */}
                                        {!localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                        <Button className="cardBorder-20" style={{marginTop:'8px', border:'1px solid #cccccc'}} onClick={()=>this.unduhKuis(option.sesi_kuis_id, option.kuis_id, option.kode_sesi)}>
                                          <i className="icons f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>heart</i>&nbsp;
                                          <span style={{color:'#434343'}}>Simpan Kuis</span>
                                        </Button>
                                        }
                                        {localStorage.getItem('getKuis:'+JSON.parse(localStorage.getItem('user')).pengguna_id+':'+option.kuis_id+':'+option.sesi_kuis_id) &&
                                        <Button className="color-theme-teal cardBorder-20" style={{marginTop:'8px', border:'1px solid teal'}}>
                                          <i className="icons f7-icons" style={{fontSize:'20px', color:'#F44336'}}>heart_fill</i>&nbsp;
                                          <span>Kuis Tersimpan</span>
                                        </Button>
                                        }
                                      </Col>
                                  </Row>
                              </CardContent>
                              <CardFooter>
                                <Button className="bawahCiriBiru cardBorder-20" raised fill style={{width:'100%'}} onClick={()=>this.$f7router.navigate('/praTampilKuis/'+option.kode_sesi+'/'+option.kuis_id)}>
                                  <i className="icon f7-icons" style={{fontSize:'20px'}}>play_fill</i>&nbsp;
                                  Ikuti kuis
                                </Button>
                              </CardFooter>
                            </Card>
                            }
                            </>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  {/* <Card className={"cardBorder-20"}>
                    <CardContent>
                      <Row noGap>
                        <Col width="70">
                          <h1 className="h1-beranda">Aktivitas</h1>
                        </Col>
                        <Col width="30">
                        </Col>
                      </Row>
                      {this.state.aktivitas.total < 1 && 
                      <>
                      <div style={{marginTop:'16px', textAlign:'center', borderRadius:'10px', border:'3px dashed #cccccc', padding:'16px'}}>
                        <img src={localStorage.getItem('api_base')+'/assets/berkas/sad-face.png'} style={{width:'100px'}}/><br/>
                        <span style={{fontSize:'20px', color:'#cccccc'}}>Terasa hampa ya di sini...</span><br/>
                        <span style={{fontSize:'20px', color:'#cccccc'}}>Coba deh mulai mengerjakan kuis atau gabung ke dalam ruang, nanti juga di sini jadi ramai :)</span>
                      </div>
                      </>
                      }
                      {this.state.aktivitas.total > 0 && 
                      <div className="timeline" style={{paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px', marginTop:'0px'}}>
                        {this.state.aktivitas.rows.map((option)=>{

                          // let tanggal = '';
                          let tgl = new Date(option.create_date);
                          let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                          let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                          return (
                            <div className="timeline-item">
                              <div className="timeline-item-date" style={{fontSize:'10px', width:'40px'}}>
                                {tanggal}
                                <br/>
                                {waktu}
                              </div>
                              <div className="timeline-item-divider"></div>
                              <div className="timeline-item-content card">
                                <div className="card-content card-content-padding" style={{padding:'8px'}}>
                                  <Row>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'left'}}>
                                      <Link href={"tampilPengguna/"+(option.pengguna_id)}>
                                        <img src={option.gambar} style={{width:'4vh', borderRadius:'50%', marginRight:'8px'}} />
                                        <div style={{fontWeight:'normal', color:'#039be5'}}>{option.nama_pengguna}</div>
                                      </Link>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                      <div dangerouslySetInnerHTML={{ __html: option.keterangan_teks }} />
                                      {option.keterangan === 'mengikuti-pengguna' &&
                                      <div style={{border:'1px solid #ccc', minHeight:'50px', borderRadius:'8px', background:'#e3f2fd'}}>
                                        <Row>
                                          <Col width="25" tabletWidth="20" style={{textAlign:'center', padding:'8px'}}>
                                            <img src={option.gambar_followed} style={{width:'60px', borderRadius:'50%'}} />
                                          </Col>
                                          <Col width="75" tabletWidth="80" style={{padding:'8px'}}>
                                            <Link style={{fontWeight:'bold', fontSize:'15px'}} href={'/tampilPengguna/'+option.pengguna_id_pengikut}>{option.nama_followed}</Link><br/>
                                            {!option.flag_pengikut && option.pengguna_id_pengikut !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                            // <Button disabled={false} raised fill small>
                                            <Button style={{maxWidth:'150px'}} disabled={false} raised fill onClick={()=>this.$f7router.navigate('/tampilPengguna/'+option.pengguna_id_pengikut)}>
                                                <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                                Ikuti
                                            </Button>
                                            }
                                            {option.flag_pengikut &&
                                            <Button disabled={false} raised fill small onClick={()=>this.$f7router.navigate('/tampilPengguna/'+option.pengguna_id_pengikut)} style={{background:'#cccccc', border:'1px solid #cccccc', maxWidth:'150px'}}>
                                                <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_crop_circle_fill_badge_checkmark</i>&nbsp;
                                                <span style={{color:'#434343'}}>Mengikuti</span>
                                            </Button>
                                            }
                                          </Col>
                                        </Row>
                                      </div>
                                      }
                                      {option.keterangan === 'ikut-kuis' &&
                                      <div style={{border:'1px solid #cccccc', maxHeight:'70px', overflowY:'hidden', borderRadius:'8px', background:'#fffde7'}}>
                                        <Row>
                                          <Col width="30" tabletWidth="20" style={{overflowX:'hidden', textAlign:'center'}}>
                                            <img src={"https://be.diskuis.id"+"/assets/berkas/"+option.gambar_kuis_diikuti} style={{marginBottom:'-5px', borderRadius:'8px 0px 0px 8px', height:'60px', marginLeft:'-10px'}}/>
                                          </Col>
                                          <Col width="70" tabletWidth="80" style={{padding:'8px'}}>
                                            <Link style={{fontWeight:'bold', fontSize:'15px'}} href={'#'}>{option.judul_kuis_diikuti}</Link><br/>
                                            oleh <b>{option.pembuat_kuis_diikuti}</b>
                                          </Col>
                                        </Row>
                                      </div>
                                      }
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      }
                    </CardContent>
                  </Card> */}
                </Col>
                {/* <Col width="100" tabletWidth="50"> */}
                  {/* <AktivitasSosial tipe="publik" /> */}

                  {/* <Card className={"cardBorder-20"}>
                    <CardContent>
                      <Row noGap>
                        <Col width="70">
                          <h1 className="h1-beranda">Aktivitas</h1>
                        </Col>
                        <Col width="30">
                        </Col>
                      </Row>
                      {this.state.aktivitas.total < 1 && 
                      <>
                      <div style={{marginTop:'16px', textAlign:'center', borderRadius:'10px', border:'3px dashed #cccccc', padding:'16px'}}>
                        <img src={localStorage.getItem('api_base')+'/assets/berkas/sad-face.png'} style={{width:'100px'}}/><br/>
                        <span style={{fontSize:'20px', color:'#cccccc'}}>Terasa hampa ya di sini...</span><br/>
                        <span style={{fontSize:'20px', color:'#cccccc'}}>Coba deh mulai mengerjakan kuis atau gabung ke dalam ruang, nanti juga di sini jadi ramai :)</span>
                      </div>
                      </>
                      }
                      {this.state.aktivitas.total > 0 && 
                      <div className="timeline" style={{paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px', marginTop:'0px'}}>
                        {this.state.aktivitas.rows.map((option)=>{

                          // let tanggal = '';
                          let tgl = new Date(option.create_date);
                          let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                          let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                          return (
                            <div className="timeline-item">
                              <div className="timeline-item-date" style={{fontSize:'10px', width:'40px'}}>
                                {tanggal}
                                <br/>
                                {waktu}
                              </div>
                              <div className="timeline-item-divider"></div>
                              <div className="timeline-item-content card">
                                <div className="card-content card-content-padding" style={{padding:'8px'}}>
                                  <Row>
                                    <Col width="100" tabletWidth="100" style={{textAlign:'left'}}>
                                      <Link href={"tampilPengguna/"+(option.pengguna_id)}>
                                        <img src={option.gambar} style={{width:'4vh', borderRadius:'50%', marginRight:'8px'}} />
                                        <div style={{fontWeight:'normal', color:'#039be5'}}>{option.nama_pengguna}</div>
                                      </Link>
                                    </Col>
                                    <Col width="100" tabletWidth="100">
                                      <div dangerouslySetInnerHTML={{ __html: option.keterangan_teks }} />
                                      {option.keterangan === 'mengikuti-pengguna' &&
                                      <div style={{border:'1px solid #ccc', minHeight:'50px', borderRadius:'8px', background:'#e3f2fd'}}>
                                        <Row>
                                          <Col width="25" tabletWidth="20" style={{textAlign:'center', padding:'8px'}}>
                                            <img src={option.gambar_followed} style={{width:'60px', borderRadius:'50%'}} />
                                          </Col>
                                          <Col width="75" tabletWidth="80" style={{padding:'8px'}}>
                                            <Link style={{fontWeight:'bold', fontSize:'15px'}} href={'/tampilPengguna/'+option.pengguna_id_pengikut}>{option.nama_followed}</Link><br/>
                                            {!option.flag_pengikut && option.pengguna_id_pengikut !== JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                            // <Button disabled={false} raised fill small>
                                            <Button style={{maxWidth:'150px'}} disabled={false} raised fill onClick={()=>this.$f7router.navigate('/tampilPengguna/'+option.pengguna_id_pengikut)}>
                                                <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                                Ikuti
                                            </Button>
                                            }
                                            {option.flag_pengikut &&
                                            <Button disabled={false} raised fill small onClick={()=>this.$f7router.navigate('/tampilPengguna/'+option.pengguna_id_pengikut)} style={{background:'#cccccc', border:'1px solid #cccccc', maxWidth:'150px'}}>
                                                <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_crop_circle_fill_badge_checkmark</i>&nbsp;
                                                <span style={{color:'#434343'}}>Mengikuti</span>
                                            </Button>
                                            }
                                          </Col>
                                        </Row>
                                      </div>
                                      }
                                      {option.keterangan === 'ikut-kuis' &&
                                      <div style={{border:'1px solid #cccccc', maxHeight:'70px', overflowY:'hidden', borderRadius:'8px', background:'#fffde7'}}>
                                        <Row>
                                          <Col width="30" tabletWidth="20" style={{overflowX:'hidden', textAlign:'center'}}>
                                            <img src={"https://be.diskuis.id"+"/assets/berkas/"+option.gambar_kuis_diikuti} style={{marginBottom:'-5px', borderRadius:'8px 0px 0px 8px', height:'60px', marginLeft:'-10px'}}/>
                                          </Col>
                                          <Col width="70" tabletWidth="80" style={{padding:'8px'}}>
                                            <Link style={{fontWeight:'bold', fontSize:'15px'}} href={'#'}>{option.judul_kuis_diikuti}</Link><br/>
                                            oleh <b>{option.pembuat_kuis_diikuti}</b>
                                          </Col>
                                        </Row>
                                      </div>
                                      }
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      }
                    </CardContent>
                  </Card> */}
                {/* </Col> */}
              </Row>
            </div>
          </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getPertanyaan: Actions.getPertanyaan,
    getNotifikasi: Actions.getNotifikasi,
    simpanPantauan: Actions.simpanPantauan,
    getKuisDiikuti: Actions.getKuisDiikuti,
    getRuangDiikuti: Actions.getRuangDiikuti,
    getKuisTrending: Actions.getKuisTrending,
    getLinimasa: Actions.getLinimasa,
    getAktivitas: Actions.getAktivitas,
    getMapel: Actions.getMapel,
    simpanPengikut: Actions.simpanPengikut,
    getRataKuis: Actions.getRataKuis,
    getPengaturanPengguna: Actions.getPengaturanPengguna,
    getSekolahPengguna: Actions.getSekolahPengguna,
    getSekolah: Actions.getSekolah,
    getKuis: Actions.getKuis,
    getNotifikasiRedis: Actions.getNotifikasiRedis,
    getNotifikasiRedisBelumDibaca: Actions.getNotifikasiRedisBelumDibaca,
    getLeaderboardPengguna: Actions.getLeaderboardPengguna
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi, Kuis, Ruang, Aktivitas, Sekolah, Poin }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      wilayah: App.wilayah,
      pertanyaan: Pertanyaan.pertanyaan,
      dummy_rows: App.dummy_rows,
      notifikasi: Notifikasi.notifikasi,
      kuis_diikuti: Kuis.kuis_diikuti,
      ruang_diikuti: Ruang.ruang_diikuti,
      kuis_trending: Kuis.kuis_trending,
      linimasa: Notifikasi.linimasa,
      aktivitas: Aktivitas.aktivitas,
      mapel: App.mapel,
      rata_kuis: App.rata_kuis,
      pengaturan_pengguna: App.pengaturan_pengguna,
      sekolah_pengguna: Sekolah.sekolah_pengguna,
      sekolah: Sekolah.sekolah,
      kuis: Kuis.kuis,
      leaderboard_pengguna: Poin.leaderboard_pengguna
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Beranda);