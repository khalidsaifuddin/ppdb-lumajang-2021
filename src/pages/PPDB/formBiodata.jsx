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
  Popover,
  Searchbar,
  Segmented,
  Popup,
  Radio
} from 'framework7-react';

import { Doughnut, Bar, Radar } from 'react-chartjs-2';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import TypographyComponent from 'framework7/components/typography/typography';

import io from 'socket.io-client';

import moment from 'moment';
import HeaderPPDB from './HeaderPPDB';
import HeaderSekolahPPDB from './HeaderSekolahPPDB';
import kuis from '../Kuis/kuis';

class formBiodata extends Component {

  state = {
    error: null,
    loading: true,
    sekolah: {
      gambar_logo: '/assets/berkas/1.jpg'
    },
    routeParams: {
      pengguna_id: this.$f7route.params['pengguna_id'],
      sekolah_id: this.$f7route.params['sekolah_id'],
      start: 0,
      limit: 20,
      orang_tua_utama: 'ayah',
      pendidikan_terakhir_id_ayah: 99,
      pekerjaan_id_ayah: 98,
      pendidikan_terakhir_id_ibu: 99,
      pekerjaan_id_ibu: 98,
      pendidikan_terakhir_id_wali: 99,
      pekerjaan_id_wali: 98,
      jenis_kelamin: 'L',
      nama: null,
      nisn: null,
      nik: null,
      tanggal_lahir: null,
      kode_wilayah_provinsi: null,
      kode_wilayah_kabupaten: null,
      kode_wilayah_kecamatan: null,
      alamat_tempat_tinggal: null,
      nama_ayah: null,
      nama_ibu: null,
      nama_wali: null,
      peserta_didik_id: (this.$f7route.params['peserta_didik_id'] !== "null" ? (this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null) : null),
    },
    peserta_didik: {
      rows: [],
      total: 0
    },
    sudah_cari: 0,
    riwayat_kata_kunci: [],
    displayOnly: this.$f7route.params['displayOnly'] ? this.$f7route.params['displayOnly'] : null,
    provinsi: [],
    kabupaten: [],
    kecamatan: [],
    sekolah_terpilih: {
      sekolah_id: null,
      nama: null,
    },
    disabledInput: true,
    labelNik: 'NIK belum pernah didaftarkan sebelumnya',
    labelNISN: 'NISN belum pernah didaftarkan sebelumnya',
    lng: 113.141552,
    lat: -8.109038,
    zoom: 10,
    map_besar: (<div></div>),
    popupFilter: false,
    sekolah_asal: {
      rows: [],
      total: 0
    },
    checkSekolah: {}
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

  componentDidMount = () => {

    this.$f7.dialog.preloader()

    this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
      this.setState({
          provinsi: this.props.wilayah.rows
      },()=>{

        this.props.getCalonPesertaDidik({...this.state.routeParams, sekolah_id:null}).then((result)=>{
          if(result.payload.total > 0){
            //ada
            this.setState({
              routeParams: {
                ...this.state.routeParams,
                ...result.payload.rows[0]
              },
              kabupaten: [{kode_wilayah:result.payload.rows[0].kode_wilayah_kabupaten, nama:result.payload.rows[0].kabupaten}],
              kecamatan: [{kode_wilayah:result.payload.rows[0].kode_wilayah_kecamatan, nama:result.payload.rows[0].kecamatan}],
              disabledInput: false
            },()=>{
              
              if(this.$f7route.params['sekolah_id'] && this.$f7route.params['sekolah_id'] !== '-'){
                
                this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
                  this.setState({
                      sekolah: result.payload.rows[0],
                      routeParams: {
                        ...this.state.routeParams,
                        kode_wilayah_provinsi: this.state.routeParams.kode_wilayah_provinsi,
                        kode_wilayah_kabupaten: this.state.routeParams.kode_wilayah_kabupaten,
                        kode_wilayah_kecamatan: this.state.routeParams.kode_wilayah_kecamatan
                      }
                  },()=>{
  
                    // kecamatan dan kabupaten start
                    this.props.getWilayah({id_level_wilayah:'2', mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi}).then((result)=>{
                      this.setState({
                        kabupaten: result.payload.rows
                      },()=>{
                        this.props.getWilayah({id_level_wilayah:'3', mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten}).then((result)=>{
                          this.setState({
                            kecamatan: result.payload.rows
                          },()=>{
  
                            // // sekolah Asal
                            if(this.state.routeParams.asal_sekolah_id){
                              this.props.getSekolahPPDB({sekolah_id: this.state.routeParams.asal_sekolah_id}).then((result)=>{
                                if(result.payload.total > 0){
                                  this.setState({
                                    sekolah_terpilih: result.payload.rows[0]
                                  })
                                }else{
                                  //do nothing
                                }
                              })
                            }else{
                              //do nothing
                            }
                          })
                        })
                      })
                    })
                    // kecamatan dan kabupaten end
                    
                    this.$f7.dialog.close()
    
                  })
    
                })

              }else{
                // kecamatan dan kabupaten start
                this.props.getWilayah({id_level_wilayah:'2', mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi}).then((result)=>{
                  this.setState({
                    kabupaten: result.payload.rows
                  },()=>{
                    this.props.getWilayah({id_level_wilayah:'3', mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten}).then((result)=>{
                      this.setState({
                        kecamatan: result.payload.rows
                      },()=>{

                        // // sekolah Asal
                        if(this.state.routeParams.asal_sekolah_id){
                          this.props.getSekolahPPDB({sekolah_id: this.state.routeParams.asal_sekolah_id}).then((result)=>{
                            if(result.payload.total > 0){
                              this.setState({
                                sekolah_terpilih: result.payload.rows[0]
                              })
                            }else{
                              //do nothing
                            }
                          })
                        }else{
                          //do nothing
                        }
                      })
                    })
                  })
                })
                // kecamatan dan kabupaten end
                
                this.$f7.dialog.close()
              }
            
            })

          }else{
            //nggak ada
            this.props.getPesertaDidikDapodik(this.state.routeParams).then((result)=>{

              if(result.payload.total < 1){
                //manual
                this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
                  this.setState({
                      sekolah: result.payload.rows[0],
                  },()=>{
                    
                    this.$f7.dialog.close()
    
                  })
    
                })
              }else{
                //ada
                this.setState({
                  routeParams: {
                    ...this.state.routeParams,
                    ...result.payload.rows[0],
                    alamat_tempat_tinggal: result.payload.rows[0].alamat_jalan,
                    asal_sekolah_id: result.payload.rows[0].sekolah_id
                    // kode_wilayah_provinsi: result.payload.rows[0].kode_provinsi,
                    // kode_wilayah_kabupaten: result.payload.rows[0].kode_kabupaten,
                    // kode_wilayah_kecamatan: result.payload.rows[0].kode_kecamatan
                  },
                  kabupaten: [{kode_wilayah:result.payload.rows[0].kode_kabupaten, nama:result.payload.rows[0].kabupaten}],
                  kecamatan: [{kode_wilayah:result.payload.rows[0].kode_kecamatan, nama:result.payload.rows[0].kecamatan}],
                  disabledInput: false
                },()=>{
                  
                  this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
                    this.setState({
                        sekolah: result.payload.rows[0],
                        routeParams: {
                          ...this.state.routeParams,
                          kode_wilayah_provinsi: this.state.routeParams.kode_provinsi,
                          kode_wilayah_kabupaten: this.state.routeParams.kode_kabupaten,
                          kode_wilayah_kecamatan: this.state.routeParams.kode_kecamatan
                        }
                    },()=>{
                      
                      this.$f7.dialog.close()

                      if(this.state.routeParams.asal_sekolah_id){
                        this.props.getSekolahPPDB({sekolah_id: this.state.routeParams.asal_sekolah_id}).then((result)=>{
                          if(result.payload.total > 0){
                            this.setState({
                              sekolah_terpilih: result.payload.rows[0]
                            })
                          }else{
                            //do nothing
                          }
                        })
                      }else{
                        //do nothing
                      }
              
                      // this.props.getWilayah({id_level_wilayah:'1'}).then((result)=>{
                        
                      //   this.setState({
                      //       provinsi: this.props.wilayah.rows
                      //   })
      
                      // })
      
                    })
      
                  })
                
                })

              }

            })

          }

        })


      })

    })

    

  }

  cari = (e) => {
    this.$f7.dialog.preloader()

    localStorage.setItem('riwayat_kata_kunci', e.target[0].value + ', ' + localStorage.getItem('riwayat_kata_kunci'));

    let arrRiwayat = localStorage.getItem('riwayat_kata_kunci').split(", ");
    let objRiwayat = [];

    for (let indexRiwayat = (arrRiwayat.length-2); indexRiwayat >= 0; indexRiwayat--) {
      const element = arrRiwayat[indexRiwayat]

      objRiwayat[indexRiwayat] = {
        kata_kunci: element,
      }
    }

    this.setState({
      riwayat_kata_kunci: objRiwayat,
      loading: true,
      sudah_cari: 1,
      routeParams: {
        ...this.state.routeParams,
        keyword: e.target[0].value,
        searchText: e.target[0].value,
        id_level_wilayah: localStorage.getItem('id_level_wilayah_aplikasi'),
        kode_wilayah: localStorage.getItem('kode_wilayah_aplikasi'),
        status_sekolah: 1,
        start: 0
      }
    }, ()=> {
      // alert(this.state.routeParams.keyword)
      // lakukan proses pencarian
      this.props.getPesertaDidikDapodik(this.state.routeParams).then((result)=>{
        
        this.setState({
          loading: false,
          peserta_didik: result.payload
        },()=>{
          this.$f7.dialog.close()
        })


      })

    })
  }

  ketikCari = (e) => {
    this.setState({
      routeParams: {
        ...this.state.routeParams,
        keyword: e.currentTarget.value,
        searchText: e.currentTarget.value,
      }
    }, ()=> {
      // this.props.setKeyword(this.state.routeParams.keyword);
    });
  }

  klikNext = () => {
      // alert('tes');
      this.$f7.dialog.preloader()
      
      this.setState({
          ...this.state,
          loading: true,
          routeParams: {
              ...this.state.routeParams,
              start: (parseInt(this.state.routeParams.start) + parseInt(this.state.routeParams.limit))
          }
      },()=>{
          this.props.getPesertaDidikDapodik(this.state.routeParams).then((result)=>{
              this.setState({
                  loading: false,
                  peserta_didik: result.payload
              },()=>{
                  this.$f7.dialog.close()
              })
          })
      })
  }

  klikPrev = () => {
      // alert('tes');
      this.$f7.dialog.preloader()
      
      this.setState({
          ...this.state,
          loading: true,
          routeParams: {
              ...this.state.routeParams,
              start: (parseInt(this.state.routeParams.start) - parseInt(this.state.routeParams.limit))
          }
      },()=>{
          this.props.getPesertaDidikDapodik(this.state.routeParams).then((result)=>{
              this.setState({
                  loading: false,
                  peserta_didik: result.payload
              },()=>{
                  this.$f7.dialog.close()
              })
          })
      })
  }

  setFieldValue = (key) => (e) => {
    this.setState({
      routeParams: {
        ...this.state.routeParams,
        [key]: e.target.value,
      }
    }, ()=> {
      console.log(this.state.routeParams);

      if(key === 'kode_wilayah'){
        this.setState({
          routeParams: {
            ...this.state.routeParams,
            kode_wilayah_kecamatan: this.state.routeParams.kode_wilayah
          }
        })
      }

      if(key === 'kode_wilayah_provinsi'){
        this.props.getWilayah({id_level_wilayah:2, mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi}).then((result)=>{
            this.setState({
                kabupaten: result.payload.rows
            })
        })
    }

    if(key === 'kode_wilayah_kabupaten'){
        this.props.getWilayah({id_level_wilayah:3, mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten}).then((result)=>{
            this.setState({
                kecamatan: result.payload.rows
            })
        })
    }
    });
  }

  cekNik = (e) => {
    this.setState({
      routeParamsCek: {
        nik: e.target.value,
        calon_peserta_didik_id: (this.$f7route.params['peserta_didik_id'] !== "null" ? (this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null) : null),
      }
    }, ()=> {
      this.props.cekNik(this.state.routeParamsCek).then((result)=>{
        if(this.props.cek_nik.count > 0) {

          if(this.props.cek_nik.rows[0].status_terima == null){
            //sudah proses belum ada hasil
            this.setState({
              disabledInput: true,
              labelNik: 'NIK yang dimasukkan telah terdaftar sebelumnya. Mohon masukkan NIK lain',
            });
          }else{
            if(this.props.cek_nik.rows[0].status_terima == 9){
              // sudah diterima di sekolah
              this.setState({
                disabledInput: true,
                labelNik: 'NIK yang dimasukkan telah terdaftar dan telah diterima di sekolah. Mohon masukkan NIK lain',
              });

            }else{
              // bisa daftar lagi
              this.setState({
                disabledInput: (this.state.displayOnly === null ? false : true),
                labelNik: 'NIK valid dan dapat didaftarkan kembali',
                routeParams: {
                  ...this.state.routeParams,
                  calon_peserta_didik_id: this.props.cek_nik.rows[0].calon_peserta_didik_id,
                  abaikan_pengguna_id: 'Y'
                  // pengguna_id: null
                }
              },()=>{
                // console.log(this.state.routeParams);
                // load data yang sudah ada
                this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=> {
                  this.setState({
                    routeParams: {
                      ...this.state.routeParams,
                      ...this.props.calon_peserta_didik.rows[0],
                      pengguna_id: (localStorage.getItem('kode_aplikasi') === 'PPDB' ? JSON.parse(localStorage.getItem('user')).pengguna_id : null)
                      // lintang: (this.state.lintang ? this.state.lintang : this.props.calon_peserta_didik.rows[0].lintang),
                      // bujur: (this.state.bujur ? this.state.bujur : this.props.calon_peserta_didik.rows[0].bujur),
                    },
                    disabledInput: (this.state.displayOnly === null ? false : true),
                    sekolah_terpilih: this.props.calon_peserta_didik.rows[0].sekolah_asal
                  }, ()=> {
                    // console.log(this.state.sekolah_terpilih);
                    // console.log(this.state.routeParams.kode_wilayah_kabupaten);
                    // console.log(this.state.routeParams.kode_wilayah_provinsi);
                    this.setState({
                      routeParamsKabupaten:{
                        mst_kode_wilayah: this.state.routeParams.kode_wilayah_provinsi
                      },
                      routeParamsKecamatan:{
                        mst_kode_wilayah: this.state.routeParams.kode_wilayah_kabupaten
                      }
                    },()=>{
                      this.props.getMstWilayah(this.state.routeParamsKabupaten).then((result)=>{
                        this.setState({
                          kabupaten: this.props.mst_wilayah
                        },()=>{
                          this.props.getMstWilayah(this.state.routeParamsKecamatan).then((result)=>{
                            this.setState({
                              kecamatan: this.props.mst_wilayah
                            });
                          });
                        });
                      });
                    });
        
                  });
                });

              });
            }
          }

        } else {
          this.setState({
            disabledInput: (this.state.displayOnly === null ? false : true),
            labelNik: 'NIK valid dan dapat didaftarkan',
          });
        }
      })
    });
  }

  cekNISN = (e) => {
    this.setState({
      routeParamsCek: {
        nisn: e.target.value,
        calon_peserta_didik_id: (this.$f7route.params['peserta_didik_id'] !== "null" ? (this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null) : null),
      }
    }, ()=> {
      this.props.cekNISN(this.state.routeParamsCek).then((result)=> {
        if(this.props.cek_nisn.count > 0) {
          this.setState({
            disabledInput: true,
            labelNISN: 'NISN yang dimasukkan telah terdaftar sebelumnya. Mohon masukkan NISN lain',
          });
        } else {
          this.setState({
            disabledInput: (this.state.displayOnly === null ? false : true),
            labelNISN: 'NISN valid dan dapat didaftarkan',
          });
        }
      })
    });
  }

  bukaPeta = () => {
    this.setState({
      routeParams: {
        ...this.state.routeParams,
        sekolah_asal: null,
        peserta_didik_id: this.$f7route.params['peserta_didik_id']
      }
    }, ()=> {
      if(
          this.state.routeParams.nama === null || 
          this.state.routeParams.nik === null || 
          this.state.routeParams.tempat_lahir === null || 
          this.state.routeParams.tanggal_lahir === null
        ) {
        this.$f7.dialog.alert('Mohon lengkapi Nama/NISN/tempat dan tanggal lahir sebelum mengisi titik koordinat!','Peringatan');
        return false;
      }
      
      if(
          this.state.routeParams.kode_wilayah_provinsi === null || 
          this.state.routeParams.kode_wilayah_kabupaten === null || 
          this.state.routeParams.kode_wilayah_kecamatan === null || 
          this.state.routeParams.alamat_tempat_tinggal === null
        ) {
        this.$f7.dialog.alert('Mohon lengkapi alamat sebelum mengisi titik koordinat!','Peringatan');
        return false;
      }

      this.props.simpanCalonPesertaDidik(this.state.routeParams).then((result)=> {
        if(result.payload.peserta_didik_id) {
          this.$f7router.navigate("/petaPD/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']+"/"+result.payload.peserta_didik_id+"/"+(this.state.routeParams.lintang ? this.state.routeParams.lintang : '-8.115799')+"/"+(this.state.routeParams.bujur ? this.state.routeParams.bujur : '113.223296'));
        } else {
          this.$f7.dialog.alert('Ada kesalahan pada sistem atau jaringan internet Anda. Mohon coba beberapa saat lagi');
        }
      });
    });
  }

  bukaPilihanSekolah = () => {
    // alert('buka')
    this.setState({
      popupFilter: true
    })
  }

  cariKeyword = (e) => {
    this.setState({
        routeParamsSekolah: {
            ...this.state.routeParamsSekolah,
            keyword: e.currentTarget.value
        }
    },()=>{
      console.log(this.state.routeParamsSekolah)
    })
  }

  cariSekolahAsal = () => {
    this.$f7.dialog.preloader()
    this.props.getSekolah(this.state.routeParamsSekolah).then((result)=>{
      this.setState({
        sekolah_asal: result.payload
      },()=>{
        this.$f7.dialog.close()
      })
    })
  }

  pilihSekolahAsal = (sekolah_id) => (e, b) => {
    this.$f7.dialog.preloader()
    this.props.simpanCalonPesertaDidik({...this.state.routeParams, asal_sekolah_id: sekolah_id}).then((result)=>{

      this.setState({
        routeParams: {
          ...this.state.routeParams,
          ...result.payload.rows[0]
        }
      },()=>{
        this.props.getSekolah({sekolah_id:sekolah_id}).then((result)=>{
          this.setState({
            sekolah_terpilih: result.payload.rows[0],
            popupFilter: false
          },()=>{
            this.$f7.dialog.close()
  
            console.log(this.state.routeParams)
          })
        })
      })

    })
  }

  simpan = () => {

    if(
      this.state.routeParams.nama === null || 
      this.state.routeParams.nik === null || 
      this.state.routeParams.tempat_lahir === null || 
      this.state.routeParams.tanggal_lahir === null
      ) {
      this.$f7.dialog.alert('Mohon lengkapi Nama/NISN/tempat dan tanggal lahir sebelum malanjutkan!','Peringatan');
      return false;
    }
    
    if(
        this.state.routeParams.kode_wilayah_provinsi === null || 
        this.state.routeParams.kode_wilayah_kabupaten === null || 
        this.state.routeParams.kode_wilayah_kecamatan === null || 
        this.state.routeParams.alamat_tempat_tinggal === null
      ) {
      this.$f7.dialog.alert('Mohon lengkapi alamat sebelum melanjutkan!','Peringatan');
      return false;
    }
    
    if(
        this.state.routeParams.lintang === null || 
        this.state.routeParams.bujur === null
      ) {
      this.$f7.dialog.alert('Mohon lengkapi titik koordinat lintang dan bujur tempat tinggal sebelum melanjutkan!','Peringatan');
      return false;
    }

    this.$f7.dialog.preloader()
    
    this.props.simpanCalonPesertaDidik({...this.state.routeParams, peserta_didik_id: this.$f7route.params['peserta_didik_id']}).then((result)=> {
      this.$f7.dialog.close()
      this.$f7router.navigate("/formSekolahPilihan/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])
    })
  }

  render()
    {
        return (
          <Page name="formBiodata" hideBarsOnScroll>
            
            <HeaderPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah_id={this.$f7route.params['sekolah_id']} />

            <div className="cardAtas" style={{marginBottom:'50px'}}>
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">
                      {/* <Card>
                          <CardContent style={{padding:'8px'}}> */}
                              <Row noGap>
                                  <Col width="100" tabletWidth="100">
                                    {this.$f7route.params['sekolah_id'] && this.$f7route.params['sekolah_id'] !== '-' &&
                                    <HeaderSekolahPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah={this.state.sekolah} f7={this} />
                                    }
                                  </Col>
                                  <Col width="0" tabletWidth="100">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent padding={false}>
                                          <Segmented className="steps color-theme-deeporange" raised style={{borderRadius:'20px'}}>
                                            <Button tabLinkActive style={{borderRadius:'20px 0px 0px 20px'}}>Biodata</Button>
                                            <Button disabled={true}>Jalur dan Pilihan Sekolah</Button>
                                            <Button disabled={true}>Kelengkapan Berkas</Button>
                                            <Button disabled={true}>Konfirmasi</Button>
                                          </Segmented>
                                        </CardContent>
                                    </Card>
                                  </Col>
                                  <Col width="100" tabletWidth="100">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent style={{padding:'8px'}}>
                                          <Row>
                                            <Col width="100" tabletWidth="50">
                                              <Card>
                                                {/* <CardHeader>
                                                  Identitas Peserta Didik
                                                </CardHeader> */}
                                                <CardContent>
                                                  <BlockTitle className="judulForm">Identitas Peserta Didik</BlockTitle>
                                                  <List>
                                                    <ListInput
                                                      className="inputNumber inputNik"
                                                      label="Nomor Induk Kependudukan / NIK"
                                                      type="number"
                                                      placeholder="Ketikkan NIK dan enter..."
                                                      clearButton={(this.state.displayOnly === null ? true : false)}
                                                      onChange={this.setFieldValue('nik')}
                                                      onBlur={this.cekNik}
                                                      pattern="[0-9]*"
                                                      validate
                                                      data-error-message="Mohon hanya masukkan Angka!"
                                                      defaultValue={this.state.routeParams.nik}
                                                      data-validate-on-blur="true"
                                                      disabled={(this.state.displayOnly === null ? false : true)}
                                                    >
                                                      {this.state.displayOnly === null &&
                                                      <span slot="info"><b style={{color:(this.state.disabledInput ? 'red' : 'green')}}>{this.state.labelNik}</b></span>
                                                      }
                                                      {this.state.displayOnly === null &&
                                                      <Button raised fill small slot="inner" className="checkBtn bawahCiri" color="orange" onClick={this.cekNikEnter}>
                                                        Cek NIK
                                                      </Button>
                                                      }
                                                    </ListInput>
                                                    <ListInput
                                                      className="inputNumber inputNisn"
                                                      label="NISN"
                                                      type="number"
                                                      placeholder="NISN Calon Peserta Didik..."
                                                      info="Sesuai Ijazah"
                                                      clearButton={(this.state.displayOnly === null ? true : false)}
                                                      onChange={this.setFieldValue('nisn')}
                                                      data-error-message="Mohon masukkan NISN dengan benar!"
                                                      defaultValue={this.state.routeParams.nisn}
                                                      disabled={this.state.disabledInput}
                                                      data-validate-on-blur="true"
                                                    >
                                                      {this.state.displayOnly === null &&
                                                      <Button raised fill small slot="inner" className="checkBtn bawahCiri" color="orange" onClick={this.cekNisnEnter}>
                                                        Cek NISN
                                                      </Button>
                                                      }
                                                    </ListInput>
                                                    <ListInput
                                                      label="Nama Calon Peserta Didik"
                                                      type="text"
                                                      placeholder="Nama Calon Peserta Didik..."
                                                      info="Sesuai Ijazah"
                                                      clearButton={(this.state.displayOnly === null ? true : false)}
                                                      onChange={this.setFieldValue('nama')}
                                                      defaultValue={this.state.routeParams.nama}
                                                      disabled={this.state.disabledInput}
                                                    />

                                                    <ListInput
                                                        label="Jenis Kelamin"
                                                        type="select"
                                                        defaultValue={"0"}
                                                        disabled={this.state.disabledInput}
                                                        placeholder="Pilih Jenis Kelamin..."
                                                        onChange={this.setFieldValue('jenis_kelamin')}
                                                    >
                                                        <option value={"0"} disabled>-</option>
                                                        <option value={"L"}>Laki-laki</option>
                                                        <option value={"P"}>Perempuan</option>
                                                    </ListInput>

                                                    <ListInput
                                                      label="Tempat Lahir"
                                                      type="text"
                                                      placeholder="Tempat Lahir..."
                                                      clearButton={(this.state.displayOnly === null ? true : false)}
                                                      onChange={this.setFieldValue('tempat_lahir')}
                                                      defaultValue={this.state.routeParams.tempat_lahir}
                                                      disabled={this.state.disabledInput}
                                                    />
                                                    <ListInput
                                                      label="Tanggal Lahir"
                                                      type="date"
                                                      placeholder="Tanggal Lahir..."
                                                      onChange={this.setFieldValue('tanggal_lahir')}
                                                      defaultValue={this.state.routeParams.tanggal_lahir}
                                                      disabled={this.state.disabledInput}
                                                    />
                                                    
                                                    <ListInput
                                                      label="Alamat Tempat Tinggal"
                                                      type="textarea"
                                                      placeholder="Alamat Tempat Tinggal ..."
                                                      info="Sesuai dengan kartu keluarga (KK)"
                                                      clearButton={(this.state.displayOnly === null ? true : false)}
                                                      onChange={this.setFieldValue('alamat_tempat_tinggal')}
                                                      defaultValue={this.state.routeParams.alamat_tempat_tinggal}
                                                      disabled={this.state.disabledInput}
                                                    />
                                                    <ListInput
                                                      label="RT"
                                                      type="text"
                                                      placeholder="RT..."
                                                      onChange={this.setFieldValue('rt')}
                                                      defaultValue={this.state.routeParams.rt}
                                                    />
                                                    <ListInput
                                                      label="RW"
                                                      type="text"
                                                      placeholder="RW..."
                                                      onChange={this.setFieldValue('rw')}
                                                      defaultValue={this.state.routeParams.rw}
                                                      disabled={this.state.disabledInput}
                                                    />
                                                    <ListInput
                                                        label="Dusun"
                                                        type="text"
                                                        placeholder="Dusun..."
                                                        onChange={this.setFieldValue('dusun')}
                                                        defaultValue={this.state.routeParams.dusun}
                                                        disabled={this.state.disabledInput}
                                                    />
                                                    <ListInput
                                                      label="Desa/Kelurahan"
                                                      type="text"
                                                      placeholder="Desa/Kelurahan..."
                                                      onChange={this.setFieldValue('desa_kelurahan')}
                                                      defaultValue={this.state.routeParams.desa_kelurahan}
                                                      disabled={this.state.disabledInput}
                                                    />

                                                    <ListInput
                                                        label="Provinsi"
                                                        type="select"
                                                        disabled={this.state.disabledInput}
                                                        value={this.state.routeParams.kode_wilayah_provinsi}
                                                        placeholder="Pilih provinsi..."
                                                        onChange={this.setFieldValue('kode_wilayah_provinsi')}
                                                    >
                                                        <option value={"0"} disabled>{"-"}</option>
                                                        {this.state.provinsi.map((option)=>{
                                                            return (
                                                                <option key={option.kode_wilayah} value={option.kode_wilayah.trim()}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                    <ListInput
                                                        label="Kabupaten/Kota"
                                                        type="select"
                                                        disabled={this.state.disabledInput}
                                                        value={this.state.routeParams.kode_wilayah_kabupaten}
                                                        placeholder="Pilih kabupaten/kota..."
                                                        onChange={this.setFieldValue('kode_wilayah_kabupaten')}
                                                    >
                                                        {this.state.kabupaten.map((option)=>{
                                                            return (
                                                                <option key={option.kode_wilayah} value={option.kode_wilayah.trim()}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                    <ListInput
                                                        label="Kecamatan"
                                                        type="select"
                                                        disabled={this.state.disabledInput}
                                                        value={this.state.routeParams.kode_wilayah_kecamatan}
                                                        placeholder="Pilih kecamatan..."
                                                        onChange={this.setFieldValue('kode_wilayah')}
                                                    >
                                                        {this.state.kecamatan.map((option)=>{
                                                            return (
                                                                <option key={option.kode_wilayah} value={option.kode_wilayah.trim()}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                    
                                                    <ListInput
                                                      label="Koordinat Rumah Tinggal (Lintang)"
                                                      type="text"
                                                      placeholder="Lintang..."
                                                      onChange={this.setFieldValue('lintang')}
                                                      defaultValue={this.state.routeParams.lintang}
                                                      disabled={this.state.disabledInput}
                                                    />
                                                    <ListInput
                                                      label="Koordinat Rumah Tinggal (Bujur)"
                                                      type="text"
                                                      placeholder="Bujur..."
                                                      onChange={this.setFieldValue('bujur')}
                                                      defaultValue={this.state.routeParams.bujur}
                                                      disabled={this.state.disabledInput}
                                                    />
                                                  </List>
                                                  <Button disabled={this.state.disabledInput} className="bawahCiri color-theme-deeporange" raised fill onClick={this.bukaPeta} style={{display:'inline-flex', marginTop:'16px'}}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>map_pin_ellipse</i>
                                                    Lihat / Ubah Posisi Koordinat Rumah
                                                  </Button>
                                                </CardContent>
                                              </Card>
                                            </Col>
                                            <Col width="100" tabletWidth="50">
                                              <Card>
                                                <CardContent>
                                                  <BlockTitle className="judulForm">Identitas Orangtua</BlockTitle>
                                                  <List>
                                                      <ListInput
                                                          label="Orangtua Penanggungjawab"
                                                          type="select"
                                                          defaultValue={"ayah"}
                                                          placeholder="Pilih..."
                                                          disabled={this.state.disabledInput}
                                                          onChange={this.setFieldValue('orang_tua_utama')}
                                                      >
                                                          <option value={"0"} disabled>-</option>
                                                          <option value={"ayah"}>Ayah</option>
                                                          <option value={"ibu"}>Ibu</option>
                                                          <option value={"wali"}>Wali</option>
                                                      </ListInput>

                                                      {/* AYAH */}
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                          label="Nama Ayah"
                                                          type="text"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Nama Ayah..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          onChange={this.setFieldValue('nama_ayah')}
                                                          defaultValue={this.state.routeParams.nama_ayah}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                          label="Tempat Lahir Ayah"
                                                          type="text"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Tempat Lahir Ayah..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          onChange={this.setFieldValue('tempat_lahir_ayah')}
                                                          defaultValue={this.state.routeParams.tempat_lahir_ayah}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                          label="Tanggal Lahir Ayah"
                                                          type="date"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Tanggal Lahir Ayah..."
                                                          onChange={this.setFieldValue('tanggal_lahir_ayah')}
                                                          defaultValue={this.state.routeParams.tanggal_lahir_ayah}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                            label="Pendidikan Terakhir Ayah"
                                                            type="select"
                                                            defaultValue={"0"}
                                                            placeholder="Pilih..."
                                                            disabled={this.state.disabledInput}
                                                            onChange={this.setFieldValue('pendidikan_terakhir_id_ayah')}
                                                        >
                                                            <option value={"99"}>Tidak Sekolah</option>
                                                            <option value={"1"}>SD</option>
                                                            <option value={"2"}>SMP</option>
                                                            <option value={"3"}>SMA/SMK</option>
                                                            <option value={"4"}>D1/D2/D3</option>
                                                            <option value={"5"}>S1</option>
                                                            <option value={"6"}>S2</option>
                                                            <option value={"7"}>S3</option>
                                                        </ListInput>
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                            label="Pekerjaan Ayah"
                                                            type="select"
                                                            defaultValue={"0"}
                                                            placeholder="Pilih..."
                                                            disabled={this.state.disabledInput}
                                                            onChange={this.setFieldValue('pekerjaan_id_ayah')}
                                                        >
                                                            <option value={"98"}>Tidak Bekerja</option>
                                                            <option value={"1"}>Pegawai Negeri</option>
                                                            <option value={"2"}>Pegawai Swasta</option>
                                                            <option value={"7"}>TNI/Polri</option>
                                                            <option value={"6"}>Wirausaha</option>
                                                            <option value={"3"}>Profesional</option>
                                                            <option value={"4"}>Guru</option>
                                                            <option value={"5"}>Petani</option>
                                                            <option value={"99"}>Lainnya</option>
                                                        </ListInput>
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                          label="Alamat Tempat Tinggal Ayah"
                                                          type="textarea"
                                                          placeholder="Alamat Tempat Tinggal Ayah ..."
                                                          info="Sesuai dengan kartu keluarga (KK)"
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          disabled={this.state.disabledInput}
                                                          onChange={this.setFieldValue('alamat_tempat_tinggal_ayah')}
                                                          defaultValue={this.state.routeParams.alamat_tempat_tinggal_ayah}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ayah' &&
                                                        <ListInput
                                                          label="Nomor Telepon Ayah"
                                                          type="tel"
                                                          data-error-message="Mohon isikan nomor telepon yang benar!"
                                                          placeholder="Nomor Telepon Ayah..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          validate
                                                          disabled={this.state.disabledInput}
                                                          pattern="[0-9]*"
                                                          onChange={this.setFieldValue('no_telepon_ayah')}
                                                          defaultValue={this.state.routeParams.no_telepon_ayah}
                                                        />
                                                      }

                                                      {/* IBU */}
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                          label="Nama Ibu"
                                                          type="text"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Nama Ibu..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          onChange={this.setFieldValue('nama_ibu')}
                                                          defaultValue={this.state.routeParams.nama_ibu}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                          label="Tempat Lahir Ibu"
                                                          type="text"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Tempat Lahir Ibu..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          onChange={this.setFieldValue('tempat_lahir_ibu')}
                                                          defaultValue={this.state.routeParams.tempat_lahir_ibu}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                          label="Tanggal Lahir Ibu"
                                                          type="date"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Tanggal Lahir Ibu..."
                                                          onChange={this.setFieldValue('tanggal_lahir_ibu')}
                                                          defaultValue={this.state.routeParams.tanggal_lahir_ibu}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                            label="Pendidikan Terakhir Ibu"
                                                            type="select"
                                                            defaultValue={"0"}
                                                            placeholder="Pilih..."
                                                            onChange={this.setFieldValue('pendidikan_terakhir_id_ibu')}
                                                        >
                                                            <option value={"99"}>Tidak Sekolah</option>
                                                            <option value={"1"}>SD</option>
                                                            <option value={"2"}>SMP</option>
                                                            <option value={"3"}>SMA/SMK</option>
                                                            <option value={"4"}>D1/D2/D3</option>
                                                            <option value={"5"}>S1</option>
                                                            <option value={"6"}>S2</option>
                                                            <option value={"7"}>S3</option>
                                                        </ListInput>
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                            label="Pekerjaan Ibu"
                                                            type="select"
                                                            defaultValue={"0"}
                                                            placeholder="Pilih..."
                                                            onChange={this.setFieldValue('pekerjaan_id_ibu')}
                                                        >
                                                            <option value={"98"}>Tidak Bekerja</option>
                                                            <option value={"1"}>Pegawai Negeri</option>
                                                            <option value={"2"}>Pegawai Swasta</option>
                                                            <option value={"7"}>TNI/Polri</option>
                                                            <option value={"6"}>Wirausaha</option>
                                                            <option value={"3"}>Profesional</option>
                                                            <option value={"4"}>Guru</option>
                                                            <option value={"5"}>Petani</option>
                                                            <option value={"99"}>Lainnya</option>
                                                        </ListInput>
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                          label="Alamat Tempat Tinggal Ibu"
                                                          type="textarea"
                                                          placeholder="Alamat Tempat Tinggal Ibu ..."
                                                          info="Sesuai dengan kartu keluarga (KK)"
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          disabled={this.state.disabledInput}
                                                          onChange={this.setFieldValue('alamat_tempat_tinggal_ibu')}
                                                          defaultValue={this.state.routeParams.alamat_tempat_tinggal_ibu}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'ibu' &&
                                                        <ListInput
                                                          label="Nomor Telepon Ibu"
                                                          type="tel"
                                                          data-error-message="Mohon isikan nomor telepon yang benar!"
                                                          placeholder="Nomor Telepon Ibu..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          validate
                                                          disabled={this.state.disabledInput}
                                                          pattern="[0-9]*"
                                                          onChange={this.setFieldValue('no_telepon_ibu')}
                                                          defaultValue={this.state.routeParams.no_telepon_ibu}
                                                        />
                                                      }

                                                      {/* WALI */}
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                          label="Nama Wali"
                                                          type="text"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Nama Wali..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          onChange={this.setFieldValue('nama_wali')}
                                                          defaultValue={this.state.routeParams.nama_wali}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                          label="Tempat Lahir Wali"
                                                          type="text"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Tempat Lahir Wali..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          onChange={this.setFieldValue('tempat_lahir_wali')}
                                                          defaultValue={this.state.routeParams.tempat_lahir_wali}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                          label="Tanggal Lahir Wali"
                                                          type="date"
                                                          disabled={this.state.disabledInput}
                                                          placeholder="Tanggal Lahir Wali..."
                                                          onChange={this.setFieldValue('tanggal_lahir_wali')}
                                                          defaultValue={this.state.routeParams.tanggal_lahir_wali}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                            label="Pendidikan Terakhir Wali"
                                                            type="select"
                                                            defaultValue={"0"}
                                                            placeholder="Pilih..."
                                                            onChange={this.setFieldValue('pendidikan_terakhir_id_wali')}
                                                        >
                                                            <option value={"99"}>Tidak Sekolah</option>
                                                            <option value={"1"}>SD</option>
                                                            <option value={"2"}>SMP</option>
                                                            <option value={"3"}>SMA/SMK</option>
                                                            <option value={"4"}>D1/D2/D3</option>
                                                            <option value={"5"}>S1</option>
                                                            <option value={"6"}>S2</option>
                                                            <option value={"7"}>S3</option>
                                                        </ListInput>
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                            label="Pekerjaan Wali"
                                                            type="select"
                                                            defaultValue={"0"}
                                                            placeholder="Pilih..."
                                                            onChange={this.setFieldValue('pekerjaan_id_wali')}
                                                        >
                                                            <option value={"98"}>Tidak Bekerja</option>
                                                            <option value={"1"}>Pegawai Negeri</option>
                                                            <option value={"2"}>Pegawai Swasta</option>
                                                            <option value={"7"}>TNI/Polri</option>
                                                            <option value={"6"}>Wirausaha</option>
                                                            <option value={"3"}>Profesional</option>
                                                            <option value={"4"}>Guru</option>
                                                            <option value={"5"}>Petani</option>
                                                            <option value={"99"}>Lainnya</option>
                                                        </ListInput>
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                          label="Alamat Tempat Tinggal Wali"
                                                          type="textarea"
                                                          placeholder="Alamat Tempat Tinggal Wali ..."
                                                          info="Sesuai dengan kartu keluarga (KK)"
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          disabled={this.state.disabledInput}
                                                          onChange={this.setFieldValue('alamat_tempat_tinggal_wali')}
                                                          defaultValue={this.state.routeParams.alamat_tempat_tinggal_wali}
                                                        />
                                                      }
                                                      {this.state.routeParams.orang_tua_utama === 'wali' &&
                                                        <ListInput
                                                          label="Nomor Telepon Wali"
                                                          type="tel"
                                                          data-error-message="Mohon isikan nomor telepon yang benar!"
                                                          placeholder="Nomor Telepon Wali..."
                                                          clearButton={(this.state.displayOnly === null ? true : false)}
                                                          validate
                                                          disabled={this.state.disabledInput}
                                                          pattern="[0-9]*"
                                                          onChange={this.setFieldValue('no_telepon_wali')}
                                                          defaultValue={this.state.routeParams.no_telepon_wali}
                                                        />
                                                      }
                                                  </List>
                                                </CardContent>
                                              </Card>

                                              <Card>
                                                <CardContent>
                                                  <BlockTitle className="judulForm" style={{marginBottom:'8px'}}>Sekolah Asal</BlockTitle>
                                                  <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                                    {this.state.sekolah_terpilih.sekolah_id &&
                                                    <CardContent style={{padding:'8px'}}>
                                                      <b>{this.state.sekolah_terpilih.nama} ({this.state.sekolah_terpilih.npsn})</b><br/>
                                                      {this.state.sekolah_terpilih.alamat}
                                                    </CardContent>
                                                    }
                                                    {!this.state.sekolah_terpilih.sekolah_id &&
                                                    <CardContent style={{padding:'8px'}}>
                                                      <i>Sekolah asal belum dipilih</i>
                                                    </CardContent>
                                                    }
                                                  </Card>
                                                  {this.state.displayOnly === null &&
                                                  <Button 
                                                    style={{display:'inline-flex'}} 
                                                    disabled={this.state.disabledInput} 
                                                    raised 
                                                    fill 
                                                    className="bawahCiri color-theme-deeporange"
                                                    onClick={this.bukaPilihanSekolah}
                                                  >
                                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>doc_text_search</i>&nbsp;
                                                    Pilih/Ganti Sekolah
                                                  </Button>
                                                  }
                                                </CardContent>
                                              </Card>

                                            </Col>
                                            <Col width="100" style={{textAlign:'right', marginBottom:'16px'}}>
                                              {this.state.disabledInput &&
                                              <Button raised className="bawahCiriAbu" style={{display:'inline-flex', marginRight:'4px'}} onClick={()=>this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['sekolah_id'])}>
                                                <i className="f7-icons" style={{fontSize:'20px'}}>house</i>&nbsp;
                                                Kembali ke Beranda
                                              </Button>
                                              }
                                              <Button disabled={this.state.disabledInput} raised fill className="bawahCiriBiru" style={{display:'inline-flex'}} onClick={this.simpan}>
                                                <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                                Simpan dan Lanjut
                                              </Button>
                                            </Col>
                                          </Row>  

                                        </CardContent>
                                    </Card>
                                  </Col>
                              </Row>
                          {/* </CardContent>
                      </Card> */}
                  </Col>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
              </Row>
            </div>
            <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                <Page>
                    <Navbar title="Sekolah Asal">
                        <NavRight>
                            <Link popupClose>Tutup</Link>
                        </NavRight>
                    </Navbar>
                    <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                        <List>
                            <Searchbar
                                className="searchbar-demo"
                                // expandable
                                placeholder="Cari Nama Sekolah (Tekan Enter)..."
                                searchContainer=".search-list"
                                searchIn=".item-title"
                                onChange={this.cariKeyword}
                                onSubmit={()=>this.cariSekolahAsal()}
                            ></Searchbar>
                        </List>
                    </Block>
                    <Block>
                        <BlockTitle>{"Hasil Pencarian ("+this.state.sekolah_asal.total+")"}</BlockTitle>
                        {this.state.sekolah_asal.rows.map((option)=>{
                          return (
                            <Link onClick={this.pilihSekolahAsal(option.sekolah_id)} style={{width:'100%'}}>
                              <Card style={{marginLeft:'0px', marginRight:'0px', width:'100%', marginBottom:'0px'}}>
                                <CardContent style={{padding:'8px'}}>
                                  <Row>
                                    {/* <Col width="10">
                                      <Radio name={option.sekolah_id} onChange={this.pilihSekolahAsal(option.sekolah_id)} value={this.state.checkSekolah[option.sekolah_id]}></Radio>
                                    </Col> */}
                                    <Col width="100">
                                        <b>{option.nama}</b> ({option.npsn})
                                        <br/>
                                        <span style={{fontSize:'10px'}}>
                                          {option.alamat}{option.kecamatan ? <>, {option.kecamatan}</> : <></>}{option.kabupaten ? <>, {option.kabupaten}</> : <></>}{option.provinsi ? <>, {option.provinsi}</> : <></>}
                                        </span>
                                        <br/>
                                        <span style={{fontSize:'10px'}}>
                                          {option.bentuk}, {parseInt(option.status_sekolah) === 1 ? 'Negeri' : 'Swasta'}
                                        </span>
                                    </Col>
                                  </Row>
                                </CardContent>
                              </Card>
                            </Link>
                          )
                        })}
                    </Block>
                </Page>
            </Popup>
          </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getSekolah: Actions.getSekolah,
    getSekolahIndividu: Actions.getSekolahIndividu,
    getSekolahPPDB: Actions.getSekolahPPDB,
    getCalonPesertaDidik: Actions.getCalonPesertaDidik,
    getPesertaDidikDapodik: Actions.getPesertaDidikDapodik,
    getWilayah: Actions.getWilayah,
    cekNik: Actions.cekNik,
    cekNISN: Actions.cekNISN,
    simpanCalonPesertaDidik: Actions.simpanCalonPesertaDidik,
    generateUUID: Actions.generateUUID
  }, dispatch);
}

function mapStateToProps({ App, Sekolah, PPDB, Kuis }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      wilayah: App.wilayah,
      sekolah: Sekolah.sekolah,
      cek_nik: PPDB.cek_nik,
      cek_nisn: PPDB.cek_nisn,
      calon_peserta_didik: PPDB.calon_peserta_didik,
      uuid_kuis: Kuis.uuid_kuis      
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(formBiodata);