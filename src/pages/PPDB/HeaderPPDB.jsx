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

class HeaderPPDB extends Component {

  state = {
    error: null,
    loading: true
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

  render()
    {
        return (
          <div>
            <div style={{marginTop:'-30px'}}>&nbsp;</div>
            {/* {parseInt(localStorage.getItem('sudah_login')) === 1 && */}
            <div className="merahAtas" style={{minHeight:'160px'}}>
              <Row>
                  <Col width="0" tabletWidth="10" desk  topWidth="15"></Col>
                  <Col width="100" tabletWidth="80" desktopWidth="70">
                      <div className="konten-ppdb-1">
                        <img src={"https://be.diskuis.id/assets/berkas/lumajang_logo_besar.png"} style={{height:'64px'}} />
                        <br/>
                        <Link href={"/PPDB/"+this.props.pengguna_id+'/'+this.props.sekolah_id} style={{color:'white'}}>
                          <h1 style={{marginTop:'0px', marginBottom:'0px', fontSize:'25px'}}>{localStorage.getItem('judul_aplikasi')}</h1>
                        </Link>
                        <h3 style={{marginTop:'0px', marginBottom:'0px', fontSize:'12px'}}>{localStorage.getItem('sub_judul_aplikasi')}</h3>
                        <div style={{marginTop:'15px', fontSize:'10px', fontWeight:'bold', marginLeft:'8px', display:'inline-flex', marginTop:'-8px'}}>
                            <span style={{marginTop:'12px', marginRight:'8px'}}>powered by</span>
                            <Link href="https://diskuis.id" className="external">
                              <img src={'https://be.diskuis.id/assets/berkas/diskuis_white.png'}  style={{height:'15px', margin:'auto', marginTop:'10px'}} />
                            </Link>
                        </div>
                      </div>
                  </Col>
                  <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
              </Row>
            </div>
            {/* } */}
          </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateWindowDimension: Actions.updateWindowDimension,
    setLoading: Actions.setLoading,
    setTabActive: Actions.setTabActive,
    getPertanyaan: Actions.getPertanyaan
  }, dispatch);
}

function mapStateToProps({ App, Pertanyaan, Notifikasi, Kuis, Ruang, Sekolah, Poin }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderPPDB);