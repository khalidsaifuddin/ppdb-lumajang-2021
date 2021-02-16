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

class HomePPDBPublik extends Component {

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
        peserta_didik: {
            rows: [],
            total: 0
        },
        statistik_sekolah: [],
        jadwal: {
            rows: [],
            total: 0
        },
        routeParams: {
            start: 0,
            limit: 20
        },
        sudah_cari: 0,
        total_pencarian: 0
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

    arrWarna = [
        '#D83F87',
        '#2A1B3D',
        '#44318D',
        '#E98074',
        '#fc5644'
    ]

    formatAngka = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }

    componentDidMount = () => {

        

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
                start: 0,
                urut_pilihan: 1
            }
        }, ()=> {
            
            this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
                
                this.setState({
                    loading: false,
                    peserta_didik: result.payload
                },()=>{

                    let total_pencarian = 0;

                    this.state.peserta_didik.rows.map((option)=>{
                        if(option.sekolah_pilihan.length > 0){
                            total_pencarian++
                        }
                    })

                    this.setState({
                        total_pencarian: total_pencarian
                    },()=>{
                        
                        this.$f7.dialog.close()

                    })

                })
        
        
            })
    
        })
    
    }


    render()
    {
        let hari_ini = '';
        hari_ini = moment().format('D') + ' ' + this.bulan[(moment().format('M')-1)] + ' ' + moment().format('YYYY');

        return (
            <Page name="HomePPDBPublik" hideBarsOnScroll>
            
                <HeaderPPDB />

                <div className="cardAtas">
                    <div>&nbsp;</div>
                    <Row>
                        <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                        <Col width="100" tabletWidth="90" desktopWidth="80">
                            
                            <Card style={{margin:'4px', marginBottom:'50px', paddingBottom:'20px'}}>
                                <CardContent>
                                    <BlockTitle style={{marginTop:'16px', marginBottom:'16px', textAlign:'center'}}>Cari Peserta Didik untuk mengetahui status pendaftaran</BlockTitle>
                                    <Searchbar
                                        className="searchbar-demo"
                                        placeholder="Cari peserta didik (Nama/NIK/NISN)..."
                                        onSubmit={this.cari}
                                        customSearch={true}
                                        onChange={this.ketikCari}
                                        value={this.state.routeParams.keyword}
                                        backdrop={false}
                                    />
                                </CardContent>

                                {parseInt(this.state.sudah_cari) === 0 &&
                                <Card noShadow style={{margin:'0px', borderRadius:'0px', marginTop:'8px', marginBottom:'50px'}}>
                                    <CardContent style={{padding:'8px', textAlign:'center'}}>
                                        <img src="/static/icons/cari_vector.png" style={{width:'60%'}} />
                                        <br/> 
                                        <span style={{color:'#4B75CB'}}>
                                        Lakukan pencarian untuk mengetahui status peserta didik di PPDB Lumajang 2021
                                        </span>
                                    </CardContent>
                                </Card>
                                }
                                {parseInt(this.state.sudah_cari) !== 0 &&
                                <Card noShadow style={{margin:'0px', borderRadius:'0px', marginTop:'8px', marginBottom:'50px'}}>
                                    <CardContent style={{padding:'8px'}}>
                                        <BlockTitle style={{marginTop:'8px', marginLeft:'8px'}}>Hasil Pencarian ({this.state.total_pencarian > 0 ? this.state.total_pencarian : '0'})</BlockTitle>
                                        {this.state.peserta_didik.rows.map((option)=>{
                                            if(option.sekolah_pilihan.length > 0){
                                                
                                                let tanggal = moment(option.last_update).format('D') + ' ' + this.bulan[(moment(option.last_update).format('M')-1)] + ' ' + moment(option.last_update).format('YYYY');
                                                let waktu = moment(option.last_update).format('H') + ':' + moment(option.last_update).format('mm');

                                                return (
                                                    <Card style={{marginLeft:'0px', marginRight:'0px'}}>
                                                        <CardContent style={{padding:'8px'}}>
                                                            <Row>
                                                                <Col width="100" tabletWidth="50" style={{display:'inline-flex'}}>
    
                                                                    {option.berkas_calon.map((optionBerkas)=>{
                                                                        if(parseInt(optionBerkas.jenis_berkas_id) === 8){
                                                                            return (
                                                                                <div style={{
                                                                                    height:'100px', 
                                                                                    width:'75px', 
                                                                                    border:'1px solid #eee', 
                                                                                    borderRadius:'10px', 
                                                                                    background:'url(https://be.diskuis.id'+optionBerkas.nama_file+')', 
                                                                                    backgroundSize:'cover',
                                                                                    backgroundPosition:'center'
                                                                                }}>
                                                                                    &nbsp;
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })}
                                                                    {option.berkas_calon.length < 1 &&
                                                                    <div style={{
                                                                        height:'100px', 
                                                                        width:'75px', 
                                                                        border:'0px solid #ccc', 
                                                                        borderRadius:'10px', 
                                                                        background:'url('+(option.jenis_kelamin === 'L' ? 'https://be.diskuis.id/assets/img/boy.jpg' : 'https://be.diskuis.id/assets/img/girl.jpg')+')', 
                                                                        backgroundSize:'cover',
                                                                        backgroundPosition:'center'
                                                                    }}>
                                                                        &nbsp;
                                                                    </div>
                                                                    }
                                                                    <div style={{marginLeft:'8px', marginBottom:'30px'}}>
                                                                        <b>{option.nama}</b><br/>
                                                                        <div style={{fontSize:'10px', marginBottom:'8px'}}>
                                                                            NIK: {option.nik} | NISN: {option.nisn}
                                                                            <br/>
                                                                            Sekolah Asal: <b>{option.asal_sekolah} {option.asal_sekolah_npsn ? <>({option.asal_sekolah_npsn})</> : ''}</b>
                                                                            <br/>
                                                                            {option.alamat_tempat_tinggal}, {option.kecamatan}, {option.kabupaten}, {option.provinsi}
                                                                            {/* Pembaruan Terakhir: {tanggal}, {waktu} */}
                                                                        </div>
                                                                        {/* <br/> */}
                                                                        <Button raised fill small style={{fontSize:'10px', height:'20px', display:'inline-flex'}} className={(parseInt(option.status_konfirmasi_id) === 1 ? 'color-theme-green' : 'color-theme-orange')}>
                                                                            <i className="f7-icons" style={{fontSize:'15px'}}>{parseInt(option.status_konfirmasi_id) === 1 ? 'checkmark_seal' : 'circle'}</i>&nbsp;
                                                                            {parseInt(option.status_konfirmasi_id) === 1 ? 'Terkonfirmasi' : 'Belum Terkonfirmasi'}
                                                                        </Button>
                                                                        {/* <br/> */}
                                                                        <div style={{fontSize:'10px', marginTop:'8px'}}>
                                                                            {parseInt(option.status_konfirmasi_id) === 1 ? <>Tanggal Konfirmasi: {tanggal}, {waktu}</> : ''}
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                                <Col width="100" tabletWidth="50">
                                                                    <BlockTitle style={{marginTop:'0px', marginLeft:'4px', marginBottom:'0px'}}>Jalur <b>{option.jalur}</b></BlockTitle>
                                                                    <Row noGap style={{justifyContent:'end'}}>
                                                                        {option.sekolah_pilihan.map((optionSekolah)=>{
                                                                            return (
                                                                                // <Col width="25" style={{
                                                                                //     background:'url(http://foto.data.kemdikbud.go.id/getImage/'+optionSekolah.npsn+'/1.jpg)', 
                                                                                //     backgroundSize:'cover'
                                                                                // }}>
                                                                                <Col width="25">
                                                                                    <Card style={{
                                                                                        backgroundImage:'url(http://foto.data.kemdikbud.go.id/getImage/'+optionSekolah.npsn+'/1.jpg)', 
                                                                                        backgroundSize:'cover',
                                                                                        color:'white',
                                                                                        margin:'4px',
                                                                                        marginLeft:'4px',
                                                                                        marginRight:'4px',
                                                                                        borderRadius:'10px'
                                                                                        // width:'100%'
                                                                                    }}>
                                                                                        <CardContent style={{
                                                                                            padding:'8px', 
                                                                                            background:'rgba(255, 255, 255, 0.8)', 
                                                                                            fontSize:'9px', 
                                                                                            color:'#434343',
                                                                                            borderRadius:'10px',
                                                                                            textAlign:'center',
                                                                                            minHeight:'75px'
                                                                                        }}>
                                                                                            <div style={{minHeight:'50px'}}>
                                                                                                <b>{optionSekolah.nama_sekolah}</b>
                                                                                                <br/>
                                                                                                {optionSekolah.npsn}
                                                                                            </div>
                                                                                            Pilihan
                                                                                            <br/>
                                                                                            <b style={{fontSize:'15px'}}>
                                                                                                #{optionSekolah.urut_pilihan}
                                                                                            </b>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                </Col>
                                                                            )
                                                                        })}
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </CardContent>
                                                    </Card>
                                                )

                                            }
                                        })}
                                    </CardContent>
                                </Card>
                                }
                            </Card>
                            
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
    getCalonPesertaDidik: Actions.getCalonPesertaDidik,
  }, dispatch);
}

function mapStateToProps({ App, Sekolah }) {
  return {
      window_dimension: App.window_dimension,
      loading: App.loading,
      tabBar: App.tabBar
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePPDBPublik);