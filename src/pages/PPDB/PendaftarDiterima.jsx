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
  Searchbar,
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

class PendaftarDiterima extends Component {

  state = {
    error: null,
    loading: true,
    sekolah: {},
    jadwal: {
      rows: [],
      total: 0
    },
    routeParams: {
        start: 0,
        limit: 20,
        sekolah_id: this.$f7route.params['sekolah_id'] ? this.$f7route.params['sekolah_id'] : null,
        diterima: 1
    },
    popupFilter: false,
    calon_peserta_didik: {
        rows: [],
        total: 0
    },
    jalur: {
        rows: [],
        total: 0 
    },
    popupDaftarUlang: false,
    pd_aktif: {},
    status_filter: 'semua'
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

daftarUlang = (option) => {
    //   console.log(peserta_dididk_id)
    this.setState({
        popupDaftarUlang: true,
        pd_aktif: option
    })
}

klikVerval = (status_diterima_id) => {
    this.setState({
        pd_aktif: {
            ...this.state.pd_aktif,
            status_diterima_id: status_diterima_id
        }
    },()=>{
        console.log(this.state.pd_aktif)
    })
}

simpanDaftarUlang = () => {
    this.$f7.dialog.preloader()

    this.props.simpanDaftarUlang({
        ...this.state.pd_aktif, 
        peserta_didik_id: this.state.pd_aktif.calon_peserta_didik_id
    }).then((result)=>{
        if(result.payload.sukses){
            //berhasil
            this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
                this.setState({
                    calon_peserta_didik: result.payload,
                    popupDaftarUlang: !this.state.popupDaftarUlang,
                    popupDaftarUlang: false
                },()=>{
                    this.$f7.dialog.close()
                    this.$f7.dialog.alert('Berhasil menyimpan data!', 'Berhasil')
                    // this.$f7.dialog.close()
                })
            })
        }else{
            //gagal
            this.$f7.dialog.close()
            this.$f7.dialog.alert('Ada kesalahan pada sistem. Mohon coba kembali dalam beberapa saat!', 'Galat')
        }
    }).catch(()=>{
        this.$f7.dialog.close()
    })
}

filterDaftar = (tipe) => {
    this.$f7.dialog.preloader()
    
    this.setState({
        status_filter: tipe
    },()=>{
        this.props.getCalonPesertaDidik({...this.state.routeParams, filter_diterima: tipe}).then((result)=>{
            this.setState({
                calon_peserta_didik: result.payload
            },()=>{
                this.$f7.dialog.close()
            })
        })
    })
}

unduhExcel = () => {
    // alert('tes')
    window.open('https://be.diskuis.id/api/PPDB/unduhExcelPendaftarDiterima'
    // window.open('http://mejabantu:8888/api/PPDB/unduhExcelPendaftarDiterima'
    +'?sekolah_id='+this.state.routeParams.sekolah_id
    +'&limit=10000000'
    +'&diterima=1'
    )
}

