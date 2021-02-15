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

class HeaderSekolahPPDB extends Component {

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

  componentDidMount = () => {
      console.log(this.props)
  }

  render()
    {
        return (
            <Card style={{margin:'4px'}}>
                <CardContent>
                  <Row>
                    <Col width="100" tabletWidth="70" style={{marginBottom:'8px'}}>
                        <div style={{
                            height:'80px', 
                            width:'80px',
                            background:'white', 
                            backgroundImage:'url('+"https://be.diskuis.id"+this.props.sekolah.gambar_logo+')',
                            backgroundSize:'cover',
                            position:'absolute',
                            marginTop:'-8px',
                            borderRadius:'20px',
                            border:'1px solid #CCC'
                        }}>
                            &nbsp;
                        </div>
                        <h1 className="namaSekolah" style={{marginLeft:'100px'}}>{this.props.sekolah.nama}</h1>
                        <h3 className="keteranganSekolah" style={{marginLeft:'100px'}}>{this.props.sekolah.keterangan}</h3>
                        <span className="alamatSekolah hilangDiMobile" style={{marginLeft:'100px'}}>{this.props.sekolah.alamat}</span>
                    </Col>
                    <Col width="100" tabletWidth="30" style={{textAlign:'right'}}>
                      {this.props.pengguna_id &&
                      <Button style={{display:'inline-flex'}} className="color-theme-teal" onClick={()=>this.props.f7.$f7router.navigate("/HomePPDB/"+this.props.pengguna_id+"/"+this.props.sekolah.sekolah_id)}>
                        <i className="f7-icons" style={{fontSize:'20px'}}>house</i>&nbsp;
                        Kembali ke Beranda
                      </Button>
                      }
                    </Col>
                  </Row>
                </CardContent>
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(HeaderSekolahPPDB);