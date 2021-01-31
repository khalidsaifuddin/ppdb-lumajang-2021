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

    console.log(this)
    
    this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
      this.setState({
          sekolah: result.payload.rows[0]
      })
    })

  }

  render()
    {
        return (
          <Page name="BerandaPPDB" hideBarsOnScroll>
            
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
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-1" tabLinkActive>Data Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/formulirPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Tambah Pendaftar</Button>
                                            <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange" tabLink="#tab-3" onClick={()=>this.$f7router.navigate("/jadwalPPDB/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])}>Jadwal</Button>
                                        </CardContent>
                                    </Card>
                                  </Col>
                                  <Col width="100" tabletWidth="70">
                                    <Card style={{margin:'4px'}}>
                                        <CardContent>
                                            data pendaftar
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
    getSekolah: Actions.getSekolah
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