render()
    {
        return (
          <Page name="PendaftarDiterima" hideBarsOnScroll>
            
            <HeaderPPDB />

            <Popup className="daftar-ulang-popup" opened={this.state.popupDaftarUlang} onPopupClosed={() => this.setState({popupDaftarUlang : false})}>
                <Page>
                    <Navbar title="Daftar Ulang">
                        <NavRight>
                            <Link popupClose>Tutup</Link>
                        </NavRight>
                    </Navbar>
                    <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                        <Card>
                            <CardContent>
                                Nama: {this.state.pd_aktif.nama}<br/>
                                NISN: {this.state.pd_aktif.nisn}<br/>
                                Asal: {this.state.pd_aktif.asal_sekolah}
                                <br/>
                                <br/>
                                Jalur: {this.state.pd_aktif.jalur}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <BlockTitle style={{marginLeft:'0px', marginBottom:'16px'}}>Pendaftaran Ulang</BlockTitle>
                                <List>
                                    <ListItem title="Daftar Ulang">
                                        <Radio 
                                            name={"status_diterima_id"} 
                                            value={1} 
                                            slot="media"
                                            onChange={()=>this.klikVerval(2)}
                                        />
                                    </ListItem>
                                    <ListItem title="Cabut Berkas">
                                        <Radio 
                                            name={"status_diterima_id"} 
                                            value={2} 
                                            slot="media"
                                            onChange={()=>this.klikVerval(3)}
                                        />
                                    </ListItem>
                                </List>
                                <br/>
                                <br/>
                                <Button raised fill onClick={this.simpanDaftarUlang}>
                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                    Simpan
                                </Button>
                            </CardContent>
                        </Card>
                    </Block>
                </Page>
            </Popup>

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
                                    <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                                  </Col>
                                  <Col width="0" tabletWidth="30" className="hilangDiMobile">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent>
                                        <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Beranda</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Data Pendaftar</Button>
                                            {localStorage.getItem('tambah_pendaftar') === 'Y' &&
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/formulirPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Tambah Pendaftar</Button>
                                            }
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-3" tabLinkActive>Pendaftar Diterima</Button>
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
                                        <CardContent>
                                            
                                            <BlockTitle style={{marginTop:"0px", marginBottom:'8px'}}>PENDAFTAR DITERIMA</BlockTitle>
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
                                            <Button className="color-theme-green" raised fill style={{display:'inline-flex', marginTop:'-32px', float:'right', marginRight:'82px'}} onClick={this.unduhExcel}>
                                                <i className="f7-icons" style={{fontSize:'20px'}}>download_circle</i>&nbsp;
                                                Unduh Xlsx
                                            </Button>
                                            <Button raised fill style={{display:'inline-flex', marginTop:'-32px', float:'right'}} onClick={this.filter}>
                                                <i className="f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                                Filter
                                            </Button>
                                            <div style={{marginTop:'16px'}}>
                                                <Button raised fill={this.state.status_filter === 'semua' ? true : false} style={{display:'inline-flex', marginRight:'8px'}} onClick={()=>this.filterDaftar('semua')}>
                                                    Semua
                                                </Button>
                                                <Button raised fill={this.state.status_filter === 'diterima' ? true : false} style={{display:'inline-flex', marginRight:'8px'}} onClick={()=>this.filterDaftar('diterima')}>
                                                    Diterima
                                                </Button>
                                                <Button raised fill={this.state.status_filter === 'daftar_ulang' ? true : false} style={{display:'inline-flex', marginRight:'8px'}} onClick={()=>this.filterDaftar('daftar_ulang')}>
                                                    Daftar Ulang
                                                </Button>
                                                <Button raised fill={this.state.status_filter === 'cabut_berkas' ? true : false} style={{display:'inline-flex', marginRight:'8px'}} onClick={()=>this.filterDaftar('cabut_berkas')}>
                                                    Cabut Berkas
                                                </Button>
                                            </div>
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
                                                                    {/* <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.status_konfirmasi_id) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                                        <i className="f7-icons" style={{fontSize:'15px'}}>{parseInt(option.status_konfirmasi_id) === 1 ? 'checkmark_seal' : 'circle'}</i>&nbsp;
                                                                        {parseInt(option.status_konfirmasi_id) === 1 ? 'Terkonfirmasi' : 'Belum Terkonfirmasi'}
                                                                    </Button> */}
                                                                    <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.status_diterima_id) === 1 ? 'color-theme-green' : (parseInt(option.status_diterima_id) === 2 ? 'color-theme-blue' : 'color-theme-orange'))}>
                                                                        <i className="f7-icons" style={{fontSize:'15px'}}>{parseInt(option.status_diterima_id) === 1 ? 'checkmark_seal' : (parseInt(option.status_diterima_id) === 2 ? 'checkmark_seal' : 'circle')}</i>&nbsp;
                                                                        {parseInt(option.status_diterima_id) === 1 ? 'Diterima' : (parseInt(option.status_diterima_id) === 2 ? 'Daftar Ulang' : 'Cabut Berkas')}
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
                                                                    <ListItem disabled={parseInt(option.status_diterima_id) !== 1 ? true : false} onClick={()=>this.daftarUlang(option)} link="#" popoverClose title="Daftar Ulang" />
                                                                    <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>window.open("https://be.diskuis.id/api/PPDB/print/formulir/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Formulir Pendaftaran" />
                                                                    <ListItem disabled={parseInt(option.status_konfirmasi_id) !== 1 ? true : false} onClick={()=>window.open("https://be.diskuis.id/api/PPDB/print/bukti/"+option.calon_peserta_didik_id)} link="#" popoverClose title="Cetak Bukti Pendaftaran" />
                                                                </List>
                                                            </Popover>
                                                        </Col>
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
    getJadwal: Actions.getJadwal,
    getCalonPesertaDidik: Actions.getCalonPesertaDidik,
    getJalurPPDB: Actions.getJalurPPDB,
    simpanDaftarUlang: Actions.simpanDaftarUlang
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

export default connect(mapStateToProps, mapDispatchToProps)(PendaftarDiterima);