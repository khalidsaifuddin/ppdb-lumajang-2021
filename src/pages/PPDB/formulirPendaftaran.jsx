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

class formulirPendaftaran extends Component {

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
      limit: 20
    },
    peserta_didik: {
      rows: [],
      total: 0
    },
    sudah_cari: 0,
    riwayat_kata_kunci: []
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
    
    this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
      this.setState({
          sekolah: result.payload.rows[0]
      },()=>{
        this.$f7.dialog.close()
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

  tambahManual = () => {
    this.props.generateUUID(this.state.routeParams).then((result)=>{
      this.$f7router.navigate("/formBiodata/"+this.props.uuid_kuis+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])
    })
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

  render()
    {
        return (
          <Page name="formulirPendaftaran" hideBarsOnScroll>
            
            <HeaderPPDB />

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
                                              height:'80px', 
                                              width:'80px',
                                              background:'white', 
                                              backgroundImage:'url('+"https://be.diskuis.id"+this.state.sekolah.gambar_logo+')',
                                              backgroundSize:'cover',
                                              position:'absolute',
                                              marginTop:'-8px',
                                              borderRadius:'20px',
                                              border:'1px solid #CCC'
                                          }}>
                                              &nbsp;
                                          </div>
                                          <h1 className="namaSekolah" style={{marginLeft:'100px'}}>{this.state.sekolah.nama}</h1>
                                          <h3 className="keteranganSekolah" style={{marginLeft:'100px'}}>{this.state.sekolah.keterangan}</h3>
                                          <span className="alamatSekolah hilangDiMobile" style={{marginLeft:'100px'}}>{this.state.sekolah.alamat}</span>
                                        </CardContent>
                                    </Card> */}
                                    <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                                  </Col>
                                  <Col width="0" tabletWidth="30" className="hilangDiMobile">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Beranda</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Data Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-3" tabLinkActive>Tambah Pendaftar</Button>
                                            {localStorage.getItem('tampil_pendaftar_diterima') === 'Y' &&
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PendaftarDiterima/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Pendaftar Diterima</Button>
                                            }
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/jadwalPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jadwal</Button>
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
                                    <Card style={{margin:'4px'}}>
                                        <CardContent style={{padding:'8px'}}>
                                          <Card>
                                            <CardContent style={{padding:'8px'}}>
                                                <Row>
                                                  <Col width="20" tabletWidth="15" style={{textAlign:'center'}}>
                                                    <i className="icons f7-icons" style={{fontSize:'50px'}}>info_circle</i>
                                                  </Col>
                                                  <Col width="80" tabletWidth="85" style={{fontSize:'12px', fontStyle:'italic'}}>
                                                    Sebelum melakukan pendaftaran, mohon lakukan pencarian peserta didik terlebih dahulu menggunakan nama, NIK, atau NISN. Data hasil pencarian di bawah ini bersumber dari dapodik.
                                                  </Col>
                                                </Row>
                                            </CardContent>
                                          </Card>
                                          <Searchbar
                                            className="searchbar-demo"
                                            placeholder="Cari peserta didik (Nama/NIK/NISN)..."
                                            // searchContainer=".search-list"
                                            // searchIn=".item-title"
                                            onSubmit={this.cari}
                                            customSearch={true}
                                            onChange={this.ketikCari}
                                            value={this.state.routeParams.keyword}
                                            backdrop={false}
                                          />
                                          {/* <BlockTitle>Hasil pencarian peserta didik dari dapodik</BlockTitle> */}
                                          {/* <Block className="riwayatPencarian" style={{marginTop: '8px',marginLeft:'0px',marginBottom:'32px'}}>
                                            <span>Riwayat Pencarian :</span>
                                            <div className="daftarRiwayat">
                                              {this.state.riwayat_kata_kunci.map((option, key)=> {
                                                if(this.state.riwayat_kata_kunci.indexOf(option) <= 10) {
                                                  return (
                                                    <a key={key} onClick={()=>this.repeatKataKunci(option.kata_kunci)}>{option.kata_kunci}</a>
                                                  )
                                                }
                                              })}
                                            </div>
                                            <a className="hapusRiwayat" onClick={()=>{localStorage.setItem('riwayat_kata_kunci','');this.setState({riwayat_kata_kunci:[]});}}>Bersihkan Riwayat</a>
                                          </Block> */}
                                          
                                          <div className="hasilPencarian">

                                            {parseInt(this.state.sudah_cari) === 0 &&
                                            <Card noShadow style={{margin:'0px', borderRadius:'0px', marginTop:'8px'}}>
                                              <CardContent style={{padding:'8px', textAlign:'center'}}>
                                                <img src="/static/icons/cari_vector.png" style={{width:'60%'}} />
                                                <br/> 
                                                <span style={{color:'#4B75CB'}}>
                                                  Mohon lakukan pencarian terlebih dahulu
                                                </span>
                                              </CardContent>
                                            </Card>
                                            }

                                            {parseInt(this.state.sudah_cari) === 1 && parseInt(this.state.peserta_didik.total) < 1 && !this.state.loading &&
                                            <Card noShadow style={{margin:'0px', borderRadius:'0px', marginTop:'8px'}}>
                                              <CardContent style={{padding:'8px', textAlign:'center'}}>
                                                <img src="/static/icons/not_found.png" style={{width:'50%'}} />
                                                <br/> 
                                                <span style={{color:'#4B75CB'}}>
                                                  Peserta Didik tidak ditemukan
                                                </span>
                                                <br/>
                                                <Button raised fill style={{display:'inline-flex', marginTop:'4px'}} className="bawahCiriBiru" onClick={this.tambahManual}>
                                                  <i className="icons f7-icons" style={{fontSize:'20px'}}>plus</i>
                                                  Tambah Pendaftar Manual
                                                </Button>
                                              </CardContent>
                                            </Card>
                                            }

                                            {parseInt(this.state.sudah_cari) === 1 && parseInt(this.state.peserta_didik.total) > 0 &&
                                            <Card noShadow style={{margin:'0px', borderRadius:'0px', marginTop:'8px'}}>
                                              <CardContent style={{padding:'8px'}}>
                                                <div className="data-table" style={{overflowY:'hidden'}}>
                                                    <div className="data-table-footer" style={{display:'block'}}>
                                                        <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                            <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                            <i className="icon icon-prev color-gray"></i>
                                                            </a>
                                                            <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.peserta_didik.total) ? "disabled" : "" )}>
                                                                <i className="icon icon-next color-gray"></i>
                                                            </a>
                                                            <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.peserta_didik.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.peserta_didik.total)} dari {this.formatAngka(this.state.peserta_didik.total)} peserta didik</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {this.state.peserta_didik.rows.map((option)=>{
                                                  return (
                                                    <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                                      <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                          <Col width="20" tabletWidth="15" style={{textAlign:'center'}}>
                                                            {option.jenis_kelamin === 'L' &&
                                                            <img src={localStorage.getItem('api_base')+"/assets/img/boy.jpg"} style={{height:'50px', border:'1px solid #ccc', borderRadius:'50%'}} />
                                                            }
                                                            {option.jenis_kelamin === 'P' &&
                                                            <img src={localStorage.getItem('api_base')+"/assets/img/girl.jpg"} style={{height:'50px', border:'1px solid #ccc', borderRadius:'50%'}} />
                                                            }
                                                          </Col>
                                                          <Col width="60" tabletWidth="70">
                                                            <b>{option.nama}</b><br/>
                                                            <span style={{fontSize:'10px'}}>
                                                              NIK: {option.nik} | NISN: {option.nisn}
                                                              <br/>
                                                              Sekolah Asal: <b>{option.nama_sekolah} ({option.npsn})</b> | {option.tingkat_pendidikan} 
                                                            </span>
                                                          </Col>
                                                          <Col width="20" tabletWidth="15">
                                                            
                                                            <Button 
                                                              raised 
                                                              // fill={!option.calon_peserta_didik_id ? true : false}
                                                              fill
                                                              disabled={!option.calon_peserta_didik_id ? false : true}
                                                              style={{fontSize:'12px'}} 
                                                              className="bawahCiriBiru"
                                                              onClick={()=>this.$f7router.navigate("/formBiodata/"+option.peserta_didik_id+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}
                                                            >
                                                              {!option.calon_peserta_didik_id ? 'Daftar' : 'Daftar'}
                                                            </Button>
                                                            <span style={{fontSize:'8px', display:'inline-flex', textAlign:'center'}}>{!option.calon_peserta_didik_id ? '' : 'Peserta didik ini telah didaftarkan'}</span>
                                                          </Col>
                                                          {(parseInt(option.status_diterima_id) === 1 || parseInt(option.status_diterima_id) === 2) &&
                                                          <Col width="100" className="sudahDiterima">
                                                            telah diterima {parseInt(option.status_diterima_id) === 2 && <>dan daftar ulang </>}di <b>{option.nama_sekolah_penerima}</b>
                                                          </Col>
                                                          }
                                                        </Row>
                                                      </CardContent>
                                                    </Card>
                                                  )
                                                })}
                                              </CardContent>
                                            </Card>
                                            }

                                          </div>
                                        
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
    getPesertaDidikDapodik: Actions.getPesertaDidikDapodik,
    generateUUID: Actions.generateUUID
  }, dispatch);
}

function mapStateToProps({ App, Sekolah, Kuis }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar,
      sekolah: Sekolah.sekolah,
      uuid_kuis: Kuis.uuid_kuis
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(formulirPendaftaran);