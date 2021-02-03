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

class BerandaPPDB extends Component {

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

    // console.log(this)
    this.$f7.dialog.preloader()
    
    this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
      this.setState({
          sekolah: result.payload.rows[0]
      },()=>{
        this.props.getCalonPesertaDidik({sekolah_id:this.$f7route.params['sekolah_id']}).then((result)=>{
          this.setState({
            calon_peserta_didik: result.payload
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
          <Page name="BerandaPPDB" hideBarsOnScroll>
            
            <HeaderPPDB pengguna_id={this.$f7route.params['pengguna_id']} sekolah_id={this.$f7route.params['sekolah_id']} />

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
                                    <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                                  </Col>
                                  <Col width="0" tabletWidth="30">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Beranda</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-1" tabLinkActive>Data Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/formulirPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Tambah Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/jadwalPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jadwal</Button>
                                        </CardContent>
                                    </Card>
                                  </Col>
                                  <Col width="100" tabletWidth="70">
                                    <Card style={{margin:'4px', marginBottom:'50px'}}>
                                        <CardContent>
                                          <BlockTitle style={{marginTop:"0px", marginBottom:'8px'}}>Data Pendaftar</BlockTitle>
                                          <div className="data-table" style={{overflowY:'hidden'}}>
                                              <div className="data-table-footer" style={{display:'block'}}>
                                                  <div className="data-table-pagination" style={{textAlign:'right'}}>
                                                      <a onClick={this.klikPrev} href="#" className={"link "+(this.state.routeParamsFilter.start < 1 ? "disabled" : "" )}>
                                                      <i class="icon icon-prev color-gray"></i>
                                                      </a>
                                                      <a onClick={this.klikNext} href="#" className={"link "+((parseInt(this.state.routeParamsFilter.start)+20) >= parseInt(this.state.calon_peserta_didik.total) ? "disabled" : "" )}>
                                                          <i className="icon icon-next color-gray"></i>
                                                      </a>
                                                      <span className="data-table-pagination-label">{(this.state.routeParamsFilter.start+1)}-{(this.state.routeParamsFilter.start)+parseInt(this.state.routeParamsFilter.limit) <= parseInt(this.state.calon_peserta_didik.total) ? (this.state.routeParamsFilter.start)+parseInt(this.state.routeParamsFilter.limit) : parseInt(this.state.calon_peserta_didik.total)} dari {this.formatAngka(this.state.calon_peserta_didik.total)} Pendaftar</span>
                                                  </div>
                                              </div>
                                          </div>
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
                                                          <div className="fotoSekolah" style={{width:'90px', height:'90px', backgroundImage: "url(https://be.diskuis.id"+(pas_foto !== '' ? pas_foto : (option.jenis_kelamin === 'L' ? '/assets/img/boy.jpg' : '/assets/img/girl.jpg'))+")", backgroundSize:'cover', backgroundPosition:'center'}}>
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
                                                                <ListItem onClick={()=>this.$f7router.navigate("/formBiodata/"+option.calon_peserta_didik_id+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])} link="#" popoverClose title="Edit Biodata" />
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
    getCalonPesertaDidik: Actions.getCalonPesertaDidik
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