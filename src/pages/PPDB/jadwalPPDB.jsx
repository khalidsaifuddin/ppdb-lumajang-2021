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

class jadwalPPDB extends Component {

  state = {
    error: null,
    loading: true,
    sekolah: {},
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
    
    this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
      this.setState({
          sekolah: result.payload.rows[0]
      },()=>{
        this.props.getJadwal({kode_wilayah:'052100'}).then((result)=>{
          this.setState({
            jadwal: result.payload
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

  render()
    {
        return (
          <Page name="jadwalPPDB" hideBarsOnScroll>
            
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
                                    <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                                  </Col>
                                  <Col width="0" tabletWidth="30" className="hilangDiMobile">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent>
                                        <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-0" onClick={()=>this.$f7router.navigate("/HomePPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Beranda</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-1" onClick={()=>this.$f7router.navigate("/PPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Data Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/formulirPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Tambah Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-3" tabLinkActive>Jadwal</Button>
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
                                          <BlockTitle style={{marginLeft:'0px', marginTop:"0px", marginBottom:'8px'}}>Jadwal PPDB</BlockTitle>
                                          <Row noGap>
                                          {this.state.jadwal.rows.map((option)=>{

                                            let waktu_mulai = '';
                                            waktu_mulai = moment(option.waktu_mulai).format('D') + ' ' + this.bulan[(moment(option.waktu_mulai).format('M')-1)] + ' ' + moment(option.waktu_mulai).format('YYYY');
                                            //  + ', pukul ' + moment(option.waktu_mulai).format('H') + ':' + moment(option.waktu_mulai).format('mm');

                                            let waktu_selesai = '';
                                            waktu_selesai = moment(option.waktu_selesai).format('D') + ' ' + this.bulan[(moment(option.waktu_selesai).format('M')-1)] + ' ' + moment(option.waktu_selesai).format('YYYY');
                                            //  + ', pukul ' + moment(option.waktu_selesai).format('H') + ':' + moment(option.waktu_selesai).format('mm');

                                            return (
                                              <Col key={option.jadwal_id} width="100" tabletWidth="100">
                                                <Card style={{marginRight:'0px', marginLeft:'0px', borderLeft:'3px solid '+(option.jalur_id === '0100' ? 'red' : (option.jalur_id === '0200' ? 'purple' : (option.jalur_id === '0300' ? 'green' : (option.jalur_id === '0400' ? 'orange' : (option.jalur_id === '0500' ? 'teal' : 'gray'))))), borderRadius:'0px'}}>
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
    getJadwal: Actions.getJadwal
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

export default connect(mapStateToProps, mapDispatchToProps)(jadwalPPDB);