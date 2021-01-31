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
  Searchbar,
  Segmented,
  Popup,
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

class formSekolahPilihan extends Component {

    state = {
        error: null,
        loading: true,
        sekolah: {
            gambar_logo: '/assets/berkas/1.jpg'
        },
        routeParams: {
            pengguna_id: this.$f7route.params['pengguna_id'],
            sekolah_id: this.$f7route.params['sekolah_id'],
            peserta_didik_id: (this.$f7route.params['peserta_didik_id'] !== "null" ? (this.$f7route.params['peserta_didik_id'] ? this.$f7route.params['peserta_didik_id'] : null) : null),
        },
        jalur_id: "0100",
        sekolah_pilihan: {
            rows: [],
            total: 0
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

        this.props.getSekolah({sekolah_id:this.$f7route.params['sekolah_id'], pengguna_id: this.$f7route.params['pengguna_id']}).then((result)=>{
            this.setState({
                sekolah: result.payload.rows[0]
            },()=>{
                this.props.getJalurPPDB(this.state.routeParams).then((result)=>{

                    this.props.getCalonPesertaDidik(this.state.routeParams).then((result)=>{
                        this.setState({
                            routeParams: {
                                ...this.state.routeParams,
                                ...result.payload.rows[0]
                            }
                        },()=>{
                            this.props.getSekolahPilihan(this.state.routeParams).then((result)=>{
    
                                let jalur_id = this.state.jalur_id
    
                                if(result.payload.total > 0){
                                    jalur_id = result.payload.rows[0].jalur_id
                                }
    
                                this.setState({
                                    sekolah_pilihan: result.payload,
                                    jalur_id: jalur_id
                                },()=>{
                                    console.log(this.state)
                                })
                            })
                        })
                    })

                })


            })
        })

    }

    setFieldValue = (tipe) => (e) => {
        this.setState({
            ...this.state,
            [tipe]: e.currentTarget.value
        },()=>{
          console.log(this.state.routeParams)
        })
    }

    tambahSekolah = () => {
        // alert('tes')

        if(this.state.sekolah_pilihan.total < 5){
            //masih boleh
            this.$f7router.navigate("/pilihSekolahPilihan/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']+'/'+this.state.jalur_id+'/'+(parseInt(this.state.sekolah_pilihan.total)+1))
        }else{
            //udh nggak boleh
            this.$f7.dialog.alert('Mohon maaf, Anda hanya dapat memilih maksimal 4 sekolah', 'Peringatan')
        }

    }

    simpan = () => {
        this.$f7.dialog.preloader()
        
        this.props.simpanSekolahPilihan({peserta_didik_id: this.$f7route.params['peserta_didik_id'], jalur_id: this.state.jalur_id}).then((result)=> {
          this.$f7.dialog.close()
          this.$f7router.navigate("/formBerkas/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id']+'/'+this.state.jalur_id)
        })
      }

    hapusSekolah = (sekolah_id) => (e) => {
        this.$f7.dialog.confirm('Apakah Anda yakin ingin menghapus sekolah ini?', 'Konfirmasi', () => {
            this.props.simpanSekolahPilihan({
                peserta_didik_id: this.$f7route.params['peserta_didik_id'],
                sekolah_id: sekolah_id,
                soft_delete: 1
            }).then((result)=>{
                this.props.getSekolahPilihan(this.state.routeParams).then((result)=>{

                    let jalur_id = this.state.jalur_id

                    if(result.payload.total > 0){
                        jalur_id = result.payload.rows[0].jalur_id
                    }

                    this.setState({
                        sekolah_pilihan: result.payload,
                        jalur_id: jalur_id
                    })
                })
            })
        })
    }

    render()
    {
        return (
          <Page name="formSekolahPilihan" hideBarsOnScroll>
            
            <HeaderPPDB />

            <div className="cardAtas" style={{marginBottom:'50px'}}>
              <div>&nbsp;</div>
              <Row>
                  <Col width="0" tabletWidth="5" desktopWidth="10"></Col>
                  <Col width="100" tabletWidth="90" desktopWidth="80">
                    <Row noGap>
                        <Col width="100" tabletWidth="100">
                        <HeaderSekolahPPDB sekolah={this.state.sekolah} />
                        </Col>
                        <Col width="0" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent padding={false}>
                                <Segmented className="steps color-theme-deeporange" raised style={{borderRadius:'20px'}}>
                                <Button disabled={false} onClick={()=>this.$f7router.navigate("/formBiodata/"+this.$f7route.params['peserta_didik_id']+"/"+this.$f7route.params['pengguna_id']+"/"+this.$f7route.params['sekolah_id'])} style={{borderRadius:'20px 0px 0px 20px'}}>Biodata</Button>
                                <Button tabLinkActive>Jalur dan Pilihan Sekolah</Button>
                                <Button disabled={true}>Kelengkapan Berkas</Button>
                                <Button disabled={true}>Konfirmasi</Button>
                                </Segmented>
                            </CardContent>
                        </Card>
                        </Col>
                        <Col width="100" tabletWidth="100">
                        <Card style={{margin:'4px'}}>
                            <CardContent style={{padding:'8px'}}>
                                <Row>
                                    <Col width="100">
                                        <Card>
                                            <CardHeader>
                                                <b>Jalur PPDB</b>
                                            </CardHeader>
                                            <CardContent>
                                                <List>
                                                    <ListInput
                                                        // label="Jenis Kelamin"
                                                        type="select"
                                                        value={this.state.jalur_id}
                                                        placeholder="Pilih Jalur PPDB..."
                                                        onChange={this.setFieldValue('jalur_id')}
                                                    >
                                                        <option value={"0"} disabled>-</option>
                                                        {this.props.jalur.rows.map((option)=>{
                                                            return (
                                                                <option value={option.jalur_id}>{option.nama}</option>
                                                            )
                                                        })}
                                                    </ListInput>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col width="100">
                                        <Card>
                                            <CardHeader>
                                                Sekolah Pilihan
                                            </CardHeader>
                                            <CardContent>
                                                <Card style={{marginLeft:'0px', marginTop:'0px', marginRight:'0px'}}>
                                                    <CardContent style={{padding:'8px'}}>
                                                        <Row>
                                                            <Col width="15" tabletWidth="10" style={{textAlign:'center'}}>
                                                                <i className="icons f7-icons" style={{fontSize:'40px', color:'#434343'}}>info_circle</i>
                                                            </Col>
                                                            <Col width="85" tabletWidth="90" style={{color:'#434343'}}>
                                                                Jumlah minimal sekolah yang dipilih adalah <b>3 sekolah</b>, dan maksimal adalah <b>4 sekolah</b>, dengan sekolah keempat harus berstatus <b>sekolah swasta</b>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>

                                                <Button onClick={this.tambahSekolah} disabled={this.state.routeParams.jalur_id !== "0" ? false : true} raised fill className="bawahCiriBiru" style={{display:'inline-flex', marginBottom:'8px'}}>
                                                    <i className="f7-icons">plus</i>&nbsp;
                                                    Tambah Sekolah Pilihan
                                                </Button>
                                                <br/>
                                                {this.state.routeParams.jalur_id !== "0" ? <></> : <span style={{fontSize:'12px'}}>Mohon pilih jalur PPDB terlebih dahulu</span>}
                                                        
                                                <div style={{marginTop: '8px', marginBottom: '8px', minHeight:'100px', border:'2px dashed #ccc', borderRadius:'20px', padding:'8px'}}>
                                                    {this.state.sekolah_pilihan.total < 1 &&
                                                    <div style={{width:"100%", textAlign:'center'}}>
                                                        <img src="./static/icons/6671.jpg" style={{height:'200px'}} />
                                                        <br/>
                                                        Silakan tambah sekolah pilihan
                                                    </div>
                                                    }
                                                    {this.state.sekolah_pilihan.total > 0 &&
                                                    <div style={{width:"100%"}}>
                                                        {this.state.sekolah_pilihan.rows.map((option)=>{
                                                            return (
                                                                <Card key={option.sekolah_id} style={{marginRight:'0px', marginLeft:'0px'}}>
                                                                    <CardContent style={{padding:'8px'}}>
                                                                        <Row>
                                                                            <Col width="15" tabletWidth="10" desktopWidth="10" style={{textAlign:'center', fontSize:'10px'}}>
                                                                                Pilihan
                                                                                <br/>
                                                                                <span style={{fontSize:'20px'}}>#{option.urut_pilihan}</span>
                                                                            </Col>
                                                                            <Col width="25" tabletWidth="15" desktopWidth="10">
                                                                                <div className="fotoSekolah" style={{backgroundImage: "url(http://foto.data.kemdikbud.go.id/getImage/" + option.npsn + "/1.jpg)", backgroundSize:'cover', backgroundPosition:'center'}}>
                                                                                    &nbsp;
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="60" tabletWidth="55" desktopWidth="60" style={{paddingLeft:'4px'}}>
                                                                                <b>{option.nama}</b> ({option.npsn})
                                                                                <br/>
                                                                                <span style={{fontSize:'10px'}}>
                                                                                    {option.alamat}{option.kecamatan ? <>, {option.kecamatan}</> : <></>}{option.kabupaten ? <>, {option.kabupaten}</> : <></>}{option.provinsi ? <>, {option.provinsi}</> : <></>}
                                                                                </span>
                                                                                {/* <br/> */}
                                                                                {/* <span style={{fontSize:'10px'}}>
                                                                                    {option.bentuk} | {parseInt(option.status_sekolah) === 1 ? 'Negeri' : 'Swasta'}
                                                                                </span> */}
                                                                            </Col>
                                                                            <Col width="80" tabletWidth="15" desktopWidth="15">
                                                                                <div style={{fontSize:'8px', textAlign:'center', border:'2px dashed #ccc', borderRadius:'20px', marginTop:'8px', padding:'4px', paddingRight:'4px', margin:'4px'}}>
                                                                                    Jarak Rumah-Sekolah
                                                                                    <br/>
                                                                                    <span style={{fontSize:'16px', fontWeight:'bold'}}>{parseFloat(option.jarak) <= 50 ? parseFloat(option.jarak).toFixed(2) : '> 50'}</span> km
                                                                                </div>
                                                                            </Col>
                                                                            <Col width="20" tabletWidth="5" desktopWidth="5" style={{marginTop:'8px'}}>
                                                                                <Button onClick={this.hapusSekolah(option.sekolah_id)}>
                                                                                    <i className="f7-icons" style={{fontSize:'20px'}}>trash</i>
                                                                                </Button>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                        })}
                                                    </div>
                                                    }
                                                </div>
                                                <Button raised fill className="bawahCiriBiru" style={{display:'inline-flex'}} onClick={this.simpan}>
                                                    <i className="f7-icons" style={{fontSize:'20px'}}>floppy_disk</i>&nbsp;
                                                    Simpan dan Lanjut
                                                </Button>
                                            
                                            </CardContent>
                                        </Card>
                                    </Col>
                                                    
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
        getCalonPesertaDidik: Actions.getCalonPesertaDidik,
        getWilayah: Actions.getWilayah,
        getJalurPPDB: Actions.getJalurPPDB,
        getSekolahPilihan: Actions.getSekolahPilihan,
        simpanSekolahPilihan: Actions.simpanSekolahPilihan
    }, dispatch);
}

function mapStateToProps({ App, Sekolah, PPDB }) {
    return {
        window_dimension: App.window_dimension,
        loading: App.loading,
        tabBar: App.tabBar,
        wilayah: App.wilayah,
        sekolah: Sekolah.sekolah,
        cek_nik: PPDB.cek_nik,
        cek_nisn: PPDB.cek_nisn,
        calon_peserta_didik: PPDB.calon_peserta_didik, 
        jalur: PPDB.jalur
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(formSekolahPilihan);