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
  Popover
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

class HomePPDB extends Component {

  state = {
    error: null,
    loading: true,
    sekolah: {
      gambar_logo: '/1.jpg'
    },
    routeParamsFilter: {
      start: 0,
      limit: 20
    },
    calon_peserta_didik: {
      rows: [],
      total: 0
    },
    statistik_sekolah: [],
    jadwal: {
        rows: [],
        total: 0
    }
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

    if(!this.$f7route.params['sekolah_id'] && !this.$f7route.params['pengguna_id']){

        if(parseInt(localStorage.getItem('sudah_login')) !== 1){
            this.$f7router.navigate('/login/');
            return true
        }

        this.props.getSekolahPengguna({pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{

            if(this.props.sekolah_pengguna.total > 0){
  
              this.setState({
                ...this.state,
                sekolah_pengguna: this.props.sekolah_pengguna
              },()=>{

                this.$f7.dialog.close()

                this.$f7router.navigate("/HomePPDB/"+JSON.parse(localStorage.getItem('user')).pengguna_id+"/"+this.state.sekolah_pengguna.rows[0].sekolah_id)

                // // console.log(this)
                // this.$f7.dialog.preloader()
                
                // this.props.getSekolah({sekolah_id:this.state.sekolah_pengguna.rows[0].sekolah_id, pengguna_id: JSON.parse(localStorage.getItem('user')).pengguna_id}).then((result)=>{
                //     this.setState({
                //         sekolah: result.payload.rows[0]
                //     },()=>{
                //         this.$f7.dialog.close()
                //         this.props.getStatistikSekolah({sekolah_id:this.state.sekolah_pengguna.rows[0].sekolah_id}).then((result)=>{
                //             this.setState({
                //                 statistik_sekolah: result.payload
                //             },()=>{
                //                 this.props.getJadwal({param:'hari_ini'}).then((result)=>{
                //                     this.setState({
                //                         jadwal: result.payload
                //                     },()=>{
                //                         this.props.getCalonPesertaDidik({...this.state.routeParams, limit: 2, sekolah_id:this.state.sekolah_pengguna.rows[0].sekolah_id }).then((result)=>{
                //                             this.setState({
                //                                 calon_peserta_didik: result.payload
                //                             })
                //                         })
                //                     })
                //                 })
                //             })
                //         })
                //     })
                // })
  
                localStorage.setItem('getSekolahPengguna:'+JSON.parse(localStorage.getItem('user')).pengguna_id, JSON.stringify(this.props.sekolah_pengguna))
              
              })
  
            }
  
        })

    }else{

        // console.log(this)
        this.$f7.dialog.preloader()
        
        this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
          this.setState({
              sekolah: result.payload.rows[0]
          },()=>{
            this.$f7.dialog.close()
            this.props.getStatistikSekolah({sekolah_id:this.$f7route.params['sekolah_id']}).then((result)=>{
                this.setState({
                    statistik_sekolah: result.payload
                },()=>{
                    this.props.getJadwal({param:'hari_ini'}).then((result)=>{
                        this.setState({
                            jadwal: result.payload
                        },()=>{
                            this.props.getCalonPesertaDidik({...this.state.routeParams, limit: 3, sekolah_id:this.$f7route.params['sekolah_id'], urut_pilihan:1 }).then((result)=>{
                                this.setState({
                                    calon_peserta_didik: result.payload
                                })
                            })
                        })
                    })
                })
            })
          })
        })

    }


  }

  arrWarna = [
    '#D83F87',
    '#2A1B3D',
    '#44318D',
    '#E98074',
    '#fc5644'
  ]

  keluar = () => {
    localStorage.setItem('sudah_login', '0');
    localStorage.setItem('user', '');
    localStorage.setItem('token', '');
    localStorage.setItem('sekolah_id_beranda', '');
    localStorage.setItem('custom_logo_sekolah', '');
    // localStorage.setItem('google_api', null);

    // window.location.href="/";
    if(localStorage.getItem('device') === 'android'){
        window.location.reload(true);
    }else{
        window.location.href="/";
    }
  }

  batalKonfirmasi = (calon_peserta_didik_id) => {
    // alert('tes')
    this.$f7.dialog.confirm('Apakah Anda yakin ingin membatalkan konfirmasi calon peserta didik ini?', 'Konfirmasi', ()=>{
      this.$f7.dialog.preloader()

      this.props.batalKonfirmasi({
        calon_peserta_didik_id: calon_peserta_didik_id
      }).then((result)=>{
        this.$f7.dialog.close()

        if(result.payload.sukses){
          //berhasil
          this.$f7.dialog.alert('Berhasil menyimpan data!', 'Berhasil')

          this.props.getCalonPesertaDidik({sekolah_id:this.$f7route.params['sekolah_id'], urut_pilihan:1}).then((result)=>{
            this.setState({
              calon_peserta_didik: result.payload
            },()=>{
              this.$f7.dialog.close()
            })
          })

        }else{
          //gagal
          this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon coba kembali dalam beberapa saat!', 'Galat')
        }
      }).catch((err)=>{
        this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon coba kembali dalam beberapa saat!', 'Galat')
      })
    })
    
  }

  hapus = (calon_peserta_didik_id) => {
    // alert('tes')
    this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus data calon peserta didik ini?', 'Konfirmasi', ()=>{
      this.$f7.dialog.preloader()

      this.props.hapusCalonPesertaDidik({
        calon_peserta_didik_id: calon_peserta_didik_id
      }).then((result)=>{
        this.$f7.dialog.close()

        if(result.payload.sukses){
          //berhasil
          this.$f7.dialog.alert('Berhasil menghapus data!', 'Berhasil')

          this.props.getCalonPesertaDidik({sekolah_id:this.$f7route.params['sekolah_id'], urut_pilihan:1}).then((result)=>{
            this.setState({
              calon_peserta_didik: result.payload
            },()=>{
              this.$f7.dialog.close()
            })
          })

        }else{
          //gagal
          this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon coba kembali dalam beberapa saat!', 'Galat')
        }
      }).catch((err)=>{
        this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon coba kembali dalam beberapa saat!', 'Galat')
      })
    })
    
  }

  render()
    {

        let hari_ini = '';
        hari_ini = moment().format('D') + ' ' + this.bulan[(moment().format('M')-1)] + ' ' + moment().format('YYYY');

        return (
          <Page name="HomePPDB" hideBarsOnScroll>
            
            <HeaderPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah_id={this.$f7route.params['sekolah_id']} />

            <div className="cardAtas">
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">
                        <Row noGap>
                            <Col width="100" tabletWidth="100">                                    
                            <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                            </Col>
                            <Col width="0" tabletWidth="30" className="hilangDiMobile">
                                <Card style={{margin:'4px'}}>
                                    <CardContent>
                                        <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-0" tabLinkActive>Beranda</Button>
                                        <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Data Pendaftar</Button>
                                        <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/formulirPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Tambah Pendaftar</Button>
                                        <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/jadwalPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jadwal</Button>
                                        {/* <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/ProfilPengguna/")}>Profil Pengguna</Button> */}
                                        <Button style={{borderRadius:'20px', marginBottom:'4px', background:'#eeeeee', color:'red', marginTop:'16px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={this.keluar}>Keluar</Button>
                                    </CardContent>
                                </Card>
                                
                                <div className="hilangDiMobile" style={{textAlign:'center', padding:'16px', border:'2px dashed #ccc', margin:'4px', borderRadius:'20px', marginTop:'16px'}}>
                                    Didukung oleh
                                    <br/>
                                    <Link href="https://diskuis.id" className="external">
                                        <img src={'https://be.diskuis.id/assets/berkas/diskuis_red.png'}  style={{height:'20px', margin:'auto', marginTop:'10px'}} />
                                    </Link>
                                    <br/>
                                    Aplikasi pembelajaran dan pendidikan digital Indonesia
                                </div>

                                <div className="hilangDiMobile" style={{textAlign:'center', padding:'16px', margin:'4px'}}>
                                    Dinas Pendidikan Kabupaten Lumajang
                                    <br/>
                                    © 2021
                                </div>
                            </Col>
                            <Col width="100" tabletWidth="70">
                            <Card style={{margin:'4px', marginBottom:'50px'}}>
                                <CardContent>
                                    
                                    <Row noGap style={{justifyContent:'end'}}>
                                        <Col width="100">
                                            <BlockTitle style={{marginLeft:'0px', marginTop:'8px'}}>Statistik Pendaftar</BlockTitle>
                                        </Col>
                                        {this.state.statistik_sekolah.map((option)=>{
                                            return (
                                                <Col width="50" tabletWidth="33" desktopWidth="20">
                                                    {/* <Card style={{background:this.arrWarna[this.state.statistik_sekolah.indexOf(option)]}} className="kotakJalur bawahCiriBiru"> */}
                                                    <Card className={"kotakJalur bawahCiriBiru bgGradient"+(parseInt(this.state.statistik_sekolah.indexOf(option))+1)}>
                                                        <CardContent style={{color:'white', fontSize:'10px'}}>
                                                        <b>{option.nama}</b>
                                                        <div style={{fontSize:'22px', fontWeight:'bold', color:'white'}}>{option.total}</div> pendaftar<br/>
                                                        <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+{option.total_hari_ini} hari ini)</div>
                                                        </CardContent>
                                                    </Card>
                                                </Col>
                                            )
                                        })}
                                        <Col width="50" tabletWidth="100" desktopWidth="100" style={{fontSize:'10px', padding:'16px'}}>
                                            *) Hanya menghitung pendaftar yang telah melakukan konfirmasi
                                            <br/>
                                            <Link href={"/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']}>
                                                Pendaftar Selengkapnya
                                            </Link>
                                        </Col>
                                        <Col width="100">
                                            <BlockTitle style={{marginLeft:'0px'}}>Jadwal Aktif Hari Ini ({hari_ini})</BlockTitle>
                                            <Row noGap>
                                            {this.state.jadwal.rows.map((option)=>{

                                                let waktu_mulai = '';
                                                waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY');
                                                //  + ', pukul ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');

                                                let waktu_selesai = '';
                                                waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY');
                                                //  + ', pukul ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');

                                                return (
                                                <Col key={option.jadwal_id} width="100" tabletWidth="50">
                                                    <Card style={{marginRight:'2px', marginLeft:'2px', borderLeft:'3px solid '+(option.jalur_id === '0100' ? 'red' : (option.jalur_id === '0200' ? 'purple' : (option.jalur_id === '0300' ? 'green' : (option.jalur_id === '0400' ? 'orange' : (option.jalur_id === '0500' ? 'teal' : 'gray'))))), borderRadius:'0px'}}>
                                                    {/* <Card style={{borderLeft:'3px solid '+(option.jalur_id === '0100' ? 'red' : (option.jalur_id === '0200' ? 'purple' : (option.jalur_id === '0300' ? 'green' : (option.jalur_id === '0400' ? 'orange' : (option.jalur_id === '0500' ? 'teal' : 'gray'))))), borderRadius:'0px'}}> */}
                                                    <CardContent>
                                                        <b>{option.jalur}</b> - Tahap {option.tahap}
                                                        <br/>
                                                        {waktu_mulai} - {waktu_selesai}
                                                    </CardContent>
                                                    </Card>
                                                </Col>
                                                )
                                            })}
                                            </Row>

                                            <Link href={"/jadwalPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']}>
                                                Jadwal Selengkapnya
                                            </Link>
                                        </Col>
                                        <Col width="100">
                                            <BlockTitle style={{marginLeft:'0px'}}>Pendaftar terbaru</BlockTitle>
                                        </Col>
                                        <Col width="100">
                                            {this.state.calon_peserta_didik.rows.map((option)=>{

                                            let pas_foto = '';

                                            for (let index = 0; index < option.berkas_calon.length; index++) {
                                            const element = option.berkas_calon[index];

                                            if(parseInt(element.jenis_berkas_id) === 8){
                                                pas_foto = element.nama_file;
                                            }
                                            
                                            }

                                            return (
                                            <Card key={option.calon_peserta_didik_id} style={{marginRight:'0px', marginLeft:'0px'}}>
                                                <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                    <Col width="25" tabletWidth="20" desktopWidth="15">
                                                        <div className="fotoSekolah" style={{width:'80px', height:'90px', backgroundImage: "url(https://be.diskuis.id"+(pas_foto !== '' ? pas_foto : (option.jenis_kelamin === 'L' ? '/assets/img/boy.jpg' : '/assets/img/girl.jpg'))+")", backgroundSize:'cover', backgroundPosition:'center'}}>
                                                            &nbsp;
                                                        </div>
                                                    </Col>
                                                    <Col width="65" tabletWidth="70" desktopWidth="75" style={{paddingLeft:'8px'}}>
                                                        <b>{option.nama}</b> ({option.nik})
                                                        <br/>
                                                        <span style={{fontSize:'10px'}}>
                                                            Asal: <b>{option.asal_sekolah}</b>
                                                        </span>
                                                        <br/>
                                                        <span style={{fontSize:'10px'}}>
                                                            {option.alamat_tempat_tinggal}, {option.kecamatan}, {option.kabupaten}, {option.provinsi}
                                                        </span>
                                                        <Row style={{borderTop:'1px dashed #ccc'}}>
                                                            <Col width="50" tabletwidth="50" style={{fontSize:'12px', textAlign:'left', border:'0px dashed #ccc', borderRadius:'10px'}}>
                                                            <span style={{fontSize:'12px', fontWeight:'bold'}}>Pilihan {option.urut_pilihan}</span>
                                                            <br/>
                                                            <Link style={{fontSize:'10px'}}>
                                                                Sekolah pilihan lain
                                                            </Link>
                                                            </Col>
                                                            <Col width="50" tabletwidth="50" style={{border:'0px dashed #ccc', textAlign:'right', borderRadius:'10px'}}>
                                                            {/* <span style={{fontSize:'10px'}}> */}
                                                            <span style={{fontSize:'15px', fontWeight:'bold'}}>{option.jalur}</span>
                                                            {/* </span> */}
                                                            </Col>
                                                            <Col width="100">
                                                            <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.status_konfirmasi_id) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                                <i className="f7-icons" style={{fontSize:'15px'}}>{parseInt(option.status_konfirmasi_id) === 1 ? 'checkmark_seal' : 'circle'}</i>&nbsp;
                                                                {parseInt(option.status_konfirmasi_id) === 1 ? 'Terkonfirmasi' : 'Belum Terkonfirmasi'}
                                                            </Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>                                                        
                                                    <Col width="10" tabletWidth="10" desktopWidth="10">
                                                        <Button popoverOpen={".popover-menu-"+option.calon_peserta_didik_id}><i className="icons f7-icons">ellipsis_vertical</i></Button>
                                                        <Popover className={"popover-menu-"+option.calon_peserta_didik_id} style={{minWidth:'300px'}}>
                                                            <List>
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) === 1 ? true : false} onClick={()=>this.$f7router.navigate("/formBiodata/"+option.calon_peserta_didik_id+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])} link="#" popoverClose title="Edit Biodata" />
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>window.open("https://be.diskuis.id/api/PPDB/print/formulir/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Formulir Pendaftaran" />
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>window.open("https://be.diskuis.id/api/PPDB/print/bukti/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Bukti Pendaftaran" />
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>this.batalKonfirmasi(option.calon_peserta_didik_id)} link="#" popoverClose title="Batalkan Konfirmasi" />
                                                                <ListItem onClick={()=>this.hapus(option.calon_peserta_didik_id)} link="#" popoverClose title="Hapus" />
                                                            </List>
                                                        </Popover>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                            </Card>
                                            )
                                            })}
                                            <Link href={"/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']}>
                                                Pendaftar Selengkapnya
                                            </Link>
                                        </Col>
                                        {/* <Col width="50" tabletWidth="25" desktopWidth="25">
                                        <Card style={{background:'#2A1B3D'}} className="kotakJalur bawahCiriBiru">
                                            <CardContent style={{color:'white'}}>
                                            Perpindahan Orangtua
                                            <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>0</div> pendaftar<br/>
                                            <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+0 hari ini)</div>
                                            </CardContent>
                                        </Card>
                                        </Col>
                                        <Col width="50" tabletWidth="25" desktopWidth="25">
                                        <Card style={{background:'#44318D'}} className="kotakJalur bawahCiriBiru">
                                            <CardContent style={{color:'white'}}>
                                            Zonasi
                                            <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>0</div> pendaftar<br/>
                                            <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+0 hari ini)</div>
                                            </CardContent>
                                        </Card>
                                        </Col>
                                        <Col width="50" tabletWidth="25" desktopWidth="25">
                                        <Card style={{background:'#E98074'}} className="kotakJalur bawahCiriBiru">
                                            <CardContent style={{color:'white'}}>
                                            Prestasi
                                            <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>0</div> pendaftar<br/>
                                            <div style={{fontSize:'12px', fontWeight:'bold', color:'white'}}>(+0 hari ini)</div>
                                            
                                            </CardContent>
                                        </Card>
                                        </Col> */}
                                    </Row>

                                </CardContent>
                            </Card>
                            </Col>
                        </Row>
                          
                  </Col>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
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
    getSekolah: Actions.getSekolah,
    getCalonPesertaDidik: Actions.getCalonPesertaDidik,
    getStatistikSekolah: Actions.getStatistikSekolah,
    getJadwal: Actions.getJadwal,
    getSekolahPengguna: Actions.getSekolahPengguna
  }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      sekolah: Sekolah.sekolah,
      sekolah_pengguna: Sekolah.sekolah_pengguna,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePPDB);