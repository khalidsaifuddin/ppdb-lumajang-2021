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

class editJadwal extends Component {

    state = {
        error: null,
        loading: true,
        sekolah: {},
        jadwal: {
            rows: [],
            total: 0
        },
        jalur: {
            rows: [],
            total: 0   
        },
        routeParams:{
            start: 0,
            limit: 20,
            jadwal_id: this.$f7route.params['jadwal_id'] ? this.$f7route.params['jadwal_id'] : null
        }
    }

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

        this.props.getJalurPPDB(this.state.routeParams).then((result)=>{
            this.setState({
                jalur: result.payload
            },()=>{

                if(this.$f7route.params['jadwal_id']){
                    
                    this.props.getJadwal(this.state.routeParams).then((result)=>{
                        this.setState({
                            jadwal: result.payload,
                            routeParams: {
                                ...this.state.routeParams,
                                ...result.payload.rows[0]
                            }
                        },()=>{
                            
                        })
                    })

                }
            
            })
        })
        

    }

    setValue = (kolom) => (e) => {
        
        this.setState({
            routeParams: {
                ...this.state.routeParams,
                [kolom]: e.currentTarget.value
            }
        })

    }
    
    simpan = () => {
        // alert('tes')
        this.$f7.dialog.preloader()
        this.props.simpanJadwal(this.state.routeParams).then((result)=>{
            this.$f7.dialog.close()
            if(result.payload.sukses){
                this.$f7.dialog.alert('Berhasil menyimpan data','Berhasil',()=>{
                    this.$f7router.navigate("/kelolaJadwal/")
                })
            }else{
                this.$f7.dialog.alert('Gagal menyimpan data. Mohon coba kembali dalam beberapa saat','Gagal')
            }
        })
    }

    render()
    {
        return (
          <Page name="editJadwal" hideBarsOnScroll>
            
            <HeaderPPDB />

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
                                    <Button style={{borderRadius:'20px', marginBottom:'4px'}} className="color-theme-deeporange bawahCiri" tabLink="#tab-3" tabLinkActive>Kelola Jadwal</Button>
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
                                        <Link href="/kelolaJadwal/">
                                            <i className="f7-icons" style={{fontSize:'20px'}}>chevron_left</i>&nbsp;
                                            Kembali ke Kelola Jadwal
                                        </Link>
                                        {!this.$f7route.params['jadwal_id'] &&
                                        <BlockTitle style={{marginLeft:'0px'}}>Tambah Jadwal Baru</BlockTitle>
                                        }
                                        {this.$f7route.params['jadwal_id'] &&
                                        <BlockTitle style={{marginLeft:'0px'}}>Edit Jadwal</BlockTitle>
                                        }
                                        <List style={{marginTop:'16px'}}>
                                            <ListInput
                                                label="Jalur"
                                                type="select"
                                                value={this.state.routeParams.jalur_id || ''}
                                                placeholder="Pilih Jalur..."
                                                onChange={this.setValue('jalur_id')}
                                            >
                                                <option value={null} selected={this.state.routeParams.jalur_id ? false : true}>-</option>
                                                {this.state.jalur.rows.map((option)=>{
                                                    return (
                                                        <option value={option.jalur_id}>{option.nama}</option>
                                                    )
                                                })}
                                            </ListInput>
                                            <ListInput
                                                label="Tahap"
                                                type="number"
                                                placeholder="Tahap"
                                                clearButton
                                                value={this.state.routeParams.tahap || ''}
                                                onChange={this.setValue('tahap')}
                                            />
                                            <ListInput
                                                label="Waktu Mulai"
                                                type="date"
                                                placeholder="Waktu Mulai..."
                                                value={this.state.routeParams.waktu_mulai}
                                                onChange={this.setValue('waktu_mulai')}
                                                style={{maxWidth:'100%'}}
                                                className="tanggalan"
                                            />
                                            <ListInput
                                                label="Waktu Selesai"
                                                type="date"
                                                placeholder="Waktu Selesai..."
                                                value={this.state.routeParams.waktu_selesai}
                                                onChange={this.setValue('waktu_selesai')}
                                                style={{maxWidth:'100%'}}
                                                className="tanggalan"
                                            />
                                        </List>
                                        <br/>
                                        <Button onClick={this.simpan} raised fill className="bawahCiriBiru" style={{display:'inline-flex', marginBottom:'16px', marginTop:'16px'}}>
                                            <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                            Simpan
                                        </Button>
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
    getJadwal: Actions.getJadwal,
    getJalurPPDB: Actions.getJalurPPDB,
    simpanJadwal: Actions.simpanJadwal
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

export default connect(mapStateToProps, mapDispatchToProps)(editJadwal);