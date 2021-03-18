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
  Popup,
  Searchbar
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

class BerandaPPDB extends Component {

  state = {
    error: null,
    loading: true,
    sekolah: {
      gambar_logo: '/1.jpg'
    },
    // routeParams: {
    //   start: 0,
    //   limit: 20
    // },
    calon_peserta_didik: {
      rows: [],
      total: 0
    },
    routeParams: {
      sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null, 
      urut_pilihan:1,
      pendaftar:1,
      start: 0,
      limit: 20
    },
    popupFilter: false,
    jalur: {
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


  bulan_singkat = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des'
]

  formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  componentDidMount = () => {

    // console.log(this)
    this.$f7.dialog.preloader()

    if(this.$f7route.params['sekolah_id'] && this.$f7route.params['pengguna_id']){
      
      this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
        this.setState({
            sekolah: result.payload.rows[0]
        },()=>{
          this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
            this.setState({
              calon_peserta_didik: result.payload
            },()=>{
              this.$f7.dialog.close()
              this.props.getJalurPPDB(this.state.routeParams).then((result)=>{
                this.setState({
                  jalur: result.payload
                })
              })
            })
          })
        })
      })
    }else{
      this.props.getCalonPesertaDidik({...this.state.routeParams, sekolah_id: (this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null)}).then((result)=>{
        this.setState({
          calon_peserta_didik: result.payload
        },()=>{
          this.$f7.dialog.close()
          this.props.getJalurPPDB(this.state.routeParams).then((result)=>{
            this.setState({
              jalur: result.payload
            })
          })
        })
      })
    }
    

  }

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
      this.props.getCalonPesertaDidik({...this.state.routeParams, sekolah_id: (this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null)}).then((result)=>{
        this.setState({
          calon_peserta_didik: result.payload
        },()=>{
          this.$f7.dialog.close()
        })
      })
    });
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
        this.props.getCalonPesertaDidik({...this.state.routeParams, sekolah_id: (this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null)}).then((result)=>{
          this.setState({
            calon_peserta_didik: result.payload
          },()=>{
            this.$f7.dialog.close()
          })
        })
      });
  }
  
  cariKeyword = (e) => {
    
    this.setState({
        routeParams: {
            ...this.state.routeParams,
            keyword: e.currentTarget.value
        }
    })
  }

  setValue = (type) => (e) => {

      this.setState({
          routeParams: {
              ...this.state.routeParams,
              [type]: e.target.value
          }
      },()=>{
          console.log(this.state)
      })
  }

  filter = () => {
      this.setState({popupFilter:!this.state.popupFilter})
  }

  tampilFilter = () => {
      this.$f7.dialog.preloader()
      this.props.getCalonPesertaDidik({...this.state.routeParams, start: 0}).then((result)=>{
          this.setState({
              calon_peserta_didik: result.payload,
              popupFilter: !this.state.popupFilter
          },()=>{
              this.$f7.dialog.close()
          })
      })
  }

  resetFilter = () => {
      this.$f7.dialog.preloader()

      this.setState({
          routeParams: {
              ...this.state.routeParams,
              keyword: null,
              status_konfirmasi_id: null,
              jalur_id_filter: null
          }
      },()=>{

          this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
              this.setState({
                  calon_peserta_didik: result.payload,
                  popupFilter: !this.state.popupFilter
              },()=>{
                  this.$f7.dialog.close()
              })
          })

      })

  }

  render()
    {
        return (
          <Page name="BerandaPPDB" hideBarsOnScroll>
            
            <HeaderPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah_id={this.$f7route.params['sekolah_id']} />

            <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                <Page>
                    <Navbar title="Filter Pendaftar">
                        <NavRight>
                            <Link popupClose>Tutup</Link>
                        </NavRight>
                    </Navbar>
                    <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                        <List>
                            <Searchbar
                                className="searchbar-demo"
                                placeholder="Nama Pendaftar"
                                searchContainer=".search-list"
                                searchIn=".item-title"
                                onChange={this.cariKeyword}
                            ></Searchbar>
                            <ListInput
                                label="Status Konfirmasi"
                                type="select"
                                defaultValue={"99"}
                                placeholder="Pilih Status konfirmasi..."
                                onChange={this.setValue('status_konfirmasi_id')}
                            >
                              <option value={'semua'} selected>Semua</option>
                              <option value={'belum'}>Belum Terkonfirmasi</option>
                              <option value={'sudah'}>Terkonfirmasi</option>
                                {/* {this.state.provinsi.map((option)=>{
                                    return (
                                        <option value={option.kode_wilayah}>{option.nama}</option>
                                    )
                                })} */}
                            </ListInput>
                            <ListInput
                                label="Jalur"
                                type="select"
                                defaultValue={"99"}
                                placeholder="Pilih Jalur..."
                                onChange={this.setValue('jalur_id_filter')}
                            >
                              <option value={'semua'} selected>Semua</option>
                              {this.state.jalur.rows.map((option)=>{
                                  return (
                                      <option value={option.jalur_id}>{option.nama}</option>
                                  )
                              })}
                            </ListInput>
                        </List>
                    </Block>
                    <Block>
                        <Row>
                            <Col width="50">
                                <Button raised onClick={this.resetFilter}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_counterclockwise</i>&nbsp;
                                    Reset Filter
                                </Button>
                            </Col>
                            <Col width="50">
                                <Button raised fill onClick={this.tampilFilter}>
                                    <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                    Tampilkan Data
                                </Button>
                            </Col>
                        </Row>
                    </Block>
                </Page>
            </Popup>

            <div className="cardAtas">
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">
                      {/* <Card>
                          <CardContent style={{padding:'8px'}}> */}
                              <Row noGap>
                                  <Col width="100" tabletWidth="100">
                                    {/* <Card style={{margin:'4px'}}>
                                        <CardContent>
                                          <div style={{
                                              height:'110px', 
                                              width:'110px',
                                              background:'white', 
                                              backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                              backgroundSize:'cover',
                                              position:'absolute',
                                              marginTop:'-45px',
                                              borderRadius:'20px',
                                              border:'1px solid #CCC'
                                          }}>
                                              &nbsp;
                                          </div>
                                          <h1 className="namaSekolah">{this.state.sekolah.nama}</h1>
                                          <h3 className="keteranganSekolah">{this.state.sekolah.keterangan}</h3>
                                          <span className="alamatSekolah hilangDiMobile">{this.state.sekolah.alamat}</span>
                                        </CardContent>
                                    </Card> */}
                                    {this.$f7route.params['sekolah_id'] && this.$f7route.params['sekolah_id'] !== '-' &&
                                    // <>
                                    // {this.$f7route.params['sekolah_id'] !== '-' &&
                                    <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                                    // }
                                    // </>
                                    }
                                  </Col>
                                  <Col width="0" tabletWidth="30" className="hilangDiMobile">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent>
                                          {this.$f7route.params['sekolah_id'] &&
                                          <>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Beranda</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-1" tabLinkActive>Data Pendaftar</Button>
                                            {localStorage.getItem('tambah_pendaftar') === 'Y' &&
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/formulirPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Tambah Pendaftar</Button>
                                            }
                                            {localStorage.getItem('tampil_pendaftar_diterima') === 'Y' &&
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PendaftarDiterima/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Pendaftar Diterima</Button>
                                            }
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/jadwalPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jadwal</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px', background:'#eeeeee', color:'red', marginTop:'16px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={this.keluar}>Keluar</Button>
                                          </>
                                          }
                                          {!this.$f7route.params['sekolah_id'] &&
                                          <>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/")}>Beranda</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-1" tabLinkActive>Data Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/KelolaJadwal/")}>Kelola Jadwal</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/KelolaKuota/")}>Kelola Kuota</Button>
                                          </>
                                          }
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
                                          
                                          {/* <Card style={{marginBottom:'16px'}}>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                  <Col width="20" tabletWidth="15" style={{textAlign:'center'}}>
                                                    <i className="icons f7-icons" style={{fontSize:'50px'}}>info_circle</i>
                                                  </Col>
                                                  <Col width="80" tabletWidth="85" style={{fontSize:'12px', fontStyle:'italic'}}>
                                                    Data yang ditampilkan di halaman ini adalah data pendaftar yang belum berstatus telah diterima/daftar ulang/cabut berkas. Untuk melihat data pendaftar yang telah diterima/daftar ulang/cabut berkas, silakan buka menu <Link href={"/PendaftarDiterima/"+this.$f7route.params['pengguna_id']+'/'+this.$f7route.params['sekolah_id']}>Pendaftar Diterima</Link>
                                                  </Col>
                                                </Row>
                                            </CardContent>
                                          </Card> */}

                                          <BlockTitle style={{marginTop:"8px", marginBottom:'8px'}}>Data Pendaftar</BlockTitle>
                                          <div className="data-table" style={{overflowY:'hidden'}}>
                                              <div className="data-table-footer" style={{display:'block'}}>
                                                  <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                      <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                      <i class="icon icon-prev color-gray"></i>
                                                      </a>
                                                      <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.calon_peserta_didik.total) ? "disabled" : "" )}>
                                                          <i className="icon icon-next color-gray"></i>
                                                      </a>
                                                      <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.calon_peserta_didik.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.calon_peserta_didik.total)} dari {this.formatAngka(this.state.calon_peserta_didik.total)} Pendaftar</span>
                                                  </div>
                                              </div>
                                          </div>
                                          <Button raised fill style={{display:'inline-flex', marginTop:'-32px', float:'right'}} onClick={this.filter}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                            Filter
                                          </Button>
                                          {this.state.calon_peserta_didik.rows.map((option)=>{

                                            let pas_foto = '';

                                            for (let index = 0; index < option.berkas_calon.length; index++) {
                                              const element = option.berkas_calon[index];

                                              if(parseInt(element.jenis_berkas_id) === 8){
                                                pas_foto = element.nama_file;
                                              }
                                              
                                            }

                                            let last_update = '';
                                            last_update = moment(option.last_update).format('D') + ' ' + this.bulan_singkat[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY') + ', ' + moment(option.last_update).format('HH') + ':' + moment(option.last_update).format('mm');

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
                                                              <div className="hilangDiMobile">
                                                                <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.status_konfirmasi_id) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                                    <i className="f7-icons" style={{fontSize:'15px'}}>{parseInt(option.status_konfirmasi_id) === 1 ? 'checkmark_seal' : 'circle'}</i>&nbsp;
                                                                    {parseInt(option.status_konfirmasi_id) === 1 ? 'Terkonfirmasi' : 'Belum Terkonfirmasi'}
                                                                </Button>
                                                              </div>
                                                            </Col>
                                                            <Col width="50" tabletwidth="50" style={{border:'0px dashed #ccc', textAlign:'right', borderRadius:'10px'}}>
                                                              <span style={{fontSize:'15px', fontWeight:'bold'}}>{option.jalur}</span>
                                                              {option.jalur_id === '0300' &&
                                                              <div>
                                                                <span style={{fontSize:'10px', fontWeight:'bold'}}>{option.nilai_prestasi.jenis_prestasi}</span>
                                                                {parseInt(option.nilai_prestasi.jenis_prestasi_id) !== 3 &&
                                                                  <div style={{fontSize:'8px'}}>{option.nilai_prestasi.tingkat_prestasi}</div>
                                                                }
                                                              </div>
                                                              }
                                                              {option.jalur_id === '0300' &&
                                                                <span style={{fontSize:'12px'}}>
                                                                  Poin: <b>{option.nilai_prestasi.skor}</b>
                                                                </span>
                                                              }
                                                              <br/>
                                                              <span style={{fontSize:'8px'}}>Pembaruan: {last_update}</span>
                                                            </Col>
                                                            <Col width="100" className="hilangDiDesktop">
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
                                                                {localStorage.getItem('edit_pendaftar') === 'Y' &&
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) === 1 ? true : false} onClick={()=>this.$f7router.navigate("/formBiodata/"+option.calon_peserta_didik_id+"/"+(this.$f7route.params['pengguna_id'] ? this.$f7route.params['pengguna_id'] : '-')+"/"+(this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : '-'))} link="#" popoverClose title="Edit Biodata" />
                                                                }
                                                                {/* <ListItem onClick={()=>window.open("http://mejabantu:8888/api/PPDB/print/formulir/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Formulir Pendaftaran" />
                                                                <ListItem onClick={()=>window.open("http://mejabantu:8888/api/PPDB/print/bukti/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Bukti Pendaftaran" /> */}
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>window.open("https://be.diskuis.id/api/PPDB/print/formulir/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Formulir Pendaftaran" />
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>window.open("https://be.diskuis.id/api/PPDB/print/bukti/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Bukti Pendaftaran" />
                                                                {localStorage.getItem('edit_pendaftar') === 'Y' &&
                                                                <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>this.batalKonfirmasi(option.calon_peserta_didik_id)} link="#" popoverClose title="Batalkan Konfirmasi" />
                                                                }
                                                                {localStorage.getItem('hapus_pendaftar') === 'Y' &&
                                                                <ListItem onClick={()=>this.hapus(option.calon_peserta_didik_id)} link="#" popoverClose title="Hapus" />
                                                                }
                                                            </List>
                                                        </Popover>
                                                      </Col>
                                                      {/* <Col width="100">
                                                        <Row>
                                                            <Col width="50" tabletwidth="50" style={{fontSize:'12px', textAlign:'left', border:'0px dashed #ccc', borderRadius:'10px'}}>
                                                              <span style={{fontSize:'12px', fontWeight:'bold'}}>Pilihan {option.urut_pilihan}</span>
                                                              <br/>
                                                              <Link style={{fontSize:'10px'}}>
                                                                Sekolah pilihan lain
                                                              </Link>
                                                            </Col>
                                                            <Col width="50" tabletwidth="50" style={{border:'0px dashed #ccc', textAlign:'right', borderRadius:'10px'}}>
                                                              <span style={{fontSize:'15px', fontWeight:'bold'}}>{option.jalur}</span>
                                                            
                                                            </Col>
                                                            <Col width="100">
                                                              <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.status_konfirmasi_id) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                                  <i className="f7-icons" style={{fontSize:'15px'}}>{parseInt(option.status_konfirmasi_id) === 1 ? 'checkmark_seal' : 'circle'}</i>&nbsp;
                                                                  {parseInt(option.status_konfirmasi_id) === 1 ? 'Terkonfirmasi' : 'Belum Terkonfirmasi'}
                                                              </Button>
                                                            </Col>
                                                          </Row>
                                                      </Col> */}
                                                  </Row>
                                              </CardContent>
                                              </Card>
                                            )
                                          })}
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
    batalKonfirmasi: Actions.batalKonfirmasi,
    hapusCalonPesertaDidik: Actions.hapusCalonPesertaDidik,
    getJalurPPDB: Actions.getJalurPPDB
  }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      sekolah: Sekolah.sekolah
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BerandaPPDB);