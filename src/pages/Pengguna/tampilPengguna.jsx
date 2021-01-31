import React, {Component} from 'react';
import {
    Page, Navbar, NavTitle, NavTitleLarge, CardContent, Card, Row, Col, Segmented, Button, Tabs, Tab, Link, CardFooter
} from 'framework7-react';

import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';
import NotifikasiReducer from '../../store/reducers/Notifikasi.reducers';



class tampilPengguna extends Component {
    state = {
        error: null,
        loading: true,
        routeParams:{
            pengguna_id: this.$f7route.params['pengguna_id']
        },
        loading:true,
        pengguna: {},
        pengikut: 0,
        mengikuti: 0,
        status_mengikuti: 'N',
        disabledButtonMengikuti: false,
        aktivitas: {
            rows: [],
            total: 0
        },
        startAktivitas: 0
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

    componentDidMount = () => {
        
        this.props.getPengguna(this.state.routeParams).then((result)=>{
            this.setState({
                pengguna: this.props.pengguna.rows[0],
                routeParamsCek: {
                    pengguna_id: this.props.pengguna.rows[0].pengguna_id,
                    pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                    soft_delete: 0
                },
                routeParamsAktivitas: {
                    pengguna_id: this.props.pengguna.rows[0].pengguna_id,
                    start: this.state.startAktivitas,
                    tipe: (this.props.pengguna.rows[0].pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'privat' : 'publik')
                },
                routeParamsKuis: {
                    pengguna_id: this.props.pengguna.rows[0].pengguna_id,
                    hanya_publik: (this.props.pengguna.rows[0].pengguna_id === JSON.parse(localStorage.getItem('user')).pengguna_id ? 'N' : 'Y')
                }
            },()=>{
                this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                    this.setState({
                        status_mengikuti: result.payload.status
                    });
                });

                this.props.getAktivitas(this.state.routeParamsAktivitas).then((result)=>{
                    this.setState({
                        aktivitas: {
                          rows: [
                            ...this.state.aktivitas.rows,
                            ...this.props.aktivitas.rows
                          ],
                          total: (parseInt(this.state.aktivitas.total)+parseInt(this.props.aktivitas.total))
                        }
                    });
                });

                this.props.getKuisDiikuti(this.state.routeParamsKuis).then((result)=>{
                    this.setState({
                        loading: false
                    });
                });
            });
        });

