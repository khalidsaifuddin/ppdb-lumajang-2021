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

class kelolaKuota extends Component {

  state = {
    error: null,
    loading: true,
    sekolah: {},
    kuota: {
      rows: [],
      total: 0
    },
    routeParams: {
        start: 0,
        limit: 20
    },
    popupFilter: false,
    popupKuota: false
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
        this.props.getKuota({kode_wilayah:'052100'}).then((result)=>{
          this.setState({
            kuota: result.payload
          },()=>{
            this.$f7.dialog.close()
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

    editKuota = (nama, sekolah_id, jalur_id, kuota) => {
        // alert(sekolah_id)
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                nama: nama,
                sekolah_id: sekolah_id,
                jalur_id: jalur_id,
                kuota: kuota,
                jalur: (
                    jalur_id === '0100' ? 'Affirmasi' : 
                    (
                        jalur_id === '0200' ? 'Pindah Tugas' : 
                        (
                            jalur_id === '0300' ? 'Prestasi' : 
                            (
                                jalur_id === '0400' ? 'Zonasi' : 
                                (
                                    jalur_id === '0500' ? 'Tahfidz' : ''
                                )
                            )
                        )
                    )
                )
            },
            popupKuota: true
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
            this.props.getKuota(this.state.routeParams).then((result)=>{
                this.setState({
                    kuota: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
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
            this.props.getKuota(this.state.routeParams).then((result)=>{
                this.setState({
                    kuota: result.payload,
                    loading: false
                },()=>{
                    this.$f7.dialog.close()
                });
            });
        })
    }

    cariKeyword = (e) => {
        // console.log(e.currentTarget.value)
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
        this.props.getKuota({...this.state.routeParams, start: 0}).then((result)=>{
            this.setState({
                kuota: result.payload,
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
                keyword: null
            }
        },()=>{

            this.props.getKuota(this.state.routeParams).then((result)=>{
                this.setState({
                    kuota: result.payload,
                    popupFilter: !this.state.popupFilter
                },()=>{
                    this.$f7.dialog.close()
                })
            })

        })

    }

    simpanKuota = () => {
        this.$f7.dialog.preloader()

        this.props.simpanKuota(this.state.routeParams).then((result)=>{
            this.setState({
                routeParams: {
                    ...this.state.routeParams,
                    sekolah_id: null
                }
            },()=>{
                this.props.getKuota(this.state.routeParams).then((result)=>{
                    this.setState({
                        kuota: result.payload,
                        popupKuota: !this.state.popupKuota
                    },()=>{
                        this.$f7.dialog.close()
                    })
                })
            })
        })
    }

    render()
    {
        return (
          <Page name="kelolaKuota" hideBarsOnScroll style={{marginBottom:'50px'}}>
            
            <HeaderPPDB />

            <Popup className="demo-popup" opened={this.state.popupFilter} onPopupClosed={() => this.setState({popupFilter : false})}>
                <Page>
                    <Navbar title="Filter Sekolah">
                        <NavRight>
                            <Link popupClose>Tutup</Link>
                        </NavRight>
                    </Navbar>
                    <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                        <List>
                            <Searchbar
                                className="searchbar-demo"
                                placeholder="Nama Sekolah"
                                searchContainer=".search-list"
                                searchIn=".item-title"
                                onChange={this.cariKeyword}
                            ></Searchbar>
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

            <Popup className="edit-kuota-popup" opened={this.state.popupKuota} onPopupClosed={() => this.setState({popupKuota : false})}>
                <Page>
                    <Navbar title={"Edit Kuota "+this.state.routeParams.nama+" ("+(this.state.routeParams.jalur)+")"}>
                        <NavRight>
                            <Link popupClose>Tutup</Link>
                        </NavRight>
                    </Navbar>
                    <Block style={{marginTop:'0px', paddingLeft:'0px', paddingRight:'0px'}}>
                        <List>
                            <ListInput
                                label="Jumlah Kuota"
                                type="number"
                                placeholder="Jumlah Kuota"
                                clearButton
                                value={this.state.routeParams.kuota || ''}
                                onChange={this.setValue('kuota')}
                            />
                        </List>
                    </Block>
                    <Block>
                        <Button style={{display:'inline-flex'}} raised fill onClick={this.simpanKuota}>
                            <i className="icons f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                            Simpan
                        </Button>
                    </Block>
                </Page>
            </Popup>

            <div className="cardAtas">
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">

                        <Row noGap>
                            <Col width="100" tabletWidth="100">
                            {/* <HeaderSekolahPPDB sekolah={this.state.sekolah} /> */}
                            </Col>
                            <Col width="0" tabletWidth="30" className="hilangDiMobile">
                            <Card style={{margin:'4px'}}>
                                <CardContent>
                                    <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/")}>Beranda</Button>
                                    <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PPDB/")}>Data Pendaftar</Button>
                                    <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/kelolaJadwal/")}>Kelola Jadwal</Button>
                                    <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-3" tabLinkActive>Kelola Kuota</Button>
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
                                    <BlockTitle style={{marginLeft:'0px', marginTop:"0px", marginBottom:'8px'}}>Kuota PPDB Per Sekolah</BlockTitle>
                                    {/* <Button onClick={()=>this.$f7router.navigate("/editJadwal/")} raised fill className="bawahCiriBiru" style={{display:'inline-flex', marginBottom:'16px'}}>
                                        <i className="f7-icons" style={{fontSize:'20px'}}>plus</i>&nbsp;
                                        Tambah
                                    </Button> */}
                                    <div className="data-table" style={{overflowY:'hidden'}}>
                                        <div className="data-table-footer" style={{display:'block'}}>
                                            <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParams.start < 1 ? "disabled" : "" )}>
                                                <i className="icon icon-prev color-gray"></i>
                                                </a>
                                                <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParams.start)+20) >= parseInt(this.state.kuota.total) ? "disabled" : "" )}>
                                                    <i className="icon icon-next color-gray"></i>
                                                </a>
                                                <span className="data-table-pagination-label">{(this.state.routeParams.start+1)}-{(this.state.routeParams.start)+parseInt(this.state.routeParams.limit) <= parseInt(this.state.kuota.total) ? (this.state.routeParams.start)+parseInt(this.state.routeParams.limit) : parseInt(this.state.kuota.total)} dari {this.formatAngka(this.state.kuota.total)} Anggota Mitra</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{width:'100%', textAlign:'right'}}>
                                        <Button onClick={this.filter} raised style={{display:'inline-flex', marginTop:'-60px', marginRight:'4px'}}>
                                            <i className="icons f7-icons" style={{fontSize:'20px'}}>arrow_right_arrow_left_square</i>&nbsp;
                                            Filter
                                        </Button>
                                    </div>
                                    
                                    <Row noGap>
                                    {this.state.kuota.rows.map((option)=>{

                                    return (
                                        <Col key={option.jadwal_id} width="100" tabletWidth="100">
                                        <Card style={{marginTop:'4px', marginBottom:'4px', marginRight:'0px', marginLeft:'0px', borderLeft:'3px solid '+(option.jalur_id === '0100' ? 'red' : (option.jalur_id === '0200' ? 'purple' : (option.jalur_id === '0300' ? 'green' : (option.jalur_id === '0400' ? 'orange' : (option.jalur_id === '0500' ? 'teal' : 'gray'))))), borderRadius:'0px'}}>
                                            <CardContent>
                                                <Row style={{justifyContent:'end'}}>
                                                    <Col width="100">
                                                        <b>{option.nama}</b> ({option.npsn})
                                                        <br/>
                                                        <span style={{fontSize:'10px'}}>{option.bentuk} | {option.status} | {option.alamat}, {option.kecamatan}, {option.kabupaten}</span>
                                                    </Col>
                                                    {/* <Col width="20">
                                                        <Button className="bawahCiriBiru" raised fill onClick={()=>this.editKuota(option.nama, option.sekolah_id)}>
                                                            <i className="f7-icons" style={{fontSize:'20px'}}>pencil</i>
                                                            Edit
                                                        </Button>
                                                    </Col> */}
                                                    <Col width="20">
                                                        <Card style={{margin:'4px', borderRadius:'0px', borderTop:'2px solid #ddd'}}>
                                                            <CardContent style={{padding:'8px', minHeight:'40px', textAlign: 'center', fontSize:'10px'}}>
                                                                Affirmasi<br/>
                                                                <b style={{fontSize:'15px'}}>{option.kuota_0100 ? option.kuota_0100 : '0'}</b>
                                                                <br/>
                                                                <Button style={{height:'20px', fontSize:'10px'}} onClick={()=>this.editKuota(option.nama, option.sekolah_id, '0100', option.kuota_0100)}>
                                                                    <i className="f7-icons" style={{fontSize:'15px'}}>pencil</i>
                                                                    Edit
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                    <Col width="20">
                                                        <Card style={{margin:'4px', borderRadius:'0px', borderTop:'2px solid #ddd'}}>
                                                            <CardContent style={{padding:'8px', minHeight:'40px', textAlign: 'center', fontSize:'10px'}}>
                                                                Pindah Tugas<br/>
                                                                <b style={{fontSize:'15px'}}>{option.kuota_0200 ? option.kuota_0200 : '0'}</b>
                                                                <br/>
                                                                <Button style={{height:'20px', fontSize:'10px'}} onClick={()=>this.editKuota(option.nama, option.sekolah_id, '0200', option.kuota_0200)}>
                                                                    <i className="f7-icons" style={{fontSize:'15px'}}>pencil</i>
                                                                    Edit
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                    {parseInt(option.bentuk_pendidikan_id) === 6 &&
                                                    <Col width="20">
                                                        <Card style={{margin:'4px', borderRadius:'0px', borderTop:'2px solid #ddd'}}>
                                                            <CardContent style={{padding:'8px', minHeight:'40px', textAlign: 'center', fontSize:'10px'}}>
                                                                Prestasi<br/>
                                                                <b style={{fontSize:'15px'}}>{option.kuota_0300 ? option.kuota_0300 : '0'}</b>
                                                                <br/>
                                                                <Button style={{height:'20px', fontSize:'10px'}} onClick={()=>this.editKuota(option.nama, option.sekolah_id, '0300', option.kuota_0300)}>
                                                                    <i className="f7-icons" style={{fontSize:'15px'}}>pencil</i>
                                                                    Edit
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                    }
                                                    <Col width="20">
                                                        <Card style={{margin:'4px', borderRadius:'0px', borderTop:'2px solid #ddd'}}>
                                                            <CardContent style={{padding:'8px', minHeight:'40px', textAlign: 'center', fontSize:'10px'}}>
                                                                Zonasi<br/>
                                                                <b style={{fontSize:'15px'}}>{option.kuota_0400 ? option.kuota_0400 : '0'}</b>
                                                                <br/>
                                                                <Button style={{height:'20px', fontSize:'10px'}} onClick={()=>this.editKuota(option.nama, option.sekolah_id, '0400', option.kuota_0400)}>
                                                                    <i className="f7-icons" style={{fontSize:'15px'}}>pencil</i>
                                                                    Edit
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                    <Col width="20">
                                                        <Card style={{margin:'4px', borderRadius:'0px', borderTop:'2px solid #ddd'}}>
                                                            <CardContent style={{padding:'8px', minHeight:'40px', textAlign: 'center', fontSize:'10px'}}>
                                                                Tahfidz<br/>
                                                                <b style={{fontSize:'15px'}}>{option.kuota_0500 ? option.kuota_0500 : '0'}</b>
                                                                <br/>
                                                                <Button style={{height:'20px', fontSize:'10px'}} onClick={()=>this.editKuota(option.nama, option.sekolah_id, '0500', option.kuota_0500)}>
                                                                    <i className="f7-icons" style={{fontSize:'15px'}}>pencil</i>
                                                                    Edit
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </CardContent>
                                        </Card>
                                        </Col>
                                    )
                                    })}
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
    getKuota: Actions.getKuota,
    simpanKuota: Actions.simpanKuota
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

export default connect(mapStateToProps, mapDispatchToProps)(kelolaKuota);