        this.props.getPengikut(this.state.routeParams).then((result)=>{
            this.props.pengikut.map((option)=>{
                if(option.label === 'pengikut'){
                    this.setState({
                        pengikut: option.jumlah
                    });
                }
                if(option.label === 'mengikuti'){
                    this.setState({
                        mengikuti: option.jumlah
                    });
                }
            });

            
        });

    }

    ikutiPengguna = () => {
        this.setState({
            routeParamsPengikut: {
                pengguna_id: this.state.pengguna.pengguna_id,
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 0
            },
            disabledButtonMengikuti: true
        },()=>{
            this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
                this.setState({
                    routeParamsCek: {
                        pengguna_id: this.state.pengguna.pengguna_id,
                        pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                        soft_delete: 0
                    }
                },()=>{
                    this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                        this.setState({
                            status_mengikuti: result.payload.status,
                            disabledButtonMengikuti: false
                        },()=>{
                            this.props.getPengikut(this.state.routeParams).then((result)=>{
                                this.props.pengikut.map((option)=>{
                                    if(option.label === 'pengikut'){
                                        this.setState({
                                            pengikut: option.jumlah
                                        });
                                    }
                                    if(option.label === 'mengikuti'){
                                        this.setState({
                                            mengikuti: option.jumlah
                                        });
                                    }
                                });            
                            });
                        });
                    });
                });
            });
        });
    }

    stopIkutiPengguna = () => {
        this.setState({
            routeParamsPengikut: {
                pengguna_id: this.state.pengguna.pengguna_id,
                pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                soft_delete: 1
            },
            disabledButtonMengikuti: true
        },()=>{
            this.props.simpanPengikut(this.state.routeParamsPengikut).then((result)=>{
                this.setState({
                    routeParamsCek: {
                        pengguna_id: this.state.pengguna.pengguna_id,
                        pengguna_id_pengikut: JSON.parse(localStorage.getItem('user')).pengguna_id,
                        soft_delete: 0
                    }
                },()=>{
                    this.props.cekMengikuti(this.state.routeParamsCek).then((result)=>{
                        this.setState({
                            status_mengikuti: result.payload.status,
                            disabledButtonMengikuti: false
                        },()=>{
                            this.props.getPengikut(this.state.routeParams).then((result)=>{
                                this.props.pengikut.map((option)=>{
                                    if(option.label === 'pengikut'){
                                        this.setState({
                                            pengikut: option.jumlah
                                        });
                                    }
                                    if(option.label === 'mengikuti'){
                                        this.setState({
                                            mengikuti: option.jumlah
                                        });
                                    }
                                });            
                            });
                        });
                    });
                });
            });
        });
    }

    render()
    {
        return (
            // <Page name="tampilPengguna" hideBarsOnScroll className="halamanRuang">
            <Page name="tampilPengguna" hideBarsOnScroll>
                <Navbar sliding={false} backLink="Kembali" onBackClick={this.backClick}>
                    <NavTitle sliding>{this.state.pengguna.nama}</NavTitle>
                    {/* <NavTitleLarge>
                        {this.state.pengguna.nama}
                    </NavTitleLarge> */}
                </Navbar>
                <Row>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                    <Col width="0" tabletWidth="80" desktopWidth="70">

                        <Card>
                            <CardContent>
                                <Row>
                                    <Col width="30" tabletWidth="20" style={{textAlign:'center'}}>
                                        <img src={this.state.pengguna.gambar} style={{width:'100px', height:'100px', borderRadius:'50%'}}/>
                                        {this.$f7route.params['pengguna_id'] === JSON.parse(localStorage.getItem('user')).pengguna_id &&
                                        <Button raised fill onClick={()=>this.$f7router.navigate('/ProfilPengguna/')}>
                                            Edit Profil
                                        </Button>
                                        }
                                    </Col>
                                    <Col width="70" tabletWidth="80">
                                        <h1 style={{marginBottom:'0px', color:'#2670AF'}}>{this.state.pengguna.nama}</h1>
                                        <h3 style={{marginTop:'0px', fontWeight:'normal'}}>{this.state.pengguna.username}</h3>

                                        <Row>
                                            <Col width="100" tabletWidth="50" style={{border:'1px solid #cccccc', padding:'8px', borderRadius:'8px', marginBottom:'8px'}}>
                                                <Row noGap>
                                                    <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_2_fill</i>&nbsp;
                                                        <b>{this.state.pengikut}</b> Pengikut
                                                    </Col>
                                                    <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_2_fill</i>&nbsp;
                                                        <b>{this.state.mengikuti}</b> Mengikuti
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col width="100" tabletWidth="50" style={{border:'1px solid #cccccc', padding:'8px', borderRadius:'8px', marginBottom:'8px'}}>
                                                <Row noGap>
                                                    <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>star_fill</i>&nbsp;
                                                        <b>0</b> Poin
                                                    </Col>
                                                    {/* <Col width="50">
                                                        <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>checkmark_seal</i>&nbsp;
                                                        <b>2</b> Trofi
                                                    </Col> */}
                                                </Row>
                                            </Col>
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id !== this.state.pengguna.pengguna_id && this.state.status_mengikuti === 'N' &&
                                            <Col width="100" tabletWidth="50" style={{border:'0px solid #cccccc', padding:'0px', borderRadius:'8px', marginBottom:'8px'}}>
                                                <Button disabled={this.state.disabledButtonMengikuti} raised fill onClick={this.ikutiPengguna}>
                                                    <i className="icon f7-icons" style={{fontSize:'20px', color:'#cccccc'}}>person_badge_plus_fill</i>&nbsp;
                                                    Ikuti
                                                </Button>
                                            </Col>
                                            }
                                            {JSON.parse(localStorage.getItem('user')).pengguna_id !== this.state.pengguna.pengguna_id && this.state.status_mengikuti === 'Y' &&
                                            <Col width="100" tabletWidth="50" style={{border:'0px solid #cccccc', padding:'0px', borderRadius:'8px', marginBottom:'8px'}}>
                                                <Button disabled={this.state.disabledButtonMengikuti} raised fill onClick={this.stopIkutiPengguna} style={{background:'#cccccc'}}>
                                                    <i className="icon f7-icons" style={{fontSize:'20px', color:'#434343'}}>person_crop_circle_fill_badge_checkmark</i>&nbsp;
                                                    <span style={{color:'#434343'}}>Mengikuti</span>
                                                </Button>
                                            </Col>
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Segmented raised>
                                    <Button tabLink="#tab-tampil-10" tabLinkActive className="color-theme-deeporange">Aktivitas</Button>
                                    <Button tabLink="#tab-tampil-1" className="color-theme-deeporange">Kuis ({this.props.kuis_diikuti ? this.props.kuis_diikuti.total : '0'})</Button>
                                    {/* <Button tabLink="#tab-tampil-2">Ruang (0)</Button> */}
                                    {/* <Button tabLink="#tab-tampil-3">Trofi (0)</Button> */}
                                </Segmented>
                                <Tabs animated>
                                    <Tab id="tab-tampil-10" tabActive>
                                        <Card style={{marginRight:'1px', marginLeft:'1px'}}>
                                            <CardContent>
                                                {this.state.aktivitas.total > 0 && 
                                                    <div className="timeline" style={{paddingTop:'0px', paddingLeft:'0px', paddingRight:'0px', marginTop:'0px'}}>
                                                    {this.state.aktivitas.rows.map((option)=>{

                                                        // let tanggal = '';
                                                        let tgl = new Date(option.create_date);
                                                        let tanggal = moment(option.create_date).format('D') + ' ' + this.bulan[(moment(option.create_date).format('M')-1)] + ' ' + moment(option.create_date).format('YYYY');
                                                        let waktu = moment(option.create_date).format('H') + ':' + moment(option.create_date).format('mm');

                                                        return (
                                                        <div className="timeline-item">
                                                            <div className="timeline-item-date" style={{fontSize:'10px'}}>
                                                            {tanggal}
                                                            <br/>
                                                            {waktu}
                                                            </div>
                                                            <div className="timeline-item-divider"></div>
                                                            <div className="timeline-item-content card">
                                                            {/* <div className="card-header">Card header</div> */}
                                                            <div className="card-content card-content-padding" style={{padding:'8px'}}>
                                                                <Row>
                                                                <Col width="15">
                                                                    <Link href={"/tampilPengguna/"+option.pengguna_id_pelaku}>
                                                                    <img src={option.gambar} style={{width:'50px', height:'50px', borderRadius:'50%'}} />
                                                                    </Link>
                                                                </Col>
                                                                <Col width="85">
                                                                    <Link href={"/tampilPengguna/"+option.pengguna_id}>
                                                                    <div style={{fontWeight:'normal', color:'#039be5'}}>{option.nama_pengguna}</div>
                                                                    </Link>
                                                                    <div dangerouslySetInnerHTML={{ __html: option.keterangan_teks }} />
                                                                    {/* {parseInt(option.jenis_linimasa_id) === 1 && <Link onClick={()=>this.$f7router.navigate(option.tautan)}>(Kunjungi Ruang)</Link>}
                                                                    {parseInt(option.jenis_linimasa_id) === 2 && <Link onClick={()=>this.$f7router.navigate(option.tautan)}>(Kunjungi Ruang)</Link>}
                                                                    {parseInt(option.jenis_linimasa_id) === 3 && <Link onClick={()=>this.$f7router.navigate(option.tautan)}>(Lihat Peringkat)</Link>} */}
                                                                </Col>
                                                                </Row>
                                                            </div>
                                                            {/* <div className="card-footer" style={{padding:'4px', justifyContent:'flex-end'}}>
                                                                {parseInt(option.jenis_linimasa_id) === 1 && <Button raised fill onClick={()=>this.$f7router.navigate(option.tautan)}>Kunjungi Ruang</Button>}
                                                                {parseInt(option.jenis_linimasa_id) === 2 && <Button raised fill onClick={()=>this.$f7router.navigate(option.tautan)}>Kunjungi Ruang</Button>}
                                                                {parseInt(option.jenis_linimasa_id) === 3 && <Button raised fill onClick={()=>this.$f7router.navigate(option.tautan)}>Lihat Peringkat</Button>}
                                                            </div> */}
                                                            </div>
                                                        </div>
                                                        )
                                                    })}
                                                    <Button fill onClick={()=>console.log('lagi')} style={{background:'#cccccc', marginTop:'8px'}}>Tampilkan linimasa lebih lama</Button>                    
                                                    </div>
                                                }
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                    <Tab id="tab-tampil-1">
                                        <Card style={{marginRight:'1px', marginLeft:'1px'}}>
                                            <CardContent>
                                                <Row noGap style={{justifyContent:'flex-start'}}>
                                                {this.props.kuis_diikuti.rows.map((optionKuis)=>{
                                                    let waktu_mengerjakan = '';
                                                    let tgl_waktu_mengerjakan = new Date(optionKuis.waktu_mengerjakan);
                                                    waktu_mengerjakan = moment(optionKuis.waktu_mengerjakan).format('D') + ' ' + this.bulan[(moment(optionKuis.waktu_mengerjakan).format('M')-1)] + ' ' + moment(optionKuis.waktu_mengerjakan).format('YYYY') + ', pukul ' + moment(optionKuis.waktu_mengerjakan).format('H') + ':' + moment(optionKuis.waktu_mengerjakan).format('mm');

                                                    
                                                    return (
                                                        <Col width="50" tabletWidth="33">
                                                            <Card>
                                                                <CardContent 
                                                                    style={{
                                                                        background:'#37474F',
                                                                        backgroundImage:'url("'+localStorage.getItem('api_base')+'/assets/berkas/'+optionKuis.gambar_kuis+'")', 
                                                                        backgroundSize:'cover',
                                                                        height:'100px'
                                                                    }}
                                                                >
                                                                    <h2 style={{
                                                                        marginTop:'0px', 
                                                                        background:'rgba(0, 0, 0, 0.6)', 
                                                                        color:'white',
                                                                        padding:'4px',
                                                                        marginBottom:'0px'
                                                                    }}>
                                                                        {optionKuis.judul}
                                                                    </h2>
                                                                    <h4 style={{
                                                                        marginTop:'0px', 
                                                                        background:'rgba(0, 0, 0, 0.6)', 
                                                                        color:'white',
                                                                        padding:'4px',
                                                                        fontSize:'10px'
                                                                    }}>
                                                                        Sesi {optionKuis.keterangan_sesi_kuis}
                                                                    </h4>
                                                                </CardContent>
                                                                <CardContent style={{
                                                                    background:'white', 
                                                                    // background:'rgba(0, 0, 0, 0.6)', 
                                                                    height:'50px',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <Row noGap>
                                                                        <Col width={60}>
                                                                            {/* <p> */}
                                                                                <div style={{fontSize:'10px', fontStyle:'italic'}}>{optionKuis.keterangan ? optionKuis.keterangan : <>Tidak ada deskripsi</>}</div>
                                                                                {/* <br/> */}
                                                                                <div style={{fontSize:'10px'}}>
                                                                                    Tanggal {waktu_mengerjakan}
                                                                                </div>
                                                                            {/* </p> */}
                                                                        </Col>
                                                                        <Col width={40} style={{textAlign:'right'}}>
                                                                            <div style={{fontSize:'10px'}}>
                                                                                Skor
                                                                            </div>
                                                                            <div style={{fontSize:'30px', fontWeight:'bold', color:'#434343'}}>{(optionKuis.skor ? parseFloat(optionKuis.skor).toFixed(1) : "0")}</div>
                                                                            {/* <div style={{fontSize:'10px'}}>
                                                                                Peringkat {optionKuis.peringkat} dari {optionKuis.total_peserta} peserta
                                                                            </div> */}
                                                                        </Col>
                                                                    </Row>
                                                                </CardContent>
                                                                <CardFooter style={{
                                                                    background:'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)'
                                                                    // background:'rgba(0, 0, 0, 0.8)'
                                                                }}>
                                                                    <Button raised fill>
                                                                        Rincian
                                                                    </Button>
                                                                </CardFooter>
                                                            </Card>
                                                        </Col>
                                                    )
                                                })}
                                                </Row>
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                    <Tab id="tab-tampil-2">
                                        <Card style={{marginRight:'1px', marginLeft:'1px'}}>
                                            <CardContent>
                                                daftar ruang
                                            </CardContent>
                                        </Card>
                                    </Tab>
                                    {/* <Tab id="tab-tampil-3">
                                        <Card style={{marginRight:'1px', marginLeft:'1px'}}>
                                            <CardContent>
                                                daftar trofi
                                            </CardContent>
                                        </Card>
                                    </Tab> */}
                                    </Tabs>
                            </CardContent>
                        </Card>
                    </Col>
                    <Col width="0" tabletWidth="10" desktopWidth="15"></Col>
                </Row>
            </Page>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
      updateWindowDimension: Actions.updateWindowDimension,
      setLoading: Actions.setLoading,
      getPengguna: Actions.getPengguna,
      simpanPengikut: Actions.simpanPengikut,
      getPengikut: Actions.getPengikut,
      cekMengikuti: Actions.cekMengikuti,
      getAktivitas: Actions.getAktivitas,
      getKuisDiikuti: Actions.getKuisDiikuti
    }, dispatch);
}

function mapStateToProps({ App, Notifikasi, Aktivitas, Kuis }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        pengguna: App.pengguna,
        pengikut: Notifikasi.pengikut,
        aktivitas: Aktivitas.aktivitas,
        kuis_diikuti: Kuis.kuis_diikuti
    }
}

export default (connect(mapStateToProps, mapDispatchToProps)(tampilPengguna));